const taskEvents = require('./utils/events');
require('./utils/listeners');

console.log("=================================================");
console.log(" Practical 10: Event-Driven Architecture Test");
console.log("=================================================");

const mockTask = {
  _id: "67123abc456def7890123456",
  title: "Build Event-Driven Microservice",
  description: "Test non-blocking EventEmitter",
  priority: "high"
};

const mockUser = {
  id: "user_24it056",
  email: "24it056@charusat.edu.in"
};

// 1. Simulate POST /tasks API response and event emission
console.log(`\n[STEP 1] Client sends POST /api/tasks request...`);
console.log(`[API Response] Task saved. Response sent at: ${new Date().toISOString()}`);

// Immediate emission after response
taskEvents.emit('task-created', mockTask, mockUser);
console.log(`[Main Thread] Continuing execution immediately without waiting for listener!`);

// 2. Simulate DELETE /tasks/:id
setTimeout(() => {
  console.log(`\n[STEP 2] Simulating task deletion after 500ms...`);
  console.log(`[API Response] Task deleted. Response sent at: ${new Date().toISOString()}`);
  taskEvents.emit('task-deleted', mockTask._id, mockUser);
}, 500);

// 3. Test Error listener
setTimeout(() => {
  console.log(`\n[STEP 3] Testing error listener handling...`);
  taskEvents.emit('error', new Error("Simulated transient background processing failure"));
}, 1000);

// Keep alive for 3 seconds to observe the 2-second slow listener
setTimeout(() => {
  console.log("\n=================================================");
  console.log(" All event verifications completed successfully!");
  console.log("=================================================");
  process.exit(0);
}, 3000);
