import { graphql } from '../../generated';

export const ListUsers = graphql(`
        query UserList($limit: Int, $offset: Int, $where: UsersFilters) {
            users(limit: $limit, offset: $offset, where: $where) {
              id
              firstName
              lastName
              email
              phoneNumber
              image
            }
        }
    `);