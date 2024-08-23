import type { LoaderFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import { json } from "@remix-run/node"; // or cloudflare/deno
import { Await, defer, useSearchParams } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { eq } from 'drizzle-orm';
import { Suspense, useEffect, useMemo, useState } from 'react'
import { BaseTableData } from '#app/components/table/types';
import { createBaseTableColumns } from "#app/components/table/utiils";
import { db } from '../../../db/db.server';
import { record_type_zod_enum, records } from '../../../db/schema';
import { CardSkeletonList, DataTable, ErrorComponent, ListContainerWithSearch } from '../../components';

export const ROUTE_PATH = '/dashboard/accounts' as const

export const loader = async ({
    request
  }: LoaderFunctionArgs) => {
    const url = new URL(request.url);
    const term = url.searchParams.get("query") || '';
    console.log(term);
    const data = await db.query.records.findMany({
        where: eq(records.record_type, record_type_zod_enum.enum.account),
        with: {
            properties: true,
          },
        limit: 10,
    })
    
    if (!data) {
        throw json(
            { accounts: [] },
            { status: 401 }
          );
    }

    return defer({ data });
  };

export const Accounts = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('query'));

    useEffect(() => {
        setSearchParams(prev => {
            prev.set("query", searchTerm || '');
            return prev;
        });
    }, [searchTerm])

    const { data: accounts } = useLoaderData<typeof loader>();

    const columns = useMemo(() => createBaseTableColumns(accounts[0] as any), [accounts]);

    return (
        <ListContainerWithSearch searchTerm={searchTerm} onChange={setSearchTerm}>
            <Suspense fallback={<CardSkeletonList count={10} />}>
                <Await resolve={accounts}>
                    {(accounts) => (
                        <>
                            {accounts && accounts?.length === 0 && (
                                <ErrorComponent header='No Users found...' text='Try adjusting your query OR go get some users!' />
                            )}
                            {accounts && accounts?.length > 0 && (
                                <DataTable<BaseTableData> 
                                    style={{ overflow: 'scroll', height: '100%' }} 
                                    data={accounts.map(account => ({
                                        id: account.id,
                                        created_at: account.created_at,
                                        updated_at: account.updated_at,
                                        ...(account.properties || []).reduce((acc, next) => next.key ? { ...acc, [next.key]: next } : acc , {})
                                    })) as any} 
                                    columns={columns} 
                                />
                            )}
                        </>
                    )}
                </Await>
            </Suspense>
        </ListContainerWithSearch>
    )
}

export default Accounts;