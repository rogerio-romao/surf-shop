const Post = require('../models/post');

module.exports = {

    // Posts index
    async getPosts(req, res, next) {
        let posts = await Post.find({});
        res.render('posts/index', { posts });
    },

    // New post
    newPost(req, res, next) {
        res.render('posts/new');
    }

}
