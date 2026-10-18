# Practical 10: Asynchronous Processing with Event-Driven Architecture

## Course Objectives & Mapping
- **Practical:** 10
- **CO / PO:** CO4 / PO3, PO5
- **Objective:** Implement asynchronous background processing using Node.js native `EventEmitter` without external dependencies.

---

## Architecture Flow

```
POST /api/tasks request
       │
       ▼
Save task to MongoDB
       │
       ▼
Log: [API] Response sent at <Timestamp 1>
       │
       ├─────────────────────────────────────────► API responds immediately (201 Created)
       │                                           (Client unblocks in ~10-20ms)
       ▼
taskEvents.emit('task-created', task, user)
       │
       ▼ (Asynchronously processed in background queue after 2s delay)
Notification Listener:
└── Logs: [Notification] Task "<Title>" created at <Timestamp 2> | Assigned User: <User>
```

---

## Implementation Details

### 1. Dedicated Event Emitter Module (`backend/utils/events.js`)
```javascript
const EventEmitter = require('events');

class TaskEvents extends EventEmitter {}

// Singleton instance shared across the entire backend
module.exports = new TaskEvents();
```

### 2. Event Listeners & Async Handlers (`backend/utils/listeners.js`)
```javascript
const taskEvents = require('./events');

// Listener for 'task-created' event
taskEvents.on('task-created', (task, user) => {
  try {
    const assignedUser = user?.email || user?.id || 'Unassigned/Anonymous';

    // 2-second asynchronous non-blocking delay simulation
    setTimeout(() => {
      console.log(
        `[Notification] Task "${task.title}" created at ${new Date().toISOString()} | Assigned User: ${assignedUser}`
      );
    }, 2000);
  } catch (error) {
    taskEvents.emit('error', error);
  }
});

// Supplementary Problem 1: 'task-deleted' event listener
taskEvents.on('task-deleted', (taskId, user) => {
  try {
    const initiatedBy = user?.email || user?.id || 'Unassigned/Anonymous';
    console.log(
      `[Notification] Task ID "${taskId}" deleted at ${new Date().toISOString()} | Initiated by: ${initiatedBy}`
    );
  } catch (error) {
    taskEvents.emit('error', error);
  }
});

// Supplementary Problem 2: Global error event listener
taskEvents.on('error', (error) => {
  console.error(`[Notification Error] Event caught error at ${new Date().toISOString()}:`, error.message || error);
});

module.exports = taskEvents;
```

### 3. Route Trigger Point (`backend/routes/taskRoutes.js`)
```javascript
// POST /api/tasks
router.post("/", authMiddleware, validateTask, async (req, res, next) => {
  try {
    const { title, description, completed, priority } = req.body || {};

    const newTask = await Task.create({
      title: title.trim(),
      description: description || "",
      completed: completed === true,
      priority: priority || "medium"
    });

    // Invalidate cache
    cache.del('all_tasks');

    // 1. Immediate client response
    console.log(`[API] Response sent at ${new Date().toISOString()}`);
    res.status(201).json(newTask);

    // 2. Background event emitted after response
    taskEvents.emit('task-created', newTask, req.user);
  } catch (error) {
    next(error);
  }
});
```

---

## Verification & Timestamp Evidence

When a task creation request is executed:

```
[API] Response sent at 2026-10-18T13:08:12.104Z
POST /api/tasks 201 18.421 ms - 214
... (Client has received the JSON response and continued interaction)
[Notification] Task "Learn Node.js Events" created at 2026-10-18T13:08:14.106Z | Assigned User: test@example.com
```

### Timestamp Comparison:
| Event Point | Timestamp | Time Difference |
|---|---|---|
| **API Response Dispatched** | `2026-10-18T13:08:12.104Z` | Baseline (0 ms) |
| **Notification Listener Completed** | `2026-10-18T13:08:14.106Z` | **+2002 ms** (Delayed in background) |

**Conclusion:** The API response was returned in ~18ms, completely decoupling the client from the 2000ms background notification task.

---

## Key Questions & Analysis

### Q1: Why does emitting an event not block the API response, even though both run on the same Node.js process?
**Answer:**
Node.js operates on an event-driven, single-threaded Event Loop. When `res.status(201).json(newTask)` is executed, Node.js dispatches the HTTP status line, headers, and serialized body directly to the underlying TCP socket buffer. When asynchronous timers (such as `setTimeout`) or deferred callbacks are registered within the listener, the callback is offloaded to the Timers queue of the Event Loop. The current synchronous call stack completes immediately, allowing the client's HTTP response cycle to finish in milliseconds while the background logic waits for its turn on the Event Loop without blocking.

### Q2: What would happen to API response time if the notification logic were placed directly inside the POST route instead of in an event handler?
**Answer:**
If the notification logic (including email delivery, external webhook, or the 2-second simulation) were placed synchronously inside the `POST /tasks` controller before `res.status(201).json()`, the client's request would remain blocked in a pending state for over 2,000 milliseconds (~2 seconds). This would severely degrade perceived application performance, tie up socket connections, and prevent rapid user interactions.

### Q3: Why is EventEmitter a reasonable choice for this scale of application, but not for a production system handling millions of events per day?
**Answer:**
Node.js's built-in `EventEmitter` is an ideal, zero-dependency mechanism for single-process architectures because it is lightweight, runs in-memory, and requires no auxiliary infrastructure.

However, in large-scale enterprise production systems handling millions of events:
1. **In-Memory Volatility:** `EventEmitter` does not persist events to disk. If the Node.js process restarts, crashes, or runs out of memory, all unhandled events are irrevocably lost.
2. **No Multi-Process / Cluster Distribution:** Events are localized to a single process. In horizontally scaled environments (multiple containers/nodes behind a load balancer), an event emitted on Node A cannot be listened to or processed by worker Node B.
3. **No Retries, Dead-Letter Queues (DLQ), or Rate Limiting:** Built-in `EventEmitter` lacks automatic retry policies, backpressure handling, acknowledgement handshakes, and failure routing.

*Production Solution:* Distributed message brokers like **RabbitMQ**, **Apache Kafka**, **AWS SQS**, or **Redis BullMQ** provide persistent queues, worker pools, and horizontal scaling.
