function Person(name, foods) {
  this.name = name;
  this.foods = foods;
}

Person.prototype.fetchFavFoods = function () {
  return new Promise((resolve, reject) => {
    // Simulate an api call
    setTimeout(() => resolve(this.foods), 2000);
  });
};

describe("Learning Mock", () => {
  it("mocks a reg function", () => {
    const fetchCats = jest.fn();

    fetchCats("Kitty");

    expect(fetchCats).toHaveBeenCalled();
    expect(fetchCats).toHaveBeenCalledWith("Kitty");
    fetchCats("nicole");
    expect(fetchCats).toHaveBeenCalledTimes(2);
  });

  it("can create a person", () => {
    const person1 = new Person("Person1", ["Eba", "Amala"]);

    expect(person1.name).toEqual("Person1");
  });

  it("can fetch foods", async () => {
    const jay = new Person("Jay", ["Semovita", "Pounded Yam"]);
    // Mock fetchFavFoods
    jay.fetchFavFoods = jest.fn().mockResolvedValue(["Poundo", "Rice"]);
    const favFoods = await jay.fetchFavFoods();

    expect(favFoods).toContain("Poundo");
  });
});
