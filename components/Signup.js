import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import Error from "./ErrorMessage";
import Form from "./styles/Form";
import { CURRENT_USER_QUERY } from "./User";

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $email: String!
    $name: String!
    $password: String!
  ) {
    signup(email: $email, name: $name, password: $password) {
      id
      email
      name
    }
  }
`;

const Signup = () => {
  const [state, setState] = useState({ email: "", name: "", password: "" });
  const [signup, { loading, error }] = useMutation(SIGNUP_MUTATION, {
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
          const res = await signup();
          setState({ name: "", password: "", email: "" });
        }}
      >
        <fieldset disabled={loading} aria-busy={loading}>
          <h2>Signup for an account</h2>
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
          <label htmlFor="name">
            Name
            <input
              type="text"
              name="name"
              plaeholder="enter your name here"
              value={state.name}
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
          <button className="button"> Sign up</button>
        </fieldset>
      </Form>
    </div>
  );
};

export default Signup;
