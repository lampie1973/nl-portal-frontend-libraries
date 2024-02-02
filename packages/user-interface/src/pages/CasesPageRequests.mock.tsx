import { FetchResult, GraphQLRequest } from "@apollo/client";
import {
  QUERY_GET_ZAKEN,
} from "@nl-portal/nl-portal-api";
import { cloneDeep } from "lodash";

const getZaken: {
  request: GraphQLRequest;
  result: FetchResult<Record<string, any>>;
} = {
  request: {
    query: QUERY_GET_ZAKEN,
    variables: {},
  },
  result: {
    data: {},
  },
};

export const mocksRequest = [getZaken];
