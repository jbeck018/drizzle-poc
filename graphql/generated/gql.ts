/* eslint-disable */
import * as types from './graphql';



/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n        query EventsList($limit: Int, $offset: Int, $where: EventsFilters) {\n            events(limit: $limit, offset: $offset, where: $where) {\n              id\n              createdAt\n              updatedAt\n              eventType\n              content\n              url\n              userId\n              user {\n                firstName\n                lastName\n                email\n                image\n              }\n            }\n        }\n    ": types.EventsListDocument,
    "\n        query UserList($limit: Int, $offset: Int, $where: UsersFilters) {\n            users(limit: $limit, offset: $offset, where: $where) {\n              id\n              firstName\n              lastName\n              email\n              phoneNumber\n              image\n            }\n        }\n    ": types.UserListDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n        query EventsList($limit: Int, $offset: Int, $where: EventsFilters) {\n            events(limit: $limit, offset: $offset, where: $where) {\n              id\n              createdAt\n              updatedAt\n              eventType\n              content\n              url\n              userId\n              user {\n                firstName\n                lastName\n                email\n                image\n              }\n            }\n        }\n    "): typeof import('./graphql').EventsListDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n        query UserList($limit: Int, $offset: Int, $where: UsersFilters) {\n            users(limit: $limit, offset: $offset, where: $where) {\n              id\n              firstName\n              lastName\n              email\n              phoneNumber\n              image\n            }\n        }\n    "): typeof import('./graphql').UserListDocument;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
