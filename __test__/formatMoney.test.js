import formatMoney from "../lib/formatMoney";

describe("Format money function", () => {
  it("adds comma to denote multiple digit value", () => {
    expect(formatMoney(500000)).toEqual("NGN 500,000");
    expect(formatMoney(14000)).toEqual("NGN 14,000");
    expect(formatMoney(30000)).toEqual("NGN 30,000");
  });

  it("shuold return money value of the number passed", () => {
    expect(formatMoney(500000)).toEqual("NGN 500,000");
    expect(formatMoney(121232132351553224132000)).toEqual(
      "NGN 121,232,132,351,553,230,000,000.00"
    );
    expect(formatMoney(492828382342300)).toEqual("NGN 492,828,382,342,300");
    expect(formatMoney(123232323211431000)).toEqual(
      "NGN 123,232,323,211,431,000.00"
    );
  });
});
