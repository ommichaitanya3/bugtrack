const express = require('express');
const protect = require('../middleware/auth');
const { createBug, getBugs, getBugById, updateBug, deleteBug, getStats } = require('../controllers/bugController');

const router = express.Router();
router.use(protect);
router.get('/stats', getStats);
router.get('/', getBugs);
router.post('/', createBug);
router.get('/:id', getBugById);
router.put('/:id', updateBug);
router.delete('/:id', deleteBug);

module.exports = router;
