const { Schema, model } = require("mongoose");
// TODO: 
// Properties: 
// - Title: Required
// - Description: Optional. Max length 250 characters.
// - Priority: Enum ["LOW", "MEDIUM", "HIGH"]
// - Done: Boolean.
// - Due Date: Date.
// - User

const todoSchema = new Schema(
    {
        title: {
            type: String, 
            required: true
        },
        description: {
            type: String,
            maxLength: 250
        },
        priority: {
            type: String,
            enum: ["LOW", "MEDIUM", "HIGH"],
            default: "LOW"
        },
        done: {
            type: Boolean,
            default: false
        },
        dueDate: {
            type: Date,
            default: Date.now
        }
        // user: {
        //     type: Schema.Types.ObjectId,
        //     ref: 'User'
        // }
    },
    {
        timestamps: true
    }
);

const Todo = model("Todo", todoSchema);

module.exports = Todo;