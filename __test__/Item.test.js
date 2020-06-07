import ItemComponent from "../components/Item";
import formatMoney from "../lib/formatMoney";
import toJson from "enzyme-to-json";
import { shallow } from "enzyme";

const itemData = {
  id: "abc123",
  title: "Test Item",
  price: "40000",
  description: "Test Item Noni",
  image: "testitemimage.jpg",
  largeImage: "testLargeimage.jpg",
};
describe("<Item/>", () => {
  it("renders and matches snapshot", () => {
    const wrapper = shallow(<ItemComponent item={itemData} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it("renders the image properly", () => {
    const wrapper = shallow(<ItemComponent item={itemData} />);
    const img = wrapper.find("img");
    expect(img.props().src).toBe(itemData.image);
    expect(img.props().alt).toBe(itemData.title);
  });

  it("renders the price tag and title properly", () => {
    const wrapper = shallow(<ItemComponent item={itemData} />);
    const PriceTag = wrapper.find("PriceTag");
    expect(PriceTag.children().text()).toBe(formatMoney(itemData.price));
    expect(wrapper.find("Title a").text()).toBe(itemData.title);
  });

  it("renders the description properly", () => {
    const wrapper = shallow(<ItemComponent item={itemData} />);
    const description = wrapper.find("p");
    expect(description.text()).toBe(itemData.description);
  });

  it("renders the button list properly", () => {
    const wrapper = shallow(<ItemComponent item={itemData} />);
    const buttonList = wrapper.find(".buttonList");
    expect(buttonList.children()).toHaveLength(1);
    expect(buttonList.find("AddToCart").exists()).toBe(true);
  });
});
