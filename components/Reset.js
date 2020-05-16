import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import PropTypes from "prop-types";
import Error from "./ErrorMessage";
import Form from "./styles/Form";
import { CURRENT_USER_QUERY } from "./User";

const RESET_PASSWORD_MUTATION = gql`
  mutation RESET_PASSWORD_MUTATION(
    $resetToken: String!
    $password: String!
    $confirmPassword: String!
  ) {
    resetPassword(
      resetToken: $resetToken
      password: $password
      confirmPassword: $confirmPassword
    ) {
      id
      email
      name
    }
  }
`;

const Reset = ({ resetToken }) => {
  const [state, setState] = useState({ password: "", confirmPassword: "" });
  const [reset, { loading, error, called }] = useMutation(
    RESET_PASSWORD_MUTATION,
    {
      variables: { ...state, resetToken },
      refetchQueries: [{ query: CURRENT_USER_QUERY }]
    }
  );

  const saveToState = event => {
    const { value, name } = event.target;
    setState(state => ({
      ...state,
      [name]: value
    }));
  };
  return (
    <div>
      <Form
        method="POST"
        onSubmit={async e => {
          e.preventDefault();
          await reset();
          setState({ password: "", confirmPassword: "" });
        }}
      >
        <fieldset disabled={loading} aria-busy={loading}>
          <h2>Reset Password</h2>
          <Error error={error} />
          <label htmlFor="password">
            Password
            <input
              type="password"
              name="password"
              plaeholder="enter your password here"
              value={state.password}
              onChange={saveToState}
            />
          </label>
          <label htmlFor="confirm password">
            Confirm your Password
            <input
              type="password"
              name="confirmPassword"
              plaeholder="confirm your password here"
              value={state.confirmPassword}
              onChange={saveToState}
            />
          </label>
          <button className="button"> Reset your Password </button>
        </fieldset>
      </Form>
    </div>
  );
};

Reset.propTypes = {
  resetToken: PropTypes.string.isRequired
};

export default Reset;
