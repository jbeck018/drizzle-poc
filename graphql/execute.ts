import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import type { OperationDefinitionNode } from "graphql";
import request from "graphql-request";
import type { TypedDocumentString } from "./generated/graphql";

type Strict<T> = T extends Record<string, never> ? undefined : NonNullable<T>;

export function useGraphqlQuery<ResultT, VariablesT>(
	document: TypedDocumentNode,
	variables: Strict<VariablesT>,
): UseQueryResult<ResultT> {
	const operationName = (document?.definitions?.[0] as OperationDefinitionNode)
		.name?.value;
	if (!operationName) {
		throw new Error(`Could not find operation name for document: ${document}`);
	}
	const queryKey = [operationName, variables] as const;
	return useQuery({
		queryKey,
		queryFn: async ({ queryKey }) =>
			// Use `queryKey[1]` via the context to reduce closure scope (I think)
			request(`http://localhost:3100/graphql`, document, queryKey[1]),
	});
}

export async function executeGraphql<TResult, TVariables>(
	query: TypedDocumentString<TResult, TVariables>,
	...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
) {
	const response = await fetch("http://localhost:3100/graphql", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/graphql-response+json",
		},
		body: JSON.stringify({
			query: query,
			variables,
		}),
	});

	if (!response.ok) {
		throw new Error("Network response was not ok");
	}

	const resp = await response.json();
	return resp.data as TResult;
}
