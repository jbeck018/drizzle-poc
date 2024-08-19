import { Card, CardHeader, CardBody, Input, Spinner } from '@chakra-ui/react'
import { startCase } from 'lodash'
import { EventsFilters } from '../../../graphql/generated/graphql';
import { useState, useMemo } from 'react';
import { executeGraphql } from '../../../graphql/execute';
import { ListEvents } from '../../../graphql/documents/events/list';
import { useQuery } from '@tanstack/react-query';
import { ErrorComponent, ListContainer } from '../../components';
import useDebounce from 'react-use/lib/useDebounce';

export const Events = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [query, setQuery] = useState('');
    const variables: EventsFilters = useMemo(() => ({
        OR: [
            // { eventType: { ilike: `%${query}%` } },
            { content: { ilike: `%${query}%` } }
        ]
    }), [query]);

    useDebounce(() => {
        setQuery(searchTerm);
    }, 400, [searchTerm]);

    const { data, isLoading, isFetching } = useQuery({
        queryKey: ["events", variables],
        queryFn: () => executeGraphql(ListEvents, { where: variables, limit: 100 }),
    });

    const events = useMemo(() => data?.events || [], [data?.events]);
    const loading = isLoading || isFetching;

    return (
        <ListContainer>
            <Input placeholder='Type to search...' value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            <ListContainer style={{ overflow: 'scroll', height: '100%' }}>
                {loading && (
                    <Spinner size='lg' />
                )}
                {!loading && events.length === 0 && (
                    <ErrorComponent header='No Events found...' text='Try adjusting your query OR go get some events!' />
                )}
                {events.length > 0 && (
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
    )
}