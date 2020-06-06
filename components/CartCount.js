import React from "react";
import PropTypes from "prop-types";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import Styled from "styled-components";

const AnimationStyle = Styled.span`
  position: relative;
  .count {
    display: block;
    position: relative;
    transition: all 0.4s;
  }
  .count-enter {
    transform: rotateX(0);
  }
  .count-enter-active{
    transform: rotateX(0.5turn);
  }
  .count-exit {
    top: 0;
    position: absolute;
    transform: rotateX(0);
  }
  .count-exit-active {
    transform: rotateX(0.5turn);
  }
`;

const Dot = Styled.div`
  color: white;
  background: ${(props) => props.theme.primary};
  border-radius: 50%;
  padding: 0.5rem;
  line-height: 2rem;
  min-width: 3rem;
  margin-left: 1rem;
  font-weight: 100;
  font-feature-settings: 'tnum';
  font-variant-numeric: tabular-nums;
`;

const CartCount = ({ count }) => (
  <AnimationStyle>
    <TransitionGroup>
      <CSSTransition
        unmountOnExit
        classNames="count"
        className="count"
        key={count}
        timeout={{ enter: 400, exit: 400 }}
      >
        <Dot>{count}</Dot>
      </CSSTransition>
    </TransitionGroup>
  </AnimationStyle>
);

export default CartCount;
