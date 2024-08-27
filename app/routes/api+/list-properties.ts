import { getTableColumns } from 'drizzle-orm';
import { db } from '#db/db.server';
import { properties, Property, records } from '#db/schema';
import { eq, ilike, and } from 'drizzle-orm';
import { json, LoaderFunctionArgs } from '@remix-run/node';

async function getPropertiesForRecordType(
  recordType: "account" | "user" | "contact" | "opportunity" | "task" | "ticket",
  page: number = 1,
  pageSize: number = 10,
  search: string = ''
) {
  const offset = (page - 1) * pageSize;

  const query = await db
    .select({
      ...getTableColumns(properties),
    })
    .from(properties)
    .leftJoin(records, eq(properties.record_id, records.id))
    .where(search.trim() ? and(eq(records.record_type, recordType), ilike(properties.key, `%${search}%`)) : eq(records.record_type, recordType))
    .limit(pageSize)
    .offset(offset)
    .orderBy(properties.key)
    .execute();

    return query as Property[];
}

export const loader = async (remixContext: LoaderFunctionArgs) => {
    const url = new URL(remixContext.request.url);
    const page = url.searchParams.get("page") || 0;
    const recordType = url.searchParams.get("recordType") || "account";
    const pageSize = url.searchParams.get("pageSize") || 10;
    const search = url.searchParams.get("search") || "";
  
    const items = await getPropertiesForRecordType(recordType as "account" | "user" | "contact" | "opportunity" | "task" | "ticket", Number(page), Number(pageSize), search);
  
    return json(items);
  };

export type ListPropertiesLoader = typeof loader;