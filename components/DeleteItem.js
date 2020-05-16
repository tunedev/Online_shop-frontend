import React from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { ALL_ITEMS_QUERY } from "./Items";
import Item from "./Item";

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`;

const DeleteItem = ({ children, id }) => {
  const [deleteItem] = useMutation(DELETE_ITEM_MUTATION, {
    variables: { id },
    update(cache, { data: { deleteItem } }) {
      // Manually update the cache on the client so it matches the server
      // 1. Read the cache for the item we want
      const { items } = cache.readQuery({ query: ALL_ITEMS_QUERY });
      // update the cache with the filtered items
      cache.writeQuery({
        query: ALL_ITEMS_QUERY,
        data: {
          items: items.filter((item) => item.id !== deleteItem.id),
        },
      });
    },
  });
  return (
    <div>
      {
        <button
          onClick={() => {
            if (confirm("Are you sure you want to delete this item")) {
              deleteItem().catch((error) => {
                alert(error.message);
              });
            }
          }}
        >
          {children}
        </button>
      }
    </div>
  );
};

export default DeleteItem;
