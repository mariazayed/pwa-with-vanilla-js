import * as mongoose from 'mongoose';
import { PostsSchema } from '../models/post.model';
import {
    Request,
    Response,
} from 'express';

const post = mongoose.model('Post', PostsSchema);

export class PostController {

    public addNewPost(req: Request, res: Response) {
        let newPost = new post(req.body);

        console.log('newPost', newPost);

        newPost.save((err, post) => {
            if (err) {
                res.send(err);
            }
            res.json(post);
        });
    }

    public getPosts(req: Request, res: Response) {
        post.find({}, (err, post) => {
            if (err) {
                res.send(err);
            }
            res.json(post);
        });
    }

    public getPostById(req: Request, res: Response) {
        post.findById(req.params.postId, (err, post) => {
            if (err) {
                res.send(err);
            }
            res.json(post);
        });
    }

    public updatePost(req: Request, res: Response) {
        post.findOneAndUpdate({ _id: req.params.postId }, req.body, { new: true }, (err, post) => {
            if (err) {
                res.send(err);
            }
            res.json(post);
        });
    }

    public deletePost(req: Request, res: Response) {
        post.remove({ _id: req.params.postId }, (err) => {
            if (err) {
                res.send(err);
            }
            res.json({ message: 'Successfully deleted post!' });
        });
    }
}
