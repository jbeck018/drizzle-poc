import { graphql } from '../../generated';

export const ListEvents = graphql(`
        query EventsList($limit: Int, $offset: Int, $where: EventsFilters) {
            events(limit: $limit, offset: $offset, where: $where) {
              id
              createdAt
              updatedAt
              eventType
              content
              url
              userId
              user {
                firstName
                lastName
                email
                image
              }
            }
        }
    `);