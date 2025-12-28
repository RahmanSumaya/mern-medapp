const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const { protect, authorize } = require('../middleware/authMiddleware');

// @route   POST api/articles
// @desc    Admin adds a new disease article
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { title, diseaseName, content, symptoms, prevention, treatments, imageUrl, source } = req.body;

    const newArticle = new Article({
      title,
      diseaseName,
      content,
      symptoms,
      prevention,
      treatments,
      imageUrl,
      source,
      postedBy: req.user.id
    });

    const article = await newArticle.save();
    res.json(article);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/articles
// @desc    Get all articles OR search by disease name
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    // If the user types something in the search bar
    if (search) {
      query = { diseaseName: { $regex: search, $options: 'i' } }; // 'i' makes it case-insensitive
    }

    const articles = await Article.find(query).sort({ createdAt: -1 });
    res.json(articles);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});
// @route   PUT api/articles/:id
// @desc    Admin can edit an existing article
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const updatedArticle = await Article.findByIdAndUpdate(
      req.params.id,
      { $set: req.body }, // Updates only the fields you send in Postman
      { new: true }       // Returns the updated version of the article
    );

    if (!updatedArticle) return res.status(404).json({ msg: 'Article not found' });
    
    res.json(updatedArticle);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/articles/:id
// @desc    Admin can delete an article
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ msg: 'Article not found' });
    }

    await article.deleteOne();
    res.json({ msg: 'Article removed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;