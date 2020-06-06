import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import wait from "waait";
import PleaseSignIn from "../components/PleaseSignIn";
import { CURRENT_USER_QUERY } from "../components/User";
import { MockedProvider } from "@apollo/react-testing";
import { fakeUser } from "../lib/testUtils";

export const signedInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me: fakeUser() } },
  },
];

export const notSignedinMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me: null } },
  },
];

describe("<PleaseSignIn/>", () => {
  it("renders the sign in dialog for logged out user", async () => {
    const wrapper = mount(
      <MockedProvider mocks={notSignedinMocks}>
        <PleaseSignIn />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    expect(wrapper.text()).toContain("Sign into your account");
    const Signin = wrapper.find("Signin");
    expect(toJson(Signin)).toMatchSnapshot();
  });

  it("renders apropriately the children component when user signs in successfully", async () => {
    const HeyComponent = () => <p>Hey!</p>;
    const wrapper = mount(
      <MockedProvider mocks={signedInMocks}>
        <PleaseSignIn>
          <HeyComponent />
        </PleaseSignIn>
      </MockedProvider>
    );

    await wait();
    wrapper.update();
    expect(wrapper.contains(<HeyComponent />)).toBe(true);
  });
});
