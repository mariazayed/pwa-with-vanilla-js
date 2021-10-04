import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const PostsSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        // required: true,
    },
    location: {
        type: String,
        required: true,
    },
});
