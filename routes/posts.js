const express = require('express');
const router = express.Router();
const { errorHandler } = require('../middleware');
const { getPosts, newPost } = require('../controllers/posts');

/* GET posts index /posts */
router.get('/', errorHandler(getPosts));

/* GET posts new /posts/new */
router.get('/new', newPost);

/* POST posts create /posts */
router.get('/', (req, res, next) => {
    res.send('CREATE /posts');
});

/* GET posts show /posts/:id */
router.get('/:id', (req, res, next) => {
    res.send('SHOW /posts/:id');
});

/* GET posts edit /posts/:id/edit */
router.get('/:id/edit', (req, res, next) => {
    res.send('EDIT /posts/:id/edit');
});

/* PUT posts update /posts/:id */
router.get('/:id', (req, res, next) => {
    res.send('UPDATE /posts/:id');
});

/* DELETE posts destroy /posts/:id */
router.get('/:id', (req, res, next) => {
    res.send('DESTROY /posts/:id');
});

module.exports = router;


// RESTFUL Routes

// GET Index       /posts
// GET New         /posts/new
// POST Create     /posts
// GET Show        /posts/:id
// GET Edit        /posts/:id/edit
// PUT Update      /posts/:id
// DELETE Destroy  /posts/:id
