import mongoose, { model, Schema } from "mongoose";

const pdfSchema = new Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    fileName:{
        type: String,
    },
    pdf:{
        url:{
            type: String
        },
        public_id:{
            type: String
        }
    }
},{
    timestamps: true
})

const pdfModel = new model('Pdf', pdfSchema);

export default pdfModel