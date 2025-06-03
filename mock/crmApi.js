const express = require("express");

function startMockCRM() {
  const app = express();
  app.use(express.json());

  app.post("/sync", (req, res) => {
    const rand = Math.random();
    if (rand < 0.2) return res.status(429).send("Rate limit");
    if (rand < 0.3) return res.status(500).send("Server error");
    return res.status(200).send("OK");
  });

  return new Promise((resolve) => {
    app.listen(3001, () => {
      console.log("Mock CRM API listening on port 3001");
      resolve();
    });
  });
}

module.exports = { startMockCRM };