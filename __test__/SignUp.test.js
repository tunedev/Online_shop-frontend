import { mount } from "enzyme";
import wait from "waait";
import Signup, { SIGNUP_MUTATION } from "../components/Signup";
import { CURRENT_USER_QUERY } from "../components/User";
import { fakeUser } from "../lib/testUtils";
import { MockedProvider } from "@apollo/react-testing";
import { ApolloConsumer } from "@apollo/react-hooks";
import toJson from "enzyme-to-json";

const simulateChange = (wrapper, name, value) => {
  wrapper
    .find(`input[name="${name}"]`)
    .simulate("change", { target: { name, value } });
};

const me = fakeUser();
const mocks = [
  // Sign up mock
  {
    request: {
      query: SIGNUP_MUTATION,
      variables: { name: me.name, password: "sequreStuffs", email: me.email },
    },
    result: {
      data: {
        signup: {
          __typename: "User",
          id: "123abc",
          email: me.email,
          name: me.name,
        },
      },
    },
  },
  // Signup user mock
  {
    request: {
      query: CURRENT_USER_QUERY,
    },
    result: {
      data: {
        me,
      },
    },
  },
];

describe("<Signup/>", () => {
  it("renders and matches snapshot", () => {
    const wrapper = mount(
      <MockedProvider>
        <Signup />
      </MockedProvider>
    );
    expect(toJson(wrapper.find("form"))).toMatchSnapshot();
  });

  it("Calls the mutation properly", async () => {
    let apolloClient;
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <ApolloConsumer>
          {(client) => {
            apolloClient = client;
            return <Signup />;
          }}
        </ApolloConsumer>
      </MockedProvider>
    );
    await wait();
    wrapper.update();

    simulateChange(wrapper, "name", me.name);
    simulateChange(wrapper, "email", me.email);
    simulateChange(wrapper, "password", "sequreStuffs");
    wrapper.update();
    wrapper.find("form").simulate("submit");
    await wait();
    // query the user out of the apollo client
    const user = await apolloClient.query({ query: CURRENT_USER_QUERY });
    expect(user.data.me).toMatchObject(me);
  });
});
