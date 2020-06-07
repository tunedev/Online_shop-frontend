import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import PropTypes from "prop-types";
import Router from "next/router";
import ErrorMessage from "./ErrorMessage";
import Form from "./styles/Form";
import formatMoney from "../lib/formatMoney";

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
    }
  }
`;

export const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String
    $price: Int
    $description: String
  ) {
    updateItem(
      id: $id
      title: $title
      description: $description
      price: $price
    ) {
      id
      title
      description
      price
    }
  }
`;

const UpdateItem = ({ id }) => {
  const { data, loading } = useQuery(SINGLE_ITEM_QUERY, {
    variables: { id },
  });

  const [state, setState] = useState({});
  const [updateItem, updateItemObject] = useMutation(UPDATE_ITEM_MUTATION, {
    variables: state,
  });

  const handleChange = (event) => {
    const { name, type, value } = event.target;
    const val = type === "number" ? parseInt(value, 10) : value;
    setState((state) => ({ ...state, [name]: val }));
  };

  const handleItemUpdate = async (event, updateItemMutation) => {
    event.preventDefault();
    console.log(state);
    console.log("Updating item");
    const res = await updateItemMutation({
      variables: {
        id,
        ...state,
      },
    });
    console.log("updated!!");
    console.log(res);
  };

  if (loading) return <p>Loading...</p>;
  if (!data.item) return <p>No item found for ID {id}</p>;

  return (
    <div>
      {
        <Form onSubmit={(event) => handleItemUpdate(event, updateItem)}>
          <ErrorMessage error={updateItemObject.error} />
          <fieldset
            disabled={updateItemObject.loading}
            aria-busy={updateItemObject.loading}
          >
            <label htmlFor="title">
              Title
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Title"
                required
                defaultValue={data.item.title}
                onChange={handleChange}
              />
            </label>
            <label htmlFor="price">
              Price
              <input
                type="number"
                id="price"
                name="price"
                placeholder="Price"
                required
                defaultValue={data.item.price}
                onChange={handleChange}
              />
            </label>
            <label htmlFor="description">
              Description
              <textarea
                id="description"
                name="description"
                placeholder="Description"
                required
                defaultValue={data.item.description}
                onChange={handleChange}
              />
            </label>
            <button type="submit">
              Sav{updateItemObject.loading ? "ing" : "e"} Changes
            </button>
          </fieldset>
        </Form>
      }
    </div>
  );
};

UpdateItem.propTypes = {
  id: PropTypes.string.isRequired,
};

export default UpdateItem;
