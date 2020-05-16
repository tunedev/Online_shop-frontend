import React from "react";
import FormatMoney from "../lib/formatMoney";
import styled from "styled-components";
import RemoveFromCart from "./RemoveFromCart";

const StyledCartItem = styled.li`
  padding: 1rem 0;
  border-bottom: 1px solid ${(props) => props.theme.lightgrey};
  display: grid;
  align-items: center;
  grid-template-columns: auto 1fr auto;
  img {
    margin-right: 10px;
  }
  h3,
  p {
    margin: 0;
  }
`;

const CartItem = ({ cartItem }) => {
  if (!cartItem.item)
    return (
      <StyledCartItem>
        <p>This item has been removed</p>
        <RemoveFromCart id={cartItem.id} />
      </StyledCartItem>
    );
  return (
    <StyledCartItem>
      <img width="100px" src={cartItem.item.image} alt={cartItem.item.title} />
      <div className="cart-items-details">
        <h3>{cartItem.item.title}</h3>
        <p>
          {FormatMoney(cartItem.item.price * cartItem.quantity)}
          {" - "}
          <em>
            {cartItem.quantity}
            &times;
            {FormatMoney(cartItem.item.price)}
          </em>
        </p>
      </div>
      <RemoveFromCart id={cartItem.id} />
    </StyledCartItem>
  );
};

export default CartItem;
