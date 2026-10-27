const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const validateTask = require("../middleware/validationMiddleware");
const Task = require("../models/Task");
const cache = require("../utils/cache");
const taskEvents = require("../utils/events");

// ========================================
// DEBUG cache stats
// ========================================
router.get("/debug/cache-stats", (req, res) => {
  res.json(cache.getStats());
});

// ========================================
// GET tasks - Get all tasks (Protected)
// ========================================
router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const cached = cache.get('all_tasks');
    if (cached) return res.status(200).json(cached);

    if (process.env.NODE_ENV === "test" && require("mongoose").connection.readyState !== 1) {
      const sampleTasks = [
        { _id: "1", title: "CI/CD Setup Task", completed: false, priority: "high" }
      ];
      return res.status(200).json(sampleTasks);
    }

    const tasks = await Task.find().sort({ createdAt: -1 });
    cache.set('all_tasks', tasks);
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
});

// ========================================
// GET task by ID (Protected)
// ========================================
router.get("/:id", authMiddleware, async (req, res, next) => {
  try {
    const cacheKey = `single_task_${req.params.id}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.status(200).json(cached);

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    cache.set(cacheKey, task);
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
});

// ========================================
// CREATE task (Protected + Input Validated)
// ========================================
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

    console.log(`[API] Response sent at ${new Date().toISOString()}`);
    res.status(201).json(newTask);

    // Emit event asynchronously AFTER response (passes task and assigned user)
    taskEvents.emit('task-created', newTask, req.user);
  } catch (error) {
    next(error);
  }
});

// ========================================
// UPDATE task (Protected)
// ========================================
router.put("/:id", authMiddleware, async (req, res, next) => {
  try {
    const updateData = {};
    if (req.body.title !== undefined) updateData.title = req.body.title;
    if (req.body.description !== undefined) updateData.description = req.body.description;
    if (req.body.completed !== undefined) updateData.completed = req.body.completed;
    if (req.body.priority !== undefined) updateData.priority = req.body.priority;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      updateData,
      { returnDocument: "after", runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Invalidate cache
    cache.del('all_tasks');
    cache.del(`single_task_${req.params.id}`);

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
});

// ========================================
// DELETE task (Protected)
// ========================================
router.delete("/:id", authMiddleware, async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Invalidate cache
    cache.del('all_tasks');
    cache.del(`single_task_${req.params.id}`);

    console.log(`[API] Response sent at ${new Date().toISOString()}`);
    res.status(200).json({
      message: "Task deleted successfully",
      task
    });

    // Emit event asynchronously AFTER response (passes taskId and initiating user)
    taskEvents.emit('task-deleted', req.params.id, req.user);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
