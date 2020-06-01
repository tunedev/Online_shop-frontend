import React from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import PropTypes from "prop-types";

export const CURRENT_USER_QUERY = gql`
  query {
    me {
      id
      email
      name
      permission
      cart {
        id
        quantity
        item {
          id
          title
          price
          image
          description
        }
      }
    }
  }
`;

const User = (props) => {
  const { data } = useQuery(CURRENT_USER_QUERY);
  return <div {...props}>{props.children(data)}</div>;
};

User.propTypes = {
  children: PropTypes.func.isRequired,
};

export default User;
