import { db } from '#db/db.server';
import { properties } from '#db/schema';
import { json, LoaderFunctionArgs } from '@remix-run/node';
import { eq, ilike, and } from 'drizzle-orm';

async function getUniquePropertyValues(
  propertyKey: string,
  page: number = 1,
  pageSize: number = 10,
  search: string = ''
) {
  const offset = (page - 1) * pageSize;

  const query = db.selectDistinct({
    key: properties.text_value,
  })
  .from(properties)
  .where(search.trim() ? and(eq(properties.key, propertyKey), ilike(properties.text_value, `%${search}%`)) : eq(properties.key, propertyKey))
  .limit(pageSize)
  .offset(offset)
  .orderBy(properties.text_value);

  const result = await query.execute();

  return result.map((item) => item.key);
}

export const loader = async (remixContext: LoaderFunctionArgs) => {
    const url = new URL(remixContext.request.url);
    const page = url.searchParams.get("page") || 0;
    const propertyKey = url.searchParams.get("propertyKey") || "";
    const pageSize = url.searchParams.get("pageSize") || 10;
    const search = url.searchParams.get("search") || "";
  
    const items = await getUniquePropertyValues(propertyKey, Number(page), Number(pageSize), search);
  
    return json(items);
  };

  export type UniqueTextOptionsLoader = typeof loader;