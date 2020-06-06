import { mount } from "enzyme";
import wait from "waait";
import RequestReset, {
  REQUEST_RESET_MUTATION,
} from "../components/RequestReset";
import { MockedProvider } from "@apollo/react-testing";
import toJson from "enzyme-to-json";

const mocks = [
  {
    request: {
      query: REQUEST_RESET_MUTATION,
      variables: { email: "testMail@mail.com" },
    },
    result: {
      data: { requestReset: { message: "success", __typename: "Message" } },
    },
  },
];

describe("<RequestReset/>", () => {
  it("renders and matches snapshot", () => {
    const wrapper = mount(
      <MockedProvider>
        <RequestReset />
      </MockedProvider>
    );

    const form = wrapper.find('form[data-test="form"]');
    expect(toJson(form)).toMatchSnapshot();
  });

  it("calls the mutation", async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <RequestReset />
      </MockedProvider>
    );

    // Simulate typing an email
    wrapper.find("input").simulate("change", {
      target: { name: "email", value: "testMail@mail.com" },
    });

    // Simulate a submit action
    wrapper.find("form").simulate("submit");
    await wait();
    wrapper.update();
    expect(wrapper.find("p").text()).toContain(
      "Success! Check your email for a reset link!"
    );
  });
});
