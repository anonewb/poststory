const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');
const mongoose = require('mongoose');
const Story = mongoose.model('stories');
const User = mongoose.model('users');

// Stories Index
router.get('/', (req, res) => {
	Story.find({ status: 'public' })
		.populate('user') // for reference purpose
		//*** it will populate all the fields of user with user's collection, then we can have access to it inside views
		.sort({ date: 'desc' })
		.then(stories => {
			res.render('stories/index', {
				stories: stories
			});
		});
});

// Show Single Story
router.get('/show/:id', (req, res) => {
	Story.findOne({
		_id: req.params.id
	})
		.populate('user')
		.populate('comments.commentUser')
		.then(story => {
			if (story.status == 'public') {
				// block private story details
				res.render('stories/show', {
					story: story
				});
			} else {
				if (req.user) {
					if (req.user.id == story.user._id) {
						res.render('stories/show', {
							story: story
						});
					} else {
						res.redirect('/stories');
					}
				} else {
					res.redirect('/stories');
				}
			}
		});
});

// List stories from a user
router.get('/user/:userId', (req, res) => {
	Story.find({ user: req.params.userId, status: 'public' })
		.populate('user')
		.then(stories => {
			res.render('stories/index', {
				stories: stories
			});
		});
});

// Logged in users stories
router.get('/my', ensureAuthenticated, (req, res) => {
	Story.find({ user: req.user.id })
		.populate('user')
		.then(stories => {
			res.render('stories/index', {
				stories: stories
			});
		});
});

// Add Story form
router.get('/add', ensureAuthenticated, (req, res) => {
	res.render('stories/add');
});

// Edit Story Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
	Story.findOne({
		_id: req.params.id
	}).then(story => {
		if (story.user != req.user.id) {
			// access control
			res.redirect('/stories');
		} else {
			res.render('stories/edit', {
				story: story
			});
		}
	});
});

// Process Add Story
router.post('/', (req, res) => {
	// console.log(req.body);
	let allowComments;

	if (req.body.allowComments) {
		allowComments = true;
	} else {
		allowComments = false;
	}

	const newStory = {
		title: req.body.title,
		body: req.body.body,
		status: req.body.status,
		allowComments: allowComments,
		user: req.user.id
	};

	// Create Story
	new Story(newStory).save().then(story => {
		res.redirect(`/stories/show/${story.id}`);
	});
});

// Edit Form Process
router.put('/:id', (req, res) => {
	Story.findOne({
		_id: req.params.id
	}).then(story => {
		let allowComments;

		if (req.body.allowComments) {
			allowComments = true;
		} else {
			allowComments = false;
		}

		// New values
		story.title = req.body.title;
		story.body = req.body.content;
		story.status = req.body.status;
		story.allowComments = allowComments;

		story
			.save()
			.then(story => {
				res.redirect('/dashboard');
			})
			.catch(err => console.log(err));
	});
});

// Delete Story
router.delete('/:id', (req, res) => {
	Story.remove({ _id: req.params.id }).then(() => {
		res.redirect('/dashboard');
	});
});

// Add Comment
router.post('/comment/:id', (req, res) => {
	Story.findOne({
		_id: req.params.id
	}).then(story => {
		const newComment = {
			commentBody: req.body.commentBody,
			commentUser: req.user.id
		};

		// Add to comments array
		story.comments.unshift(newComment); // opp of push()

		story.save().then(story => {
			res.redirect(`/stories/show/${story.id}`);
		});
	});
});

module.exports = router;
