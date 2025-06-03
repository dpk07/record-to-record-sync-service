const transformers = require("../transformers");

describe("Transformers", () => {
  const task = { payload: { id: 10, name: "Test" }, action: "update" };

  it("salesforce transformer should map fields", () => {
    const result = transformers.salesforce(task);
    expect(result).toMatchObject({
      externalId: 10,
      fullName: "Test",
      operation: "update",
      source: "salesforce",
    });
  });

  it("hubspot transformer should map fields", () => {
    const result = transformers.hubspot(task);
    expect(result).toMatchObject({
      id: 10,
      name: "Test",
      actionType: "update",
      meta: { syncedFrom: "internal" },
    });
  });
});
