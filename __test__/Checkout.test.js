import { mount } from "enzyme";
import wait from "waait";
import Checkout from "../components/Checkout";
import { CURRENT_USER_QUERY } from "../components/User";
import { fakeUser, fakeCartItem } from "../lib/testUtils";
import { MockedProvider } from "@apollo/react-testing";
import toJson from "enzyme-to-json";

const mocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me: { ...fakeUser(), cart: [fakeCartItem()] } } },
  },
];

describe("<Checkout/>", () => {
  it("renders and matches snapshot", async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <Checkout />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    const checkoutButton = wrapper.find("ReactStripeCheckout");
    expect(toJson(checkoutButton)).toMatchSnapshot();
  });
});
