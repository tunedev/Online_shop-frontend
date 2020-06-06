import Link from "next/link";
import { useMutation } from "@apollo/react-hooks";
import { TOGGLE_CART_MUTATION } from "./Cart";
import NavStyles from "./styles/NavStyles";
import User from "./User";
import Signout from "./Signout";
import CartCount from "./CartCount";
import CartItem from "./CartItem";

const Nav = () => {
  const [toggleCart] = useMutation(TOGGLE_CART_MUTATION);
  return (
    <User>
      {(data) => (
        <NavStyles data-test="nav">
          <Link href="/items">
            <a>shop</a>
          </Link>
          {data && data.me ? (
            <>
              <Link href="/sell">
                <a>sell</a>
              </Link>
              <Link href="/orders">
                <a>orders</a>
              </Link>
              <Link href="/me">
                <a>Account</a>
              </Link>
              <Signout />
              <button onClick={() => toggleCart()}>
                My cart{" "}
                <CartCount
                  count={data.me.cart.reduce(
                    (tally, cartItem) => tally + cartItem.quantity,
                    0
                  )}
                />
              </button>
            </>
          ) : (
            <Link href="/signup">
              <a>signup</a>
            </Link>
          )}
        </NavStyles>
      )}
    </User>
  );
};

export default Nav;
