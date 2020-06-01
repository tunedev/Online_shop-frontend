import React from "react";
import StripeCheckout from "react-stripe-checkout";
import { useMutation } from "@apollo/react-hooks";
import { PaystackButton } from "react-paystack";
import Router from "next/router";
import NProgress from "nprogress";
import PropTypes from "prop-types";
import gql from "graphql-tag";
import calcTotalPrice from "../lib/calcTotalPrice";
import Error from "./ErrorMessage";
import User, { CURRENT_USER_QUERY } from "./User";

const CREATE_ORDER_MUTATION = gql`
  mutation CREATE_ORDER_MUTATION($token: String!) {
    createOrder(token: $token) {
      id
      charge
      total
      items {
        id
        title
      }
    }
  }
`;

const totalItems = (cart) => {
  return cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0);
};

const Checkout = ({ children }) => {
  const [createOrder] = useMutation(CREATE_ORDER_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });

  const getReference = () => {
    //you can put any unique reference implementation code here
    let text = "";
    let possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-.=";

    for (let i = 0; i < 15; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  };

  const onToken = async (res) => {
    NProgress.start();
    const order = await createOrder({ variables: { token: res.id } }).catch(
      (error) => {
        console.log(error.message);
      }
    );
    Router.push({
      pathname: "/order",
      query: { id: order.data.createOrder.id },
    });
  };

  return (
    <User>
      {({ me }) => (
        <StripeCheckout
          amount={calcTotalPrice(me.cart) * 100}
          name="Online Shop"
          description={`Order of ${totalItems(me.cart)} items!`}
          image={me.cart[0] && me.cart[0].item.image}
          stripeKey="pk_test_qDKaQIroq5HjMCI51fJj8MIh00fnvhABRo"
          currency="NGN "
          email={me.email}
          token={(res) => onToken(res)}
        >
          {children}
        </StripeCheckout>
      )}
    </User>
  );
};

export default Checkout;
