const taskEvents = require('./events');

// ============================================================
// Practical 10: Event Listeners for Background Async Processing
// ============================================================

// 1. Listener for 'task-created' event
taskEvents.on('task-created', (task, user) => {
  try {
    const assignedUser = user?.email || user?.id || (typeof user === 'string' ? user : 'Unassigned/Anonymous');

    // Simulate slow notification handler (2-second asynchronous delay)
    // Demonstrates non-blocking background processing
    setTimeout(() => {
      console.log(
        `[Notification] Task "${task.title}" created at ${new Date().toISOString()} | Assigned User: ${assignedUser}`
      );
    }, 2000);
  } catch (error) {
    taskEvents.emit('error', error);
  }
});

// 2. Supplementary Problem 1: Listener for 'task-deleted' event
taskEvents.on('task-deleted', (taskId, user) => {
  try {
    const initiatedBy = user?.email || user?.id || (typeof user === 'string' ? user : 'Unassigned/Anonymous');
    console.log(
      `[Notification] Task ID "${taskId}" deleted at ${new Date().toISOString()} | Initiated by: ${initiatedBy}`
    );
  } catch (error) {
    taskEvents.emit('error', error);
  }
});

// 3. Supplementary Problem 2: Global error event listener
taskEvents.on('error', (error) => {
  console.error(`[Notification Error] Event caught error at ${new Date().toISOString()}:`, error.message || error);
});

module.exports = taskEvents;
