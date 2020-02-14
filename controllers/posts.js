require('dotenv').config();
const Post = require('../models/post');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });
const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'rogerioromao',
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

module.exports = {

    // Posts index
    async postIndex(req, res, next) {
        let posts = await Post.paginate({}, {
            page: req.query.page || 1,
            limit: 10
        });
        posts.page = Number(posts.page);
        res.render('posts/index', { posts, title: 'Posts Index' });
    },

    // Posts new
    postNew(req, res, next) {
        res.render('posts/new');
    },

    // Posts create
    async postCreate(req, res, next) {
        req.body.post.images = [];
        for (const file of req.files) {
            let image = await cloudinary.v2.uploader.upload(file.path);
            req.body.post.images.push({
                url: image.secure_url,
                public_id: image.public_id
            });
        }
        let response = await geocodingClient.forwardGeocode({
                query: req.body.post.location,
                limit: 1
            })
            .send();
        req.body.post.coordinates = response.body.features[0].geometry.coordinates;
        let post = await Post.create(req.body.post);
        req.session.success = 'Post created successfully!';
        res.redirect(`/posts/${post.id}`);
    },

    // Posts show
    async postShow(req, res, next) {
        let post = await Post.findById(req.params.id).populate({
            path: 'reviews',
            options: { sort: { '_id': -1 } },
            populate: {
                path: 'author',
                model: 'User'
            }
        });
        res.render('posts/show', { post });
    },

    // Posts edit
    async postEdit(req, res, next) {
        let post = await Post.findById(req.params.id);
        res.render('posts/edit', { post });
    },

    // Posts update
    async postUpdate(req, res, next) {
        // find the post by id
        let post = await Post.findById(req.params.id);
        // handle any deletion of existing images
        if (req.body.deleteImages && req.body.deleteImages.length) {
            let deleteImages = req.body.deleteImages;
            for (const public_id of deleteImages) {
                await cloudinary.v2.uploader.destroy(public_id);
                for (const image of post.images) {
                    if (image.public_id === public_id) {
                        let index = post.images.indexOf(image);
                        post.images.splice(index, 1);
                    }
                }
            }
        }
        // handle upload of any new images
        if (req.files) {
            for (const file of req.files) {
                let image = await cloudinary.v2.uploader.upload(file.path);
                post.images.push({
                    url: image.secure_url,
                    public_id: image.public_id
                });
            }
        }
        // check if location has been changed
        if (req.body.post.location !== post.location) {
            let response = await geocodingClient.forwardGeocode({
                    query: req.body.post.location,
                    limit: 1
                })
                .send();
            post.coordinates = response.body.features[0].geometry.coordinates;
            post.location = req.body.post.location;
        }
        // update the post with any new properties
        post.title = req.body.post.title;
        post.description = req.body.post.description;
        post.price = req.body.post.price;
        //save to db then redirect
        post.save();
        res.redirect(`/posts/${post.id}`);
    },

    // Posts destroy
    async postDestroy(req, res, next) {
        let post = await Post.findById(req.params.id);
        for (const image of post.images) {
            await cloudinary.v2.uploader.destroy(image.public_id);
        }
        await post.remove();
        req.session.success = 'Post successfully deleted.';
        res.redirect('/posts');
    }
}
