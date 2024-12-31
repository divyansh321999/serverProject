import mongoose from "mongoose";

const todoSchema = mongoose.Schema({
    topic: {
        type: String,
        required: true
    },
    notes: {
        type: String,
        default: 'Just another Todo without a Notes'
    },
    deadline: {
        type: String,
        required: true
    }
}, {timestamps: true})

export default mongoose.model('Todo', todoSchema)