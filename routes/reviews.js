const express = require('express');
const router = express.Router({ mergeParams: true });

/* POST reviews create /posts/:id/reviews */
router.get('/', (req, res, next) => {
    res.send('CREATE /posts/:id/reviews');
});

/* PUT reviews update /posts/:id/reviews/:review_id */
router.get('/:id', (req, res, next) => {
    res.send('UPDATE /posts/:id/reviews/:review_id');
});

/* DELETE reviews destroy /posts/:id/reviews/:review_id */
router.get('/:id', (req, res, next) => {
    res.send('DESTROY /posts/:id/reviews/:review_id');
});

module.exports = router;
