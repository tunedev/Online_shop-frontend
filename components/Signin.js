import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import Error from "./ErrorMessage";
import Form from "./styles/Form";
import { CURRENT_USER_QUERY } from "./User";

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
      email
      name
    }
  }
`;

const Signin = () => {
  const [state, setState] = useState({ email: "", password: "" });
  const [signin, { loading, error }] = useMutation(SIGNIN_MUTATION, {
    variables: state,
    refetchQueries: [{ query: CURRENT_USER_QUERY }]
  });

  const saveToState = event => {
    const { name, value } = event.target;
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
          await signin();
          setState({ password: "", email: "" });
        }}
      >
        <fieldset disabled={loading} aria-busy={loading}>
          <h2>Sign into your account</h2>
          <Error error={error} />
          <label htmlFor="email">
            Email
            <input
              type="email"
              name="email"
              plaeholder="enter your email here"
              value={state.email}
              onChange={saveToState}
            />
          </label>
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
          <button className="button"> Sign in</button>
        </fieldset>
      </Form>
    </div>
  );
};

export default Signin;
