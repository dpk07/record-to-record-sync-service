const TokenBucket = require("../limiter/tokenBucket");
const retry = require("../utils/retryWithBackoff");
const rateLimits = require("../config/rateLimits");
const queue = require("../queue/inMemoryQueue");
const transformers = require("../transformers");
const validators = require("../validators");
const axios = require("axios");
const fs = require("fs");

const buckets = {};

for (const crm in rateLimits) {
  const { capacity, refillRate } = rateLimits[crm];
  buckets[crm] = new TokenBucket(capacity, refillRate);
}

function validatePayload(task) {
  const validator = validators[task.crm];
  return validator && validator(task.payload);
}

function transformPayload(task) {
  const transformer = transformers[task.crm];
  if (!transformer) throw new Error(`No transformer found for CRM: ${task.crm}`);
  return transformer(task);
}

async function dispatch(task) {
  const transformed = transformPayload(task);
  const url = `http://localhost:3001/sync`;
  const config = { method: "post", url, data: transformed };

  if (task.action === "update") config.method = "put";
  if (task.action === "delete") config.method = "delete";

  await retry(async () => {
    const res = await axios(config);
    console.log(`Success: [${task.crm}] ${task.action.toUpperCase()} ID ${task.id}`);
    return res;
  });
}

function startDispatcher() {
  setInterval(async () => {
    if (queue.isEmpty()) return;
    const task = queue.pop();

    if (!validatePayload(task)) {
      console.error(`Invalid payload schema for task ${task.id}`);
      fs.appendFileSync("logs/dlq.json", JSON.stringify(task) + "\n");
      return;
    }

    const bucket = buckets[task.crm];
    if (!bucket.tryRemoveToken()) {
      console.log(`Rate limit hit, re-queueing task ${task.id}`);
      setTimeout(() => queue.push(task), 1000);
      return;
    }

    try {
      await dispatch(task);
    } catch (err) {
      console.error(`Failed: [${task.crm}] ID ${task.id}`);
      fs.appendFileSync("logs/dlq.json", JSON.stringify(task) + "\n");
    }
  }, 100);
}

module.exports = { startDispatcher };