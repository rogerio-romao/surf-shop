const Post = require('../models/post');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require('../cloudinary');

module.exports = {

    // Posts index
    async postIndex(req, res, next) {
        let posts = await Post.paginate({}, {
            page: req.query.page || 1,
            limit: 10,
            sort: { '_id': -1 }
        });
        posts.page = Number(posts.page);
        res.render('posts/index', { posts, mapBoxToken, title: 'Posts Index' });
    },

    // Posts new
    postNew(req, res, next) {
        res.render('posts/new');
    },

    // Posts create
    async postCreate(req, res, next) {
        req.body.post.images = [];
        for (const file of req.files) {
            req.body.post.images.push({
                url: file.secure_url,
                public_id: file.public_id
            });
        }
        let response = await geocodingClient.forwardGeocode({
                query: req.body.post.location,
                limit: 1
            })
            .send();
        req.body.post.geometry = response.body.features[0].geometry;
        req.body.post.author = req.user._id;
        let post = new Post(req.body.post);
        post.properties.description = `<strong><a href="/posts/${post._id}">${post.title}</a></strong><p>${post.location}</p><p>${post.description.substring(0, 20)}...</p>`;
        await post.save();
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
        const floorRating = post.calculateAvgRating();
        res.render('posts/show', { post, mapBoxToken, floorRating });
    },

    // Posts edit
    postEdit(req, res, next) {
        res.render('posts/edit');
    },

    // Posts update
    async postUpdate(req, res, next) {
        // destructure post from res.locals
        const { post } = res.locals;
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
                post.images.push({
                    url: file.secure_url,
                    public_id: file.public_id
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
            post.geometry = response.body.features[0].geometry;
            post.location = req.body.post.location;
        }
        // update the post with any new properties
        post.title = req.body.post.title;
        post.description = req.body.post.description;
        post.price = req.body.post.price;
        post.properties.description = `<strong><a href="/posts/${post._id}">${post.title}</a></strong><p>${post.location}</p><p>${post.description.substring(0, 20)}...</p>`;
        //save to db then redirect
        post.save();
        res.redirect(`/posts/${post.id}`);
    },

    // Posts destroy
    async postDestroy(req, res, next) {
        const { post } = res.locals;
        for (const image of post.images) {
            await cloudinary.v2.uploader.destroy(image.public_id);
        }
        await post.remove();
        req.session.success = 'Post successfully deleted.';
        res.redirect('/posts');
    }
}
