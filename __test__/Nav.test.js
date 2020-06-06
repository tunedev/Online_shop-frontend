import { mount } from "enzyme";
import wait from "waait";
import Nav from "../components/Nav";
import { CURRENT_USER_QUERY } from "../components/User";
import { MockedProvider } from "@apollo/react-testing";
import { fakeUser, fakeCartItem } from "../lib/testUtils";
import { signedInMocks, notSignedinMocks } from "./PleaseSignIn.test";
import toJson from "enzyme-to-json";

const signedInWithCartItemsMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: {
      data: {
        me: {
          ...fakeUser(),
          cart: [fakeCartItem(), fakeCartItem(), fakeCartItem()],
        },
      },
    },
  },
];

describe("<Nav/>", () => {
  it("renders a minimal nav when signed out", async () => {
    const wrapper = mount(
      <MockedProvider mocks={notSignedinMocks}>
        <Nav />
      </MockedProvider>
    );

    await wait();
    wrapper.update();
    const nav = wrapper.find('[data-test="nav"]');
    expect(toJson(nav)).toMatchSnapshot();
  });

  it("renders full Nav when signed in", async () => {
    const wrapper = mount(
      <MockedProvider mocks={signedInMocks}>
        <Nav />
      </MockedProvider>
    );

    await wait();
    wrapper.update();
    const nav = wrapper.find('ul[data-test="nav"]');
    expect(nav.children().length).toBe(6);
    expect(nav.text()).toContain("Sign out");
    expect(toJson(nav)).toMatchSnapshot();
  });

  it("renders the amount of items in the cart", async () => {
    const wrapper = mount(
      <MockedProvider mocks={signedInWithCartItemsMocks}>
        <Nav />
      </MockedProvider>
    );

    await wait();
    wrapper.update();
    const nav = wrapper.find('[data-test="nav"]');
    const count = nav.find("div.count");
    expect(toJson(count)).toMatchSnapshot();
  });
});
