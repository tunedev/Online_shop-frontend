import React from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import Head from "next/head";
import Link from "next/link";

import { perPage } from "../config";

// Components
import PaginationStyles from "./styles/PaginationStyles";

export const PAGINATION_INFO_QUERY = gql`
  query PAGINATION_INFO_QUERY {
    itemsConnection {
      aggregate {
        count
      }
    }
  }
`;

const Pagination = ({ page }) => {
  const { loading, error, data } = useQuery(PAGINATION_INFO_QUERY);
  if (loading) {
    return (
      <PaginationStyles>
        <p>Loading ...</p>
      </PaginationStyles>
    );
  }
  const count = data.itemsConnection.aggregate.count;
  const pages = Math.ceil(count / perPage);
  return (
    <PaginationStyles data-test="pagination">
      <Head>
        <title>
          Sick Fits! - page of {page} of {pages}
        </title>
      </Head>
      <Link
        href={{
          pathname: "items",
          query: { page: page - 1 },
        }}
      >
        <a className="prev" aria-disabled={page <= 1}>
          {" "}
          ⬅️ Prev
        </a>
      </Link>
      <p>
        page {page} of <span className="totalPages">{pages}</span>
      </p>
      <p>{count} Items Total</p>
      <Link
        href={{
          pathname: "items",
          query: { page: page + 1 },
        }}
      >
        <a className="next" aria-disabled={page >= pages}>
          {" "}
          Next ➡️
        </a>
      </Link>
    </PaginationStyles>
  );
};

export default Pagination;
