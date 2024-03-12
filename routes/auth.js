const express = require('express');
const passport = require('passport');
const router = express.Router();

//  Auth with Google
//  GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

//  google auth callback
//  GET /auth/google/callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  res.redirect('/dashboard');
})

//  Logout user
//  /auth/logout
router.get('/logout', (req, res) => {
  req.logout((error) => {
    if (error) { return next(error) }
    res.redirect('/')
  })
});

module.exports = router;