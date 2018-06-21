const express = require('express');
const router = express.Router();
const passport = require('passport');

// AUTH ROUTE - will point by default to /auth

router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'] // what things of user is shared with us from his/her google acc
}));

module.exports = router;