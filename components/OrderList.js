import React from "react";
import { useQuery } from "@apollo/react-hooks";
import Moment from "moment";
import gql from "graphql-tag";
import Link from "next/link";
import styled from "styled-components";
import formatMoney from "../lib/formatMoney";
import OrderItemsStyle from "./styles/OrderItemStyles";
import Error from "./ErrorMessage";
import OrderItemStyles from "./styles/OrderItemStyles";

const USER_ORDER_QUERY = gql`
  query USER_ORDER_QUERY {
    orders(orderBy: createdAt_DESC) {
      id
      total
      createdAt
      items {
        id
        title
        price
        image
        description
        quantity
      }
    }
  }
`;

const OrderUL = styled.ul`
  display: grid;
  grid-gap: 4rem;
  grid-template-columns: repeat(auto-fit, minmax(40%, 1fr));
`;

const OrderList = () => {
  const { data, loading, error } = useQuery(USER_ORDER_QUERY);
  if (error) return <Error error={error} />;
  if (loading) return <p>Loading ...</p>;
  const { orders } = data;
  console.log(orders);
  return (
    <div>
      <h2>
        You have {orders.length} order{orders.length > 1 ? "s" : ""}
      </h2>
      <OrderUL>
        {orders.map((order) => (
          <OrderItemStyles key={order.id}>
            <Link href={{ pathname: "/order", query: { id: order.id } }}>
              <a>
                <div className="order-meta">
                  <p>{order.items.reduce((a, b) => a + b.quantity, 0)} Items</p>
                  <p>{order.items.length} Products</p>
                  <p>{Moment(order.createdAt).fromNow()}</p>
                  <p>{formatMoney(order.total)}</p>
                </div>
                <div className="images">
                  {order.items.map((item) => (
                    <img key={item.id} src={item.image} alt={item.title} />
                  ))}
                </div>
              </a>
            </Link>
          </OrderItemStyles>
        ))}
      </OrderUL>
    </div>
  );
};

export default OrderList;
