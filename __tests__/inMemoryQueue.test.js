const queue = require("../queue/inMemoryQueue");

describe("InMemoryQueue", () => {
  it("should add and remove items", () => {
    queue.push({ id: 1 });
    expect(queue.isEmpty()).toBe(false);
    const item = queue.pop();
    expect(item).toEqual({ id: 1 });
  });

  it("should return true for empty queue", () => {
    while (!queue.isEmpty()) queue.pop();
    expect(queue.isEmpty()).toBe(true);
  });
});
