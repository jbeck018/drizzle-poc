import type { LoaderFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import { defer } from "@remix-run/node";
import { Await, useSearchParams } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { eq } from 'drizzle-orm';
import { Suspense, useEffect, useState } from 'react'
import { BaseTableData } from '#app/components/table/types';
import { createBaseTableColumns } from "#app/components/table/utils";
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
    const data = Promise.resolve(db.query.records.findMany({
        where: eq(records.record_type, record_type_zod_enum.enum.account),
        with: {
            properties: true,
          },
        limit: 30,
    }))

    return defer({ accounts: data });
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

    const { accounts } = useLoaderData<typeof loader>();

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
                                    columns={createBaseTableColumns(accounts[0] as any)} 
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