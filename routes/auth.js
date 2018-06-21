const express = require('express');
const router = express.Router();
const passport = require('passport');

// AUTH ROUTE - will point by default to /auth

router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'] // what things of user is shared with us from his/her google acc
}));

router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: '/' 
  }), (req, res) => {
    // Successful authentication, redirect to dashboard.
    res.redirect('/dashboard');
});

router.get('/verify', (req, res) => {
  if(req.user){
    console.log(req.user);
  } else {
    console.log('Not Auth');
  }
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;