import type { LoaderFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import { json, useSearchParams } from "@remix-run/react";
import { eq } from 'drizzle-orm';
import { useEffect, useMemo, useState } from 'react'
import { BaseTableData } from '#app/components/table/types';
import { createBaseTableColumns } from "#app/components/table/utils";
import { db } from '../../../db/db.server';
import { record_type_zod_enum, records } from '../../../db/schema';
import { DataTable, ErrorComponent, ListContainerWithSearch, TableSkeleton } from '../../components';
import { useLoadFetcherData } from "#app/hooks";

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
        limit: 30,
    });
    return json(data);
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

    const { data: accounts, isLoading, loadData } = useLoadFetcherData<typeof loader>({ url: `${ROUTE_PATH}` });
    console.log(accounts);
    const variables = useMemo(() => ({ query: searchTerm || '' }), [searchTerm]);

    useEffect(() => {
        loadData(variables);
    }, [searchTerm])

    return (
        <ListContainerWithSearch searchTerm={searchTerm} onChange={setSearchTerm}>
            {isLoading ? <TableSkeleton count={30} /> : (
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
                            columns={createBaseTableColumns(accounts.map(account => ({
                                id: account.id,
                                created_at: account.created_at,
                                updated_at: account.updated_at,
                                ...(account.properties || []).reduce((acc, next) => next.key ? { ...acc, [next.key]: next } : acc , {})
                            }))[0] as any)} 
                        />
                    )}
                </>
            )}
        </ListContainerWithSearch>
    )
}

export default Accounts;