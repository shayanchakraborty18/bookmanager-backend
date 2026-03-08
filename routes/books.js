const express = require('express');
const router = express.Router();
const { body, validationResult, query } = require('express-validator');
const Book = require('../models/Book');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get(
  '/',
  [
    query('status').optional().isIn(['want-to-read', 'reading', 'completed']),
    query('tag').optional().isString(),
  ],
  async (req, res) => {
    try {
      const filter = { user: req.user._id };

      if (req.query.status) filter.status = req.query.status;
      if (req.query.tag) filter.tags = req.query.tag;

      const books = await Book.find(filter).sort({ updatedAt: -1 });
      res.json(books);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch books' });
    }
  }
);

router.get('/stats', async (req, res) => {
  try {
    const userId = req.user._id;

    const [total, wantToRead, reading, completed, allBooks] = await Promise.all([
      Book.countDocuments({ user: userId }),
      Book.countDocuments({ user: userId, status: 'want-to-read' }),
      Book.countDocuments({ user: userId, status: 'reading' }),
      Book.countDocuments({ user: userId, status: 'completed' }),
      Book.find({ user: userId }).select('tags'),
    ]);

    const tagMap = {};
    allBooks.forEach((book) => {
      book.tags.forEach((tag) => {
        tagMap[tag] = (tagMap[tag] || 0) + 1;
      });
    });
    const tags = Object.entries(tagMap)
      .sort((a, b) => b[1] - a[1])
      .map(([tag, count]) => ({ tag, count }));

    res.json({ total, wantToRead, reading, completed, tags });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
});

router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
    body('author').trim().notEmpty().withMessage('Author is required').isLength({ max: 100 }),
    body('status').optional().isIn(['want-to-read', 'reading', 'completed']),
    body('tags').optional().isArray(),
    body('notes').optional().isString().isLength({ max: 1000 }),
    body('coverColor').optional().isString(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      const { title, author, tags, status, notes, coverColor } = req.body;

      const book = await Book.create({
        user: req.user._id,
        title,
        author,
        tags: tags || [],
        status: status || 'want-to-read',
        notes,
        coverColor,
      });

      res.status(201).json(book);
    } catch (err) {
      res.status(500).json({ message: 'Failed to add book' });
    }
  }
);

router.put(
  '/:id',
  [
    body('title').optional().trim().notEmpty().isLength({ max: 200 }),
    body('author').optional().trim().notEmpty().isLength({ max: 100 }),
    body('status').optional().isIn(['want-to-read', 'reading', 'completed']),
    body('tags').optional().isArray(),
    body('notes').optional().isString().isLength({ max: 1000 }),
  ],
  async (req, res) => {
    try {
      const book = await Book.findOne({ _id: req.params.id, user: req.user._id });
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }

      const allowedFields = ['title', 'author', 'tags', 'status', 'notes', 'coverColor'];
      allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) book[field] = req.body[field];
      });

      await book.save();
      res.json(book);
    } catch (err) {
      res.status(500).json({ message: 'Failed to update book' });
    }
  }
);

router.delete('/:id', async (req, res) => {
  try {
    const book = await Book.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json({ message: 'Book removed', id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete book' });
  }
});

module.exports = router;
