import { Card, CardHeader, Input, Spinner, Text, Avatar, Box, Flex, Heading } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { executeGraphql } from '../../../graphql/execute'
import { ListUsers } from '../../../graphql/documents/users/list'
import { UsersFilters } from '../../../graphql/generated/graphql'
import { useMemo, useState } from 'react'
import { ErrorComponent, ListContainer } from '../../components'
import useDebounce from 'react-use/lib/useDebounce'

export const Users = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [query, setQuery] = useState('');
    const variables: UsersFilters = useMemo(() => ({
        OR: [
            { firstName: { ilike: `%${query}%`} },
            { lastName: { ilike: `%${query}%`} },
            { email: { ilike: `%${query}%`} },
        ]
    }), [query]);

    useDebounce(() => {
        setQuery(searchTerm);
    }, 600, [searchTerm]);

    const { data, isLoading, isFetching } = useQuery({
        queryKey: ["users", variables],
        queryFn: () => executeGraphql(ListUsers, { where: variables, limit: 100 }),
    });

    const users = useMemo(() => data?.users || [], [data?.users]);
    const loading = isLoading || isFetching;

    return (
        <ListContainer>
            <Input placeholder='Type to search...' value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            {loading && (
              <Spinner size='lg' />
            )}
            {!loading && users.length === 0 && (
                <ErrorComponent header='No Users found...' text='Try adjusting your query OR go get some users!' />
            )}
            {users.length > 0 && (
                <ListContainer style={{ overflow: 'scroll', height: '100%' }}>
                    {users.map(user => (
                        <Card variant='outline' key={user.id}>
                            <CardHeader>
                                <Flex gap='4'>
                                <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
                                    <Avatar name={`${user.firstName} ${user.lastName}`} src={user?.image || undefined} />
                                    <Box>
                                        <Heading size='sm'>{`${user.firstName} ${user.lastName}`}</Heading>
                                        <Text>{`${user.email} | ${user.phoneNumber}`}</Text>
                                    </Box>
                                </Flex>
                                </Flex>
                            </CardHeader>
                        </Card>
                    ))}
                </ListContainer>
            )}
        </ListContainer>
    )
}