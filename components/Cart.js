import React from "react";
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/react-hooks";
import CartStyles from "./styles/CartStyles";
import User from "./User";
import Supreme from "./styles/Supreme";
import CloseButton from "./styles/CloseButton";
import CartItem from "./CartItem";
import calcTotalPrice from "../lib/calcTotalPrice";
import formatMoney from "../lib/formatMoney";
import Checkout from "./Checkout";

export const LOCAL_STATE_QUERY = gql`
  query {
    cartOpen @client
  }
`;

export const TOGGLE_CART_MUTATION = gql`
  mutation TOGGLE_CART_MUTATION {
    toggleCart @client
  }
`;

const Cart = () => {
  const { data } = useQuery(LOCAL_STATE_QUERY);
  const [toggleCart] = useMutation(TOGGLE_CART_MUTATION);

  return (
    <User>
      {(userData) => {
        if (!userData || !userData.me) return null;
        const { cart } = userData.me;
        return (
          <CartStyles open={data.cartOpen}>
            <header>
              <CloseButton onClick={toggleCart} title="close">
                &times;
              </CloseButton>
              <Supreme>Your Cart</Supreme>
              <p>
                You have {cart.length} item
                {cart.length <= 1 ? "" : "s"} in your cart.
              </p>
            </header>
            <ul>
              {cart.map((cartItem) => (
                <CartItem key={cartItem.id} cartItem={cartItem} />
              ))}
            </ul>
            <footer>
              <p>{formatMoney(calcTotalPrice(cart))}</p>
              <Checkout />
            </footer>
          </CartStyles>
        );
      }}
    </User>
  );
};

export default Cart;
