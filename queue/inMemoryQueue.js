const queue = [];

function initQueueWithFakeData() {
  for (let i = 0; i < 100; i++) {
    queue.push({
      id: i,
      crm: i % 2 === 0 ? "salesforce" : "hubspot",
      payload: { id: i, name: `User ${i}` },
      action: "update", // could be 'create', 'update', 'delete'
    });
  }
}

module.exports = {
  initQueueWithFakeData,
  pop: () => queue.shift(),
  push: (item) => queue.push(item),
  isEmpty: () => queue.length === 0,
};