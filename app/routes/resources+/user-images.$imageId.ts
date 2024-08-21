import type { LoaderFunctionArgs } from "@remix-run/node";
import { db } from "#db/db.server";

export async function loader({ params }: LoaderFunctionArgs) {
	if (!params.imageId) {
		throw new Response("Image ID is required", { status: 400 });
	}
	const image = await db.query.user_images.findFirst({
		where: (image, { eq }) => eq(image.id, params.imageId || ""),
	});

	if (!image) {
		throw new Response("Not found", { status: 404 });
	}

	return new Response(image.blob, {
		headers: {
			"Content-Type": image.content_type,
			"Content-Length": Buffer.byteLength(image.blob).toString(),
			"Content-Disposition": `inline; filename="${params.imageId}"`,
			"Cache-Control": "public, max-age=31536000, immutable",
		},
	});
}
