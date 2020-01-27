const express = require('express');
const router = express.Router();

/* GET posts index /posts */
router.get('/', (req, res, next) => {
    res.send('INDEX /posts');
});

/* GET posts new /posts/new */
router.get('/new', (req, res, next) => {
    res.send('NEW /posts/new');
});

/* POST posts create /posts */
router.get('/', (req, res, next) => {
    res.send('CREATE /posts/new');
});

/* GET posts show /posts/:id */
router.get('/:id', (req, res, next) => {
    res.send('SHOW /posts/new');
});

/* GET posts edit /posts/:id/edit */
router.get('/:id/edit', (req, res, next) => {
    res.send('EDIT /posts/new');
});

/* PUT posts update /posts/:id */
router.get('/:id', (req, res, next) => {
    res.send('UPDATE /posts/new');
});

/* DELETE posts destroy /posts/:id */
router.get('/:id', (req, res, next) => {
    res.send('DESTROY /posts/new');
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
