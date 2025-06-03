module.exports = {
  salesforce: (payload) => {
    return !!payload && typeof payload.id === "number" && typeof payload.name === "string";
  },
  hubspot: (payload) => {
    return !!payload && typeof payload.id === "number" && typeof payload.name === "string";
  },
};