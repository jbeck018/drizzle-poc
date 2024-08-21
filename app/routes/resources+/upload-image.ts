import { type SubmissionResult } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import {
	MaxPartSizeExceededError,
	json,
	unstable_createMemoryUploadHandler,
	unstable_parseMultipartFormData,
} from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/router";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { requireUser } from "#app/modules/auth/auth.server";
import { createToastHeaders } from "#app/utils/toast.server";
import { db } from "#db/db.server";
import { user_images } from "#db/schema";

export const ROUTE_PATH = "/resources/upload-image" as const;
export const MAX_FILE_SIZE = 1024 * 1024 * 3; // 3MB

export const ImageSchema = z.object({
	imageFile: z
		.instanceof(File)
		.refine((file) => file.size > 0, "Image is required."),
});

export async function action({ request }: ActionFunctionArgs) {
	try {
		const user = await requireUser(request);

		const formData = await unstable_parseMultipartFormData(
			request,
			unstable_createMemoryUploadHandler({ maxPartSize: MAX_FILE_SIZE }),
		);
		const submission = await parseWithZod(formData, {
			schema: ImageSchema.transform(async (data) => {
				return {
					image: {
						contentType: data.imageFile.type,
						blob: Buffer.from(await data.imageFile.arrayBuffer()),
					},
				};
			}),
			async: true,
		});
		if (submission.status !== "success") {
			return json(submission.reply(), {
				status: submission.status === "error" ? 400 : 200,
			});
		}

		const { image } = submission.value;
		await db.transaction(async (tx) => {
			await tx.delete(user_images).where(eq(user_images.user_id, user.id));
			await tx.insert(user_images).values({
				content_type: image.contentType,
				blob: image.blob,
				user_id: user.id,
			});
		});

		return json(submission.reply({ fieldErrors: {} }), {
			headers: await createToastHeaders({
				title: "Success!",
				description: "Image uploaded successfully.",
			}),
		});
	} catch (error: unknown) {
		if (error instanceof MaxPartSizeExceededError) {
			const result: SubmissionResult = {
				initialValue: {},
				status: "error",
				error: {
					imageFile: ["Image size must be less than 3MB."],
				},
				state: {
					validated: {
						imageFile: true,
					},
				},
			};
			return json(result, { status: 400 });
		} else throw error;
	}
}
