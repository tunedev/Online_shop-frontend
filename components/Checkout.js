import React from "react";
import { PaystackConsumer } from "react-paystack";
import { useMutation } from "@apollo/react-hooks";
import Router from "next/router";
import NProgress from "nprogress";
import gql from "graphql-tag";
import calcTotalPrice from "../lib/calcTotalPrice";
import SickButton from "./styles/SickButton";
import User, { CURRENT_USER_QUERY } from "./User";

export const CREATE_ORDER_MUTATION = gql`
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

  const onToken = async (res) => {
    NProgress.start();
    const order = await createOrder({
      variables: { token: res.reference },
    }).catch((error) => {
      console.log(error.message);
    });
    Router.push({
      pathname: "/order",
      query: { id: order.data.createOrder.id },
    });
  };

  return (
    <User>
      {({ me }) => {
        const componentProps = {
          reference: new Date().getTime(),
          email: me.email,
          amount: calcTotalPrice(me.cart) * 100,
          label: "Online-Shop",
          publicKey: "pk_test_e822234b0318189bdf4d1152324516f7f5b43327",
          metadata: {
            custom_field: [
              {
                display_name: "Description",
                variable_name: "description",
                value: `Order of ${totalItems(me.cart)} items!`,
              },
            ],
          },
          onSuccess: (res) => {
            console.log("====>", onToken(res));
          },
        };

        return (
          <PaystackConsumer {...componentProps}>
            {({ initializePayment }) => {
              return (
                <SickButton
                  onClick={() => {
                    initializePayment();
                  }}
                >
                  Checkout
                </SickButton>
              );
            }}
          </PaystackConsumer>
        );
      }}
    </User>
  );
};

export default Checkout;
