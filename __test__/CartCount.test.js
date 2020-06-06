import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import CartCount from "../components/CartCount";

describe("<CartCount/>", () => {
  it("renders", () => {
    shallow(<CartCount count={10} />);
  });

  it("matches snapshot", () => {
    const wrapper = shallow(<CartCount count={10} />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it("updates via props", () => {
    const wrapper = shallow(<CartCount count={15} />);
    expect(toJson(wrapper)).toMatchSnapshot();
    wrapper.setProps({ count: 10 });
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
