import { mount } from "enzyme";
import wait from "waait";
import Pagination, { PAGINATION_INFO_QUERY } from "../components/Pagination";
import { MockedProvider } from "@apollo/react-testing";
import toJson from "enzyme-to-json";

function makeMocks(length) {
  return [
    {
      request: {
        query: PAGINATION_INFO_QUERY,
      },
      result: {
        data: {
          itemsConnection: {
            __typename: "aggregate",
            aggregate: {
              __typename: "count",
              count: length,
            },
          },
        },
      },
    },
  ];
}

describe("<Pagination/>", () => {
  it("displays a loading message", () => {
    const wrapper = mount(
      <MockedProvider mocks={makeMocks(1)}>
        <Pagination page={1} />
      </MockedProvider>
    );

    expect(wrapper.text()).toContain("Loading ...");
  });

  it("renders pagination for 20 items", async () => {
    const wrapper = mount(
      <MockedProvider mocks={makeMocks(20)}>
        <Pagination page={1} />
      </MockedProvider>
    );

    await wait();
    wrapper.update();
    const pages = wrapper.find(".totalPages");
    expect(pages.text()).toContain("4");
    const pagination = wrapper.find('div[data-test="pagination"]');
    expect(toJson(pagination)).toMatchSnapshot();
  });

  it("disables prev button on the first page", async () => {
    const wrapper = mount(
      <MockedProvider mocks={makeMocks(20)}>
        <Pagination page={1} />
      </MockedProvider>
    );

    await wait();
    wrapper.update();
    expect(wrapper.find("a.prev").prop("aria-disabled")).toEqual(true);
    expect(wrapper.find("a.next").prop("aria-disabled")).toEqual(false);
  });
  it("disables next button on the last page", async () => {
    const wrapper = mount(
      <MockedProvider mocks={makeMocks(20)}>
        <Pagination page={5} />
      </MockedProvider>
    );

    await wait();
    wrapper.update();
    expect(wrapper.find("a.next").prop("aria-disabled")).toEqual(true);
    expect(wrapper.find("a.prev").prop("aria-disabled")).toEqual(false);
  });
  it("enables both prev and next button on the middle page", async () => {
    const wrapper = mount(
      <MockedProvider mocks={makeMocks(20)}>
        <Pagination page={3} />
      </MockedProvider>
    );

    await wait();
    wrapper.update();
    expect(wrapper.find("a.next").prop("aria-disabled")).toEqual(false);
    expect(wrapper.find("a.prev").prop("aria-disabled")).toEqual(false);
  });
});
