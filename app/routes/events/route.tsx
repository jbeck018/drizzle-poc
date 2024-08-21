import { Card, CardHeader, CardBody } from '@chakra-ui/react'
import { startCase } from 'lodash-es'
import { useState, useEffect, Suspense } from 'react';
import { ErrorComponent, ListContainer, ListContainerWithSearch, CardSkeletonList } from '../../components';
// import { ilike } from 'drizzle-orm';
import { json } from '@remix-run/node';
import type { LoaderFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import { Await, useLoaderData, useSearchParams } from "@remix-run/react";
import { db } from '../../../db/db.server';
// import { events } from '../../../db/schema';

export const loader = async ({
    request
  }: LoaderFunctionArgs) => {
    const url = new URL(request.url);
    const term = url.searchParams.get("query") || '';
    const data = await db.query.events.findMany({
        where: (events, { ilike }) => ilike(events.content, `%${term}%`),
        limit: 100,
    })

    if (!data) {
        throw json(
            { events: [] },
            { status: 401 }
          );
    }
      
    return json(data);
  };

export const Events = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('query'));

    useEffect(() => {
        setSearchParams(prev => {
            prev.set("query", searchTerm || '');
            return prev;
        });
    }, [searchTerm])

    const events = useLoaderData<typeof loader>();

    return (
        <ListContainerWithSearch searchTerm={searchTerm} onChange={setSearchTerm}>
            <Suspense fallback={<CardSkeletonList count={10} />}>
                <Await resolve={events}>
                    {(events) => (
                        <ListContainer>
                            <ListContainer style={{ overflow: 'scroll', height: '100%' }}>
                                {events?.length === 0 && (
                                    <ErrorComponent header='No Events found...' text='Try adjusting your query OR go get some events!' />
                                )}
                                {events?.length > 0 && (
                                    <ListContainer style={{ overflow: 'scroll', height: '100%' }}>
                                        {events.map(event => (
                                            <Card variant='outline' key={event.id}>
                                                <CardHeader>{`${startCase(event?.eventType as string)}`}</CardHeader>
                                                <CardBody>{`${event.url} | ${event.content}`}</CardBody>
                                            </Card>
                                        ))}
                                    </ListContainer>
                                )}
                            </ListContainer>
                        </ListContainer>
                    )}
                </Await>
            </Suspense>
        </ListContainerWithSearch>
    )
}

export default Events;