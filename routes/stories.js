const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');

const Story = require('../models/Story');

// Show add page
// Get /stories/add
router.get('/add', ensureAuth, (req, res) => {
  res.render('stories/add');
});

// Process add form
// Post /stories
router.post('/', ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Story.create(req.body);
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
});

// Show All Stories
// Get /
router.get('/', ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ status: 'public' })
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean();

    res.render('stories/index', {
      stories,
      user: req.user.id, // Pass the logged-in user data
    })
  } catch (err) {
    console.error(err);
    res.render('error/500')
  }
});


module.exports = router;