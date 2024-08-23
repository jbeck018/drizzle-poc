import { Avatar, Box, Card, CardHeader, Flex, Heading, Text } from '@chakra-ui/react'
import type { LoaderFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import { json } from "@remix-run/node"; // or cloudflare/deno
import { Await, defer, useSearchParams } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { ilike, or } from 'drizzle-orm';
import { Suspense, useEffect, useState } from 'react'
import { db } from '../../../db/db.server';
import { users } from '../../../db/schema';
import { CardSkeletonList, ErrorComponent, ListContainer, ListContainerWithSearch } from '../../components';

export const ROUTE_PATH = '/dashboard/users' as const

export const loader = async ({
    request
  }: LoaderFunctionArgs) => {
    const url = new URL(request.url);
    const term = url.searchParams.get("query") || '';
    const data = Promise.resolve(db.query.users.findMany({
        where: or(ilike(users.first_name, `%${term}%`), ilike(users.last_name, `%${term}%`), ilike(users.email, `%${term}%`)),
        with: {
            roles: {
                with: {
                role: true,
                }
            },
          },
        limit: 100,
    }));
    
    if (!data) {
        throw json(
            { users: [] },
            { status: 401 }
          );
    }

    return defer({ data });
  };


export const Users = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('query'));

    useEffect(() => {
        setSearchParams(prev => {
            prev.set("query", searchTerm || '');
            return prev;
        });
    }, [searchTerm])

    const { data: users } = useLoaderData<typeof loader>();

    return (
        <ListContainerWithSearch searchTerm={searchTerm} onChange={setSearchTerm}>
            <Suspense fallback={<CardSkeletonList count={10} />}>
                <Await resolve={users}>
                    {(users) => (
                        <ListContainer isInner>
                            {users && users?.length === 0 && (
                                <ErrorComponent header='No Users found...' text='Try adjusting your query OR go get some users!' />
                            )}
                            {users && users?.length > 0 && (
                                <ListContainer style={{ overflow: 'scroll', height: '100%' }}>
                                    {users.map(user => (
                                        <Card variant='outline' background={'transparent'} key={user.id}>
                                            <CardHeader>
                                                <Flex gap='4'>
                                                <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
                                                    <Avatar name={`${user.first_name} ${user.last_name}`} src={undefined} />
                                                    <Box>
                                                        <Heading size='sm'>{`${user.first_name} ${user.last_name}`}</Heading>
                                                        <Text>{`${user.email} | ${user.phone_number}`}</Text>
                                                    </Box>
                                                </Flex>
                                                </Flex>
                                            </CardHeader>
                                        </Card>
                                    ))}
                                </ListContainer>
                            )}
                        </ListContainer>
                    )}
                </Await>
            </Suspense>
        </ListContainerWithSearch>
    )
}

export default Users;