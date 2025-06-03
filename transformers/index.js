module.exports = {
  salesforce: (task) => ({
    externalId: task.payload.id,
    fullName: task.payload.name,
    operation: task.action,
    source: "salesforce",
  }),
  hubspot: (task) => ({
    id: task.payload.id,
    name: task.payload.name,
    actionType: task.action,
    meta: { syncedFrom: "internal" },
  }),
};