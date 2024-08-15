/* eslint-disable */
import { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type EventsContentFilters = {
  OR?: InputMaybe<Array<EventsContentfiltersOr>>;
  eq?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  ilike?: InputMaybe<Scalars['String']['input']>;
  /** Array<undefined> */
  inArray?: InputMaybe<Array<Scalars['String']['input']>>;
  isNotNull?: InputMaybe<Scalars['Boolean']['input']>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  like?: InputMaybe<Scalars['String']['input']>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  notIlike?: InputMaybe<Scalars['String']['input']>;
  /** Array<undefined> */
  notInArray?: InputMaybe<Array<Scalars['String']['input']>>;
  notLike?: InputMaybe<Scalars['String']['input']>;
};

export type EventsContentfiltersOr = {
  eq?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  ilike?: InputMaybe<Scalars['String']['input']>;
  /** Array<undefined> */
  inArray?: InputMaybe<Array<Scalars['String']['input']>>;
  isNotNull?: InputMaybe<Scalars['Boolean']['input']>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  like?: InputMaybe<Scalars['String']['input']>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  notIlike?: InputMaybe<Scalars['String']['input']>;
  /** Array<undefined> */
  notInArray?: InputMaybe<Array<Scalars['String']['input']>>;
  notLike?: InputMaybe<Scalars['String']['input']>;
};

export type EventsCreatedAtFilters = {
  OR?: InputMaybe<Array<EventsCreatedAtfiltersOr>>;
  /** Date */
  eq?: InputMaybe<Scalars['String']['input']>;
  /** Date */
  gt?: InputMaybe<Scalars['String']['input']>;
  /** Date */
  gte?: InputMaybe<Scalars['String']['input']>;
  ilike?: InputMaybe<Scalars['String']['input']>;
  /** Array<Date> */
  inArray?: InputMaybe<Array<Scalars['String']['input']>>;
  isNotNull?: InputMaybe<Scalars['Boolean']['input']>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  like?: InputMaybe<Scalars['String']['input']>;
  /** Date */
  lt?: InputMaybe<Scalars['String']['input']>;
  /** Date */
  lte?: InputMaybe<Scalars['String']['input']>;
  /** Date */
  ne?: InputMaybe<Scalars['String']['input']>;
  notIlike?: InputMaybe<Scalars['String']['input']>;
  /** Array<Date> */
  notInArray?: InputMaybe<Array<Scalars['String']['input']>>;
  notLike?: InputMaybe<Scalars['String']['input']>;
};

export type EventsCreatedAtfiltersOr = {
  /** Date */
  eq?: InputMaybe<Scalars['String']['input']>;
  /** Date */
  gt?: InputMaybe<Scalars['String']['input']>;
  /** Date */
  gte?: InputMaybe<Scalars['String']['input']>;
  ilike?: InputMaybe<Scalars['String']['input']>;
  /** Array<Date> */
  inArray?: InputMaybe<Array<Scalars['String']['input']>>;
  isNotNull?: InputMaybe<Scalars['Boolean']['input']>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  like?: InputMaybe<Scalars['String']['input']>;
  /** Date */
  lt?: InputMaybe<Scalars['String']['input']>;
  /** Date */
  lte?: InputMaybe<Scalars['String']['input']>;
  /** Date */
  ne?: InputMaybe<Scalars['String']['input']>;
  notIlike?: InputMaybe<Scalars['String']['input']>;
  /** Array<Date> */
  notInArray?: InputMaybe<Array<Scalars['String']['input']>>;
  notLike?: InputMaybe<Scalars['String']['input']>;
};

export enum EventsEventTypeEnum {
  /** Value: bounce */
  Bounce = 'bounce',
  /** Value: click */
  Click = 'click',
  /** Value: logged_in */
  LoggedIn = 'logged_in',
  /** Value: page_view */
  PageView = 'page_view',
  /** Value: signed_up */
  SignedUp = 'signed_up',
  /** Value: subscribed */
  Subscribed = 'subscribed'
}

export type EventsEventTypeFilters = {
  OR?: InputMaybe<Array<EventsEventTypefiltersOr>>;
  eq?: InputMaybe<EventsEventTypeEnum>;
  gt?: InputMaybe<EventsEventTypeEnum>;
  gte?: InputMaybe<EventsEventTypeEnum>;
  ilike?: InputMaybe<Scalars['String']['input']>;
  /** Array<undefined> */
  inArray?: InputMaybe<Array<EventsEventTypeEnum>>;
  isNotNull?: InputMaybe<Scalars['Boolean']['input']>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  like?: InputMaybe<Scalars['String']['input']>;
  lt?: InputMaybe<EventsEventTypeEnum>;
  lte?: InputMaybe<EventsEventTypeEnum>;
  ne?: InputMaybe<EventsEventTypeEnum>;
  notIlike?: InputMaybe<Scalars['String']['input']>;
  /** Array<undefined> */
  notInArray?: InputMaybe<Array<EventsEventTypeEnum>>;
  notLike?: InputMaybe<Scalars['String']['input']>;
};

export type EventsEventTypefiltersOr = {
  eq?: InputMaybe<EventsEventTypeEnum>;
  gt?: InputMaybe<EventsEventTypeEnum>;
  gte?: InputMaybe<EventsEventTypeEnum>;
  ilike?: InputMaybe<Scalars['String']['input']>;
  /** Array<undefined> */
  inArray?: InputMaybe<Array<EventsEventTypeEnum>>;
  isNotNull?: InputMaybe<Scalars['Boolean']['input']>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  like?: InputMaybe<Scalars['String']['input']>;
  lt?: InputMaybe<EventsEventTypeEnum>;
  lte?: InputMaybe<EventsEventTypeEnum>;
  ne?: InputMaybe<EventsEventTypeEnum>;
  notIlike?: InputMaybe<Scalars['String']['input']>;
  /** Array<undefined> */
  notInArray?: InputMaybe<Array<EventsEventTypeEnum>>;
  notLike?: InputMaybe<Scalars['String']['input']>;
};

export type EventsFilters = {
  OR?: InputMaybe<Array<EventsFiltersOr>>;
  content?: InputMaybe<EventsContentFilters>;
  createdAt?: InputMaybe<EventsCreatedAtFilters>;
  eventType?: InputMaybe<EventsEventTypeFilters>;
  id?: InputMaybe<EventsIdFilters>;
  updatedAt?: InputMaybe<EventsUpdatedAtFilters>;
  url?: InputMaybe<EventsUrlFilters>;
  userId?: InputMaybe<EventsUserIdFilters>;
};

export type EventsFiltersOr = {
  content?: InputMaybe<EventsContentFilters>;
  createdAt?: InputMaybe<EventsCreatedAtFilters>;
  eventType?: InputMaybe<EventsEventTypeFilters>;
  id?: InputMaybe<EventsIdFilters>;
  updatedAt?: InputMaybe<EventsUpdatedAtFilters>;
  url?: InputMaybe<EventsUrlFilters>;
  userId?: InputMaybe<EventsUserIdFilters>;
};

export type EventsIdFilters = {
  OR?: InputMaybe<Array<EventsIdfiltersOr>>;
  eq?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  ilike?: InputMaybe<Scalars['String']['input']>;
  /** Array<undefined> */
  inArray?: InputMaybe<Array<Scalars['Int']['input']>>;
  isNotNull?: InputMaybe<Scalars['Boolean']['input']>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  like?: InputMaybe<Scalars['String']['input']>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  ne?: InputMaybe<Scalars['Int']['input']>;
  notIlike?: InputMaybe<Scalars['String']['input']>;
  /** Array<undefined> */
  notInArray?: InputMaybe<Array<Scalars['Int']['input']>>;
  notLike?: InputMaybe<Scalars['String']['input']>;
};

export type EventsIdfiltersOr = {
  eq?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  ilike?: InputMaybe<Scalars['String']['input']>;
  /** Array<undefined> */
  inArray?: InputMaybe<Array<Scalars['Int']['input']>>;
  isNotNull?: InputMaybe<Scalars['Boolean']['input']>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  like?: InputMaybe<Scalars['String']['input']>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  ne?: InputMaybe<Scalars['Int']['input']>;
  notIlike?: InputMaybe<Scalars['String']['input']>;
  /** Array<undefined> */
  notInArray?: InputMaybe<Array<Scalars['Int']['input']>>;
  notLike?: InputMaybe<Scalars['String']['input']>;
};

export type EventsInsertInput = {
  content: Scalars['String']['input'];
  /** Date */
  createdAt?: InputMaybe<Scalars['String']['input']>;
  eventType?: InputMaybe<EventsEventTypeEnum>;
  id?: InputMaybe<Scalars['Int']['input']>;
  /** Date */
  updatedAt?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['Int']['input'];
};

export type EventsItem = {
  __typename?: 'EventsItem';
  content: Scalars['String']['output'];
  /** Date */
  createdAt: Scalars['String']['output'];
  eventType?: Maybe<EventsEventTypeEnum>;
  id: Scalars['Int']['output'];
  /** Date */
  updatedAt: Scalars['String']['output'];
  url?: Maybe<Scalars['String']['output']>;
  userId: Scalars['Int']['output'];
};

export type EventsOrderBy = {
  content?: InputMaybe<InnerOrder>;
  createdAt?: InputMaybe<InnerOrder>;
  eventType?: InputMaybe<InnerOrder>;
  id?: InputMaybe<InnerOrder>;
  updatedAt?: InputMaybe<InnerOrder>;
  url?: InputMaybe<InnerOrder>;
  userId?: InputMaybe<InnerOrder>;
};

export type EventsSelectItem = {
  __typename?: 'EventsSelectItem';
  content: Scalars['String']['output'];
  /** Date */
  createdAt: Scalars['String']['output'];
  eventType?: Maybe<EventsEventTypeEnum>;
  id: Scalars['Int']['output'];
  /** Date */
  updatedAt: Scalars['String']['output'];
  url?: Maybe<Scalars['String']['output']>;
  user?: Maybe<EventsUserRelation>;
  userId: Scalars['Int']['output'];
};


export type EventsSelectItemUserArgs = {
  where?: InputMaybe<UsersFilters>;
};

export type EventsUpdateInput = {
  content?: InputMaybe<Scalars['String']['input']>;
  /** Date */
  createdAt?: InputMaybe<Scalars['String']['input']>;
  eventType?: InputMaybe<EventsEventTypeEnum>;
  id?: InputMaybe<Scalars['Int']['input']>;
  /** Date */
  updatedAt?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['Int']['input']>;
};

export type EventsUpdatedAtFilters = {
  OR?: InputMaybe<Array<EventsUpdatedAtfiltersOr>>;
  /** Date */
  eq?: InputMaybe<Scalars['String']['input']>;
  /** Date */
  gt?: InputMaybe<Scalars['String']['input']>;
  /** Date */
  gte?: InputMaybe<Scalars['String']['input']>;
  ilike?: InputMaybe<Scalars['String']['input']>;
  /** Array<Date> */
  inArray?: InputMaybe<Array<Scalars['String']['input']>>;
  isNotNull?: InputMaybe<Scalars['Boolean']['input']>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  like?: InputMaybe<Scalars['String']['input']>;
  /** Date */
  lt?: InputMaybe<Scalars['String']['input']>;
  /** Date */
  lte?: InputMaybe<Scalars['String']['input']>;
  /** Date */
  ne?: InputMaybe<Scalars['String']['input']>;
  notIlike?: InputMaybe<Scalars['String']['input']>;
  /** Array<Date> */
  notInArray?: InputMaybe<Array<Scalars['String']['input']>>;
  notLike?: InputMaybe<Scalars['String']['input']>;
};

export type EventsUpdatedAtfiltersOr = {
  /** Date */
  eq?: InputMaybe<Scalars['String']['input']>;
  /** Date */
  gt?: InputMaybe<Scalars['String']['input']>;
  /** Date */
  gte?: InputMaybe<Scalars['String']['input']>;
  ilike?: InputMaybe<Scalars['String']['input']>;
  /** Array<Date> */
  inArray?: InputMaybe<Array<Scalars['String']['input']>>;
  isNotNull?: InputMaybe<Scalars['Boolean']['input']>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  like?: InputMaybe<Scalars['String']['input']>;
  /** Date */
  lt?: InputMaybe<Scalars['String']['input']>;
  /** Date */
  lte?: InputMaybe<Scalars['String']['input']>;
  /** Date */
  ne?: InputMaybe<Scalars['String']['input']>;
  notIlike?: InputMaybe<Scalars['String']['input']>;
  /** Array<Date> */
  notInArray?: InputMaybe<Array<Scalars['String']['input']>>;
  notLike?: InputMaybe<Scalars['String']['input']>;
};

export type EventsUrlFilters = {
  OR?: InputMaybe<Array<EventsUrlfiltersOr>>;
  eq?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  ilike?: InputMaybe<Scalars['String']['input']>;
  /** Array<undefined> */
  inArray?: InputMaybe<Array<Scalars['String']['input']>>;
  isNotNull?: InputMaybe<Scalars['Boolean']['input']>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  like?: InputMaybe<Scalars['String']['input']>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  notIlike?: InputMaybe<Scalars['String']['input']>;
  /** Array<undefined> */
  notInArray?: InputMaybe<Array<Scalars['String']['input']>>;
  notLike?: InputMaybe<Scalars['String']['input']>;
};

export type EventsUrlfiltersOr = {
  eq?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  ilike?: InputMaybe<Scalars['String']['input']>;
  /** Array<undefined> */
  inArray?: InputMaybe<Array<Scalars['String']['input']>>;
  isNotNull?: InputMaybe<Scalars['Boolean']['input']>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  like?: InputMaybe<Scalars['String']['input']>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  notIlike?: InputMaybe<Scalars['String']['input']>;
  /** Array<undefined> */
  notInArray?: InputMaybe<Array<Scalars['String']['input']>>;
  notLike?: InputMaybe<Scalars['String']['input']>;
};

export type EventsUserIdFilters = {
  OR?: InputMaybe<Array<EventsUserIdfiltersOr>>;
  eq?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  ilike?: InputMaybe<Scalars['String']['input']>;
  /** Array<undefined> */
  inArray?: InputMaybe<Array<Scalars['Int']['input']>>;
  isNotNull?: InputMaybe<Scalars['Boolean']['input']>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  like?: InputMaybe<Scalars['String']['input']>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  ne?: InputMaybe<Scalars['Int']['input']>;
  notIlike?: InputMaybe<Scalars['String']['input']>;
  /** Array<undefined> */
  notInArray?: InputMaybe<Array<Scalars['Int']['input']>>;
  notLike?: InputMaybe<Scalars['String']['input']>;
};

export type EventsUserIdfiltersOr = {
  eq?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  ilike?: InputMaybe<Scalars['String']['input']>;
  /** Array<undefined> */
  inArray?: InputMaybe<Array<Scalars['Int']['input']>>;
  isNotNull?: InputMaybe<Scalars['Boolean']['input']>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  like?: InputMaybe<Scalars['String']['input']>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  ne?: InputMaybe<Scalars['Int']['input']>;
  notIlike?: InputMaybe<Scalars['String']['input']>;
  /** Array<undefined> */
  notInArray?: InputMaybe<Array<Scalars['Int']['input']>>;
  notLike?: InputMaybe<Scalars['String']['input']>;
};

export type EventsUserRelation = {
  __typename?: 'EventsUserRelation';
  /** Date */
  createdAt: Scalars['String']['output'];
  email: Scalars['String']['output'];
  events: Array<EventsUserRelationEventsRelation>;
  firstName: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  image?: Maybe<Scalars['String']['output']>;
  lastName: Scalars['String']['output'];
  phoneNumber: Scalars['String']['output'];
  /** Date */
  updatedAt: Scalars['String']['output'];
};


export type EventsUserRelationEventsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<EventsOrderBy>;
  where?: InputMaybe<EventsFilters>;
};

export type EventsUserRelationEventsRelation = {
  __typename?: 'EventsUserRelationEventsRelation';
  content: Scalars['String']['output'];
  /** Date */
  createdAt: Scalars['String']['output'];
  eventType?: Maybe<EventsEventTypeEnum>;
  id: Scalars['Int']['output'];
  /** Date */
  updatedAt: Scalars['String']['output'];
  url?: Maybe<Scalars['String']['output']>;
  userId: Scalars['Int']['output'];
};

export type InnerOrder = {
  direction: OrderDirection;
  /** Priority of current field */
  priority: Scalars['Int']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  deleteFromEvents: Array<EventsItem>;
  deleteFromUsers: Array<UsersItem>;
  insertIntoEvents: Array<EventsItem>;
  insertIntoEventsSingle?: Maybe<EventsItem>;
  insertIntoUsers: Array<UsersItem>;
  insertIntoUsersSingle?: Maybe<UsersItem>;
  updateEvents: Array<EventsItem>;
  updateUsers: Array<UsersItem>;
};


export type MutationDeleteFromEventsArgs = {
  where?: InputMaybe<EventsFilters>;
};


export type MutationDeleteFromUsersArgs = {
  where?: InputMaybe<UsersFilters>;
};


export type MutationInsertIntoEventsArgs = {
  values: Array<EventsInsertInput>;
};


export type MutationInsertIntoEventsSingleArgs = {
  values: EventsInsertInput;
};


export type MutationInsertIntoUsersArgs = {
  values: Array<UsersInsertInput>;
};


export type MutationInsertIntoUsersSingleArgs = {
  values: UsersInsertInput;
};


export type MutationUpdateEventsArgs = {
  set: EventsUpdateInput;
  where?: InputMaybe<EventsFilters>;
};


export type MutationUpdateUsersArgs = {
  set: UsersUpdateInput;
  where?: InputMaybe<UsersFilters>;
};

/** Order by direction */
export enum OrderDirection {
  /** Ascending order */
  Asc = 'asc',
  /** Descending order */
  Desc = 'desc'
}

export type Query = {
  __typename?: 'Query';
  events: Array<EventsSelectItem>;
  eventsSingle?: Maybe<EventsSelectItem>;
  users: Array<UsersSelectItem>;
  usersSingle?: Maybe<UsersSelectItem>;
};


export type QueryEventsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<EventsOrderBy>;
  where?: InputMaybe<EventsFilters>;
};


export type QueryEventsSingleArgs = {
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<EventsOrderBy>;
  where?: InputMaybe<EventsFilters>;
};


export type QueryUsersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<UsersOrderBy>;
  where?: InputMaybe<UsersFilters>;
};


export type QueryUsersSingleArgs = {
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<UsersOrderBy>;
  where?: InputMaybe<UsersFilters>;
};

export type UsersCreatedAtFilters = {
  OR?: InputMaybe<Array<UsersCreatedAtfiltersOr>>;
  /** Date */
  eq?: InputMaybe<Scalars['String']['input']>;
  /** Date */
  gt?: InputMaybe<Scalars['String']['input']>;
  /** Date */
  gte?: InputMaybe<Scalars['String']['input']>;
  ilike?: InputMaybe<Scalars['String']['input']>;
  /** Array<Date> */
  inArray?: InputMaybe<Array<Scalars['String']['input']>>;
  isNotNull?: InputMaybe<Scalars['Boolean']['input']>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  like?: InputMaybe<Scalars['String']['input']>;
  /** Date */
  lt?: InputMaybe<Scalars['String']['input']>;
  /** Date */
  lte?: InputMaybe<Scalars['String']['input']>;
  /** Date */
  ne?: InputMaybe<Scalars['String']['input']>;
  notIlike?: InputMaybe<Scalars['String']['input']>;
  /** Array<Date> */
  notInArray?: InputMaybe<Array<Scalars['String']['input']>>;
  notLike?: InputMaybe<Scalars['String']['input']>;
};

export type UsersCreatedAtfiltersOr = {
  /** Date */
  eq?: InputMaybe<Scalars['String']['input']>;
  /** Date */
  gt?: InputMaybe<Scalars['String']['input']>;
  /** Date */
  gte?: InputMaybe<Scalars['String']['input']>;
  ilike?: InputMaybe<Scalars['String']['input']>;
  /** Array<Date> */
  inArray?: InputMaybe<Array<Scalars['String']['input']>>;
  isNotNull?: InputMaybe<Scalars['Boolean']['input']>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  like?: InputMaybe<Scalars['String']['input']>;
  /** Date */
  lt?: InputMaybe<Scalars['String']['input']>;
  /** Date */
  lte?: InputMaybe<Scalars['String']['input']>;
  /** Date */
  ne?: InputMaybe<Scalars['String']['input']>;
  notIlike?: InputMaybe<Scalars['String']['input']>;
  /** Array<Date> */
  notInArray?: InputMaybe<Array<Scalars['String']['input']>>;
  notLike?: InputMaybe<Scalars['String']['input']>;
};

export type UsersEmailFilters = {
  OR?: InputMaybe<Array<UsersEmailfiltersOr>>;
  eq?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  ilike?: InputMaybe<Scalars['String']['input']>;
  /** Array<undefined> */
  inArray?: InputMaybe<Array<Scalars['String']['input']>>;
  isNotNull?: InputMaybe<Scalars['Boolean']['input']>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  like?: InputMaybe<Scalars['String']['input']>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  notIlike?: InputMaybe<Scalars['String']['input']>;
  /** Array<undefined> */
  notInArray?: InputMaybe<Array<Scalars['String']['input']>>;
  notLike?: InputMaybe<Scalars['String']['input']>;
};

export type UsersEmailfiltersOr = {
  eq?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  ilike?: InputMaybe<Scalars['String']['input']>;
  /** Array<undefined> */
  inArray?: InputMaybe<Array<Scalars['String']['input']>>;
  isNotNull?: InputMaybe<Scalars['Boolean']['input']>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  like?: InputMaybe<Scalars['String']['input']>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  notIlike?: InputMaybe<Scalars['String']['input']>;
  /** Array<undefined> */
  notInArray?: InputMaybe<Array<Scalars['String']['input']>>;
  notLike?: InputMaybe<Scalars['String']['input']>;
};

export type UsersEventsRelation = {
  __typename?: 'UsersEventsRelation';
  content: Scalars['String']['output'];
  /** Date */
  createdAt: Scalars['String']['output'];
  eventType?: Maybe<EventsEventTypeEnum>;
  id: Scalars['Int']['output'];
  /** Date */
  updatedAt: Scalars['String']['output'];
  url?: Maybe<Scalars['String']['output']>;
  user?: Maybe<UsersEventsRelationUserRelation>;
  userId: Scalars['Int']['output'];
};


export type UsersEventsRelationUserArgs = {
  where?: InputMaybe<UsersFilters>;
};

export type UsersEventsRelationUserRelation = {
  __typename?: 'UsersEventsRelationUserRelation';
  /** Date */
  createdAt: Scalars['String']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  image?: Maybe<Scalars['String']['output']>;
  lastName: Scalars['String']['output'];
  phoneNumber: Scalars['String']['output'];
  /** Date */
  updatedAt: Scalars['String']['output'];
};

export type UsersFilters = {
  OR?: InputMaybe<Array<UsersFiltersOr>>;
  createdAt?: InputMaybe<UsersCreatedAtFilters>;
  email?: InputMaybe<UsersEmailFilters>;
  firstName?: InputMaybe<UsersFirstNameFilters>;
  id?: InputMaybe<UsersIdFilters>;
  image?: InputMaybe<UsersImageFilters>;
  lastName?: InputMaybe<UsersLastNameFilters>;
  phoneNumber?: InputMaybe<UsersPhoneNumberFilters>;
  updatedAt?: InputMaybe<UsersUpdatedAtFilters>;
};

export type UsersFiltersOr = {
  createdAt?: InputMaybe<UsersCreatedAtFilters>;
  email?: InputMaybe<UsersEmailFilters>;
  firstName?: InputMaybe<UsersFirstNameFilters>;
  id?: InputMaybe<UsersIdFilters>;
  image?: InputMaybe<UsersImageFilters>;
  lastName?: InputMaybe<UsersLastNameFilters>;
  phoneNumber?: InputMaybe<UsersPhoneNumberFilters>;
  updatedAt?: InputMaybe<UsersUpdatedAtFilters>;
};

export type UsersFirstNameFilters = {
  OR?: InputMaybe<Array<UsersFirstNamefiltersOr>>;
  eq?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  ilike?: InputMaybe<Scalars['String']['input']>;
  /** Array<undefined> */
  inArray?: InputMaybe<Array<Scalars['String']['input']>>;
  isNotNull?: InputMaybe<Scalars['Boolean']['input']>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  like?: InputMaybe<Scalars['String']['input']>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  notIlike?: InputMaybe<Scalars['String']['input']>;
  /** Array<undefined> */
  notInArray?: InputMaybe<Array<Scalars['String']['input']>>;
  notLike?: InputMaybe<Scalars['String']['input']>;
};

export type UsersFirstNamefiltersOr = {
  eq?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  ilike?: InputMaybe<Scalars['String']['input']>;
  /** Array<undefined> */
  inArray?: InputMaybe<Array<Scalars['String']['input']>>;
  isNotNull?: InputMaybe<Scalars['Boolean']['input']>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  like?: InputMaybe<Scalars['String']['input']>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  notIlike?: InputMaybe<Scalars['String']['input']>;
  /** Array<undefined> */
  notInArray?: InputMaybe<Array<Scalars['String']['input']>>;
  notLike?: InputMaybe<Scalars['String']['input']>;
};

export type UsersIdFilters = {
  OR?: InputMaybe<Array<UsersIdfiltersOr>>;
  eq?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  ilike?: InputMaybe<Scalars['String']['input']>;
  /** Array<undefined> */
  inArray?: InputMaybe<Array<Scalars['Int']['input']>>;
  isNotNull?: InputMaybe<Scalars['Boolean']['input']>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  like?: InputMaybe<Scalars['String']['input']>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  ne?: InputMaybe<Scalars['Int']['input']>;
  notIlike?: InputMaybe<Scalars['String']['input']>;
  /** Array<undefined> */
  notInArray?: InputMaybe<Array<Scalars['Int']['input']>>;
  notLike?: InputMaybe<Scalars['String']['input']>;
};

export type UsersIdfiltersOr = {
  eq?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  ilike?: InputMaybe<Scalars['String']['input']>;
  /** Array<undefined> */
  inArray?: InputMaybe<Array<Scalars['Int']['input']>>;
  isNotNull?: InputMaybe<Scalars['Boolean']['input']>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  like?: InputMaybe<Scalars['String']['input']>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  ne?: InputMaybe<Scalars['Int']['input']>;
  notIlike?: InputMaybe<Scalars['String']['input']>;
  /** Array<undefined> */
  notInArray?: InputMaybe<Array<Scalars['Int']['input']>>;
  notLike?: InputMaybe<Scalars['String']['input']>;
};

export type UsersImageFilters = {
  OR?: InputMaybe<Array<UsersImagefiltersOr>>;
  eq?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  ilike?: InputMaybe<Scalars['String']['input']>;
  /** Array<undefined> */
  inArray?: InputMaybe<Array<Scalars['String']['input']>>;
  isNotNull?: InputMaybe<Scalars['Boolean']['input']>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  like?: InputMaybe<Scalars['String']['input']>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  notIlike?: InputMaybe<Scalars['String']['input']>;
  /** Array<undefined> */
  notInArray?: InputMaybe<Array<Scalars['String']['input']>>;
  notLike?: InputMaybe<Scalars['String']['input']>;
};

export type UsersImagefiltersOr = {
  eq?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  ilike?: InputMaybe<Scalars['String']['input']>;
  /** Array<undefined> */
  inArray?: InputMaybe<Array<Scalars['String']['input']>>;
  isNotNull?: InputMaybe<Scalars['Boolean']['input']>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  like?: InputMaybe<Scalars['String']['input']>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  notIlike?: InputMaybe<Scalars['String']['input']>;
  /** Array<undefined> */
  notInArray?: InputMaybe<Array<Scalars['String']['input']>>;
  notLike?: InputMaybe<Scalars['String']['input']>;
};

export type UsersInsertInput = {
  /** Date */
  createdAt?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  id?: InputMaybe<Scalars['Int']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  lastName: Scalars['String']['input'];
  phoneNumber: Scalars['String']['input'];
  /** Date */
  updatedAt?: InputMaybe<Scalars['String']['input']>;
};

export type UsersItem = {
  __typename?: 'UsersItem';
  /** Date */
  createdAt: Scalars['String']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  image?: Maybe<Scalars['String']['output']>;
  lastName: Scalars['String']['output'];
  phoneNumber: Scalars['String']['output'];
  /** Date */
  updatedAt: Scalars['String']['output'];
};

export type UsersLastNameFilters = {
  OR?: InputMaybe<Array<UsersLastNamefiltersOr>>;
  eq?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  ilike?: InputMaybe<Scalars['String']['input']>;
  /** Array<undefined> */
  inArray?: InputMaybe<Array<Scalars['String']['input']>>;
  isNotNull?: InputMaybe<Scalars['Boolean']['input']>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  like?: InputMaybe<Scalars['String']['input']>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  notIlike?: InputMaybe<Scalars['String']['input']>;
  /** Array<undefined> */
  notInArray?: InputMaybe<Array<Scalars['String']['input']>>;
  notLike?: InputMaybe<Scalars['String']['input']>;
};

export type UsersLastNamefiltersOr = {
  eq?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  ilike?: InputMaybe<Scalars['String']['input']>;
  /** Array<undefined> */
  inArray?: InputMaybe<Array<Scalars['String']['input']>>;
  isNotNull?: InputMaybe<Scalars['Boolean']['input']>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  like?: InputMaybe<Scalars['String']['input']>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  notIlike?: InputMaybe<Scalars['String']['input']>;
  /** Array<undefined> */
  notInArray?: InputMaybe<Array<Scalars['String']['input']>>;
  notLike?: InputMaybe<Scalars['String']['input']>;
};

export type UsersOrderBy = {
  createdAt?: InputMaybe<InnerOrder>;
  email?: InputMaybe<InnerOrder>;
  firstName?: InputMaybe<InnerOrder>;
  id?: InputMaybe<InnerOrder>;
  image?: InputMaybe<InnerOrder>;
  lastName?: InputMaybe<InnerOrder>;
  phoneNumber?: InputMaybe<InnerOrder>;
  updatedAt?: InputMaybe<InnerOrder>;
};

export type UsersPhoneNumberFilters = {
  OR?: InputMaybe<Array<UsersPhoneNumberfiltersOr>>;
  eq?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  ilike?: InputMaybe<Scalars['String']['input']>;
  /** Array<undefined> */
  inArray?: InputMaybe<Array<Scalars['String']['input']>>;
  isNotNull?: InputMaybe<Scalars['Boolean']['input']>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  like?: InputMaybe<Scalars['String']['input']>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  notIlike?: InputMaybe<Scalars['String']['input']>;
  /** Array<undefined> */
  notInArray?: InputMaybe<Array<Scalars['String']['input']>>;
  notLike?: InputMaybe<Scalars['String']['input']>;
};

export type UsersPhoneNumberfiltersOr = {
  eq?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  ilike?: InputMaybe<Scalars['String']['input']>;
  /** Array<undefined> */
  inArray?: InputMaybe<Array<Scalars['String']['input']>>;
  isNotNull?: InputMaybe<Scalars['Boolean']['input']>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  like?: InputMaybe<Scalars['String']['input']>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  notIlike?: InputMaybe<Scalars['String']['input']>;
  /** Array<undefined> */
  notInArray?: InputMaybe<Array<Scalars['String']['input']>>;
  notLike?: InputMaybe<Scalars['String']['input']>;
};

export type UsersSelectItem = {
  __typename?: 'UsersSelectItem';
  /** Date */
  createdAt: Scalars['String']['output'];
  email: Scalars['String']['output'];
  events: Array<UsersEventsRelation>;
  firstName: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  image?: Maybe<Scalars['String']['output']>;
  lastName: Scalars['String']['output'];
  phoneNumber: Scalars['String']['output'];
  /** Date */
  updatedAt: Scalars['String']['output'];
};


export type UsersSelectItemEventsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<EventsOrderBy>;
  where?: InputMaybe<EventsFilters>;
};

export type UsersUpdateInput = {
  /** Date */
  createdAt?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  /** Date */
  updatedAt?: InputMaybe<Scalars['String']['input']>;
};

export type UsersUpdatedAtFilters = {
  OR?: InputMaybe<Array<UsersUpdatedAtfiltersOr>>;
  /** Date */
  eq?: InputMaybe<Scalars['String']['input']>;
  /** Date */
  gt?: InputMaybe<Scalars['String']['input']>;
  /** Date */
  gte?: InputMaybe<Scalars['String']['input']>;
  ilike?: InputMaybe<Scalars['String']['input']>;
  /** Array<Date> */
  inArray?: InputMaybe<Array<Scalars['String']['input']>>;
  isNotNull?: InputMaybe<Scalars['Boolean']['input']>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  like?: InputMaybe<Scalars['String']['input']>;
  /** Date */
  lt?: InputMaybe<Scalars['String']['input']>;
  /** Date */
  lte?: InputMaybe<Scalars['String']['input']>;
  /** Date */
  ne?: InputMaybe<Scalars['String']['input']>;
  notIlike?: InputMaybe<Scalars['String']['input']>;
  /** Array<Date> */
  notInArray?: InputMaybe<Array<Scalars['String']['input']>>;
  notLike?: InputMaybe<Scalars['String']['input']>;
};

export type UsersUpdatedAtfiltersOr = {
  /** Date */
  eq?: InputMaybe<Scalars['String']['input']>;
  /** Date */
  gt?: InputMaybe<Scalars['String']['input']>;
  /** Date */
  gte?: InputMaybe<Scalars['String']['input']>;
  ilike?: InputMaybe<Scalars['String']['input']>;
  /** Array<Date> */
  inArray?: InputMaybe<Array<Scalars['String']['input']>>;
  isNotNull?: InputMaybe<Scalars['Boolean']['input']>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  like?: InputMaybe<Scalars['String']['input']>;
  /** Date */
  lt?: InputMaybe<Scalars['String']['input']>;
  /** Date */
  lte?: InputMaybe<Scalars['String']['input']>;
  /** Date */
  ne?: InputMaybe<Scalars['String']['input']>;
  notIlike?: InputMaybe<Scalars['String']['input']>;
  /** Array<Date> */
  notInArray?: InputMaybe<Array<Scalars['String']['input']>>;
  notLike?: InputMaybe<Scalars['String']['input']>;
};

export type EventsListQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<EventsFilters>;
}>;


export type EventsListQuery = { __typename?: 'Query', events: Array<{ __typename?: 'EventsSelectItem', id: number, createdAt: string, updatedAt: string, eventType?: EventsEventTypeEnum | null, content: string, url?: string | null, userId: number, user?: { __typename?: 'EventsUserRelation', firstName: string, lastName: string, email: string, image?: string | null } | null }> };

export type UserListQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<UsersFilters>;
}>;


export type UserListQuery = { __typename?: 'Query', users: Array<{ __typename?: 'UsersSelectItem', id: number, firstName: string, lastName: string, email: string, phoneNumber: string, image?: string | null }> };

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: DocumentTypeDecoration<TResult, TVariables>['__apiType'];

  constructor(private value: string, public __meta__?: Record<string, any>) {
    super(value);
  }

  toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}

export const EventsListDocument = new TypedDocumentString(`
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
    `) as unknown as TypedDocumentString<EventsListQuery, EventsListQueryVariables>;
export const UserListDocument = new TypedDocumentString(`
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
    `) as unknown as TypedDocumentString<UserListQuery, UserListQueryVariables>;