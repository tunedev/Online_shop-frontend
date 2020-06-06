import { mount } from "enzyme";
import wait from "waait";
import CreateItem, { CREATE_ITEM_MUTATION } from "../components/CreateItem";
import Router from "next/router";
import { MockedProvider } from "@apollo/react-testing";
import toJson from "enzyme-to-json";
import { fakeItem } from "../lib/testUtils";

const dogImage = "https://dog.com/dog.jpg";

// Mock the global API
global.fetch = jest.fn().mockResolvedValue({
  json: () => ({
    secure_url: dogImage,
    eager: [{ secure_url: dogImage }],
  }),
});

describe("<CreateItem/>", () => {
  it("renders and matches snapshot", () => {
    const wrapper = mount(
      <MockedProvider>
        <CreateItem />
      </MockedProvider>
    );

    const form = wrapper.find('form[data-test="form"]');
    expect(toJson(form)).toMatchSnapshot();
  });

  it("uploads a file when changed", async () => {
    const wrapper = mount(
      <MockedProvider>
        <CreateItem />
      </MockedProvider>
    );

    const input = wrapper.find("input[type='file']");
    input.simulate("change", { target: { files: ["fakedog.jpg"] } });
    await wait();
    expect(global.fetch).toHaveBeenCalled();

    global.fetch.mockReset();
  });

  it("creates an item when the form is submitted", async () => {
    const item = fakeItem();
    const mocks = [
      {
        request: {
          query: CREATE_ITEM_MUTATION,
          variables: {
            title: item.title,
            description: item.description,
            image: "",
            largeImage: "",
            price: item.price,
          },
        },
        result: {
          data: {
            createItem: {
              ...fakeItem,
              id: "abc123",
              __typename: "Item",
            },
          },
        },
      },
    ];

    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <CreateItem />
      </MockedProvider>
    );
    // simulate someone filling out the form
    wrapper
      .find("#title")
      .simulate("change", { target: { value: item.title, name: "title" } });
    wrapper.find("#price").simulate("change", {
      target: { value: item.price, name: "price", type: "number" },
    });
    wrapper.find("#description").simulate("change", {
      target: { value: item.description, name: "description" },
    });
    // mock the router
    Router.router = { push: jest.fn() };
    wrapper.find("form").simulate("submit");
    await wait(50);
    expect(Router.router.push).toHaveBeenCalled();
    expect(Router.router.push).toHaveBeenCalledWith({
      pathname: "/item",
      query: { id: "abc123" },
    });
  });
});
