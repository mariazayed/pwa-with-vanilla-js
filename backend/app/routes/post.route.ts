import { PostController } from '../controllers/post.controller';
import {
    Request,
    Response,
} from 'express';

export class PostRoute {

    public postController: PostController = new PostController();

    public routes(app): void {

        app.route('/').get((req: Request, res: Response) => {
            res.status(200).send({
                message: 'GET request successful !',
            });
        });

        app.route('/post')
                .get(this.postController.getPosts)
                .post(this.postController.addNewPost);

        app.route('/post/:postId')
                .get(this.postController.getPostById)
                .put(this.postController.updatePost)
                .delete(this.postController.deletePost);
    }
}
