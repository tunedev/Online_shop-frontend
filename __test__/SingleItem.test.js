import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import wait from "waait";
import SingleItem, { SINGLE_ITEM_QUERY } from "../components/SingleItem";
import { MockedProvider } from "@apollo/react-testing";
import { fakeItem } from "../lib/testUtils";

describe("<SingleItem/>", () => {
  it("renders with proper data", async () => {
    // pairs of request and result
    const mocks = [
      {
        // When someone makes a request with this request content
        request: { query: SINGLE_ITEM_QUERY, variables: { id: "123" } },
        // Then the result below would be the response
        result: { data: { item: fakeItem() } },
      },
    ];
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <SingleItem id="123" />
      </MockedProvider>
    );
    expect(wrapper.text()).toContain("Loading...");

    await wait();
    wrapper.update();
    expect(toJson(wrapper.find("h2"))).toMatchSnapshot();
    expect(toJson(wrapper.find("p"))).toMatchSnapshot();
    expect(toJson(wrapper.find("img"))).toMatchSnapshot();
  });

  it("Error for item not found", async () => {
    const mocks = [
      {
        request: { query: SINGLE_ITEM_QUERY, variables: { id: "123" } },
        result: {
          errors: [{ message: "Items not found!" }],
        },
      },
    ];

    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <SingleItem id="123" />
      </MockedProvider>
    );

    await wait();
    wrapper.update();
    const item = wrapper.find("[data-test='graphql-error']");
    expect(item.text()).toContain("Items not found!");
    expect(toJson(item)).toMatchSnapshot();
  });
});
