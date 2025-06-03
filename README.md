# record-to-record-sync-service

# Rate-Limited Sync Dispatcher

## Problem Statement

Problem Statement: Record-to-Record Synchronization Service
Design a bi-directional record synchronization service that can handle CRUD (Create, Read, Update,
Delete) operations between two systems:
- System A (Internal): We have full access, including back-end services and storage.
- System B (External): Accessible only via API. External APIs may have rate limits, and the data
models may differ from our internal system.
The system must handle over 300 million synchronization requests daily, with near real-time latency
and 99.9% availability.
Additional Requirements:
- External APIs cannot support unlimited requests.
- Some data transformations are required to map between internal and external schemas.
- The system must support multiple CRM providers.
- Synchronization must occur record-by-record.
- Input/output should be validated against predefined schemas.
- Data must be transformed into/from the specific object models before being processed.
- Sync actions (CRUD) are determined by pre-configured rules or triggers.

---

This module focuses on one specific problem: **rate-limited sync of records from internal to external system**.

---

## What This Solves

This service is responsible for:
- Consuming record-level sync tasks from a queue.
- Sending each task to the correct CRM API.
- Respecting each CRM's configured rate limit.
- Retrying on errors.
- Handling backpressure by re-queuing tasks if dispatch is temporarily blocked.
- Logging failed dispatch attempts to a DLQ (dead letter queue).

---

## Design Decisions and Trade-offs

### Why token bucket rate limiter?
- Simple to implement and reason about.
- Allows for bursts up to a capacity limit while still enforcing steady average rate.
- In production, I would likely use a Redis-backed distributed rate limiter to scale across instances. Redis TTL can be helpful to track buckets.

### Why in-memory queue?
- Simplicity for the scoped implementation.
- Easy to test without infra dependencies.
- In production, this would be backed by a streaming platform like Kafka to support durability and scaling. This will also help in replaying the messages when in need. For eg: If salesforce is down for 2 hours. We can replay messages of last 2 hours.

### Why exponential backoff with jitter?
- Prevents retry spam due to intermittent failures.
- Jitter helps avoid issues if many tasks retry at once.

### What’s intentionally omitted?
- Authentication handling for CRM APIs.
- Task deduplication.
- Metrics and observability (though in production this would be essential).
- Parallelism using worker pools — current dispatcher uses a simple interval loop.

---

### Assumptions
- CDC is captured from internal service and pushed to a queue.
- Each event pushed to the queue has a specific format with crm, payload, action and record_id. We will partition by record_id to maintaing orders of record changes.
- Not supporting dynamic schema mapping currently.
- API credentials are configured automatically. Not handling explicitly.

### Scalability & Availability Considerations
#### Target: 300 million syncs/day 
- This means ~4000 events/ second. Lets consider 8000 events to include peak.
- Assuming one partition can handle 2000 events/second. We can have 4 partitions but considering peak scale lets go with 10 partitions which can be increased later.
- We should have separate topics for separate CRMs so that we can individually scale those consumers.
- Considering 10 partitions, we can have 5 consumers, each consumer processing 1000 events per second. We will need to benchmark this and tweak the count based on results. We can have 10 consumers at max if required. Also we will need to consider third party response times and limits before we scale up our consumers.
- This entire system can be horizontally scaled by increasing number of partitions and eventually consumers.
- Main bottleneck for us will be third party API response times and limits, every other component we can scale as per need.
- With above steps we can achieve near real-time latency.

### Fault tolerance(99.9 availability)
- We are having retries in place to make sure that rate limiting is handled.
- We are having validation in place to make sure schema is validated before sending.
- We are having separate queues for crms to make sure one crm is not choking others.
- We have an option to replay records so that we face no data loss.
- We will have alerts on Kafka disk size, kafka cpu, kafka lag, pod CPU and memory, third party api response alerts to notify us if any of their systems is down/degraded. 


## Running the Project

```bash
npm install
node index.js
```


