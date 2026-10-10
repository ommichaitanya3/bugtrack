const mongoose = require('mongoose');
const Bug = require('../models/Bug');

const invalidId = (id) => !mongoose.Types.ObjectId.isValid(id);

const createBug = async (req, res) => {
  try {
    const { title, description, priority, status } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }
    const bug = await Bug.create({ title, description, priority, status, createdBy: req.user._id });
    return res.status(201).json(bug);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Unable to create bug' });
  }
};

const getBugs = async (req, res) => {
  try {
    const query = { createdBy: req.user._id };
    if (req.query.status) query.status = req.query.status;
    if (req.query.search) query.title = { $regex: req.query.search, $options: 'i' };
    const bugs = await Bug.find(query).sort({ createdAt: -1 });
    return res.status(200).json(bugs);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Unable to get bugs' });
  }
};

const getBugById = async (req, res) => {
  if (invalidId(req.params.id)) return res.status(400).json({ message: 'Invalid bug ID' });
  try {
    const bug = await Bug.findOne({ _id: req.params.id, createdBy: req.user._id });
    if (!bug) return res.status(404).json({ message: 'Bug not found' });
    return res.status(200).json(bug);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Unable to get bug' });
  }
};

const updateBug = async (req, res) => {
  if (invalidId(req.params.id)) return res.status(400).json({ message: 'Invalid bug ID' });
  try {
    const bug = await Bug.findOne({ _id: req.params.id, createdBy: req.user._id });
    if (!bug) return res.status(404).json({ message: 'Bug not found' });
    for (const field of ['title', 'description', 'priority', 'status']) {
      if (req.body[field] !== undefined) bug[field] = req.body[field];
    }
    await bug.save();
    return res.status(200).json(bug);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Unable to update bug' });
  }
};

const deleteBug = async (req, res) => {
  if (invalidId(req.params.id)) return res.status(400).json({ message: 'Invalid bug ID' });
  try {
    const bug = await Bug.findOne({ _id: req.params.id, createdBy: req.user._id });
    if (!bug) return res.status(404).json({ message: 'Bug not found' });
    await bug.deleteOne();
    return res.status(200).json({ message: 'Bug deleted' });
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Unable to delete bug' });
  }
};

const getStats = async (req, res) => {
  try {
    const counts = await Bug.aggregate([
      { $match: { createdBy: req.user._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const stats = { Open: 0, 'In Progress': 0, Resolved: 0 };
    for (const item of counts) stats[item._id] = item.count;
    return res.status(200).json(stats);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Unable to get stats' });
  }
};

module.exports = { createBug, getBugs, getBugById, updateBug, deleteBug, getStats };
