const express = require('express');
const router = express.Router();
const { postRegister } = require('../controllers');
const { errorHandler } = require('../middleware');
const passport = require('passport');

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('index', { title: 'Surf Shop - Home' });
});

/* GET /register */
router.get('/register', (req, res, next) => {
    res.send('GET /register');
});

/* POST /register */
router.post('/register', errorHandler(postRegister));

/* GET /login */
router.get('/login', (req, res, next) => {
    res.send('GET /login');
});

/* POST /login */
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

/* GET /logout */
router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/');
});

/* GET /profile */
router.get('/profile', (req, res, next) => {
    res.send('GET /profile');
});

/* PUT /profile/:user_id */
router.put('/profile/:user_id', (req, res, next) => {
    res.send('PUT /profile/:user_id');
});

/* GET /forgot */
router.get('/forgot', (req, res, next) => {
    res.send('GET /forgot');
});

/* PUT /forgot */
router.put('/forgot', (req, res, next) => {
    res.send('PUT /forgot');
});

/* GET /reset/:token */
router.get('/reset/:token', (req, res, next) => {
    res.send('GET /reset/:token');
});

/* PUT /reset/:token */
router.put('/reset/:token', (req, res, next) => {
    res.send('PUT /reset/:token');
});

module.exports = router;
