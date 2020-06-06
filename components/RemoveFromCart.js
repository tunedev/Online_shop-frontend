import React from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import PropTypes from "prop-types";
import Styled from "styled-components";
import { CURRENT_USER_QUERY } from "./User";

export const REMOVE_FROM_CART_MUTATION = gql`
  mutation REMOVE_FROM_CART_MUTATION($id: ID!) {
    removeFromCart(id: $id) {
      id
    }
  }
`;

const BigButton = Styled.button`
font-size: 3rem;
background: none;
border: none; 
&:hover {
  color: ${(props) => props.theme.primary};
  cursor: pointer
}
`;

const RemoveFromCart = ({ id }) => {
  const [removeCartItem, { loading, error }] = useMutation(
    REMOVE_FROM_CART_MUTATION,
    {
      variables: { id },
      update(cache, { data: { removeFromCart } }) {
        // Manually update the cache on the client so it matches the server
        // 1. First read the cache
        const { me } = cache.readQuery({ query: CURRENT_USER_QUERY });
        // 3.Write it back to the cache
        cache.writeQuery({
          query: CURRENT_USER_QUERY,
          data: {
            me: {
              ...me,
              cart: me.cart.filter(
                (cartItem) => cartItem.id !== removeFromCart.id
              ),
            },
          },
        });
      },
      optimisticResponse: {
        __typename: "Mutation",
        removeFromCart: {
          __typename: "CartItem",
          id,
        },
      },
    }
  );
  return (
    <BigButton
      onClick={() => {
        removeCartItem().catch((error) => alert(error.message));
      }}
      title="Delete Item"
    >
      &times;
    </BigButton>
  );
};

RemoveFromCart.propTypes = {
  id: PropTypes.string.isRequired,
};

export default RemoveFromCart;
