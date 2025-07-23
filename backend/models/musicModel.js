import mongoose from 'mongoose'

const musicSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    artist: { 
        type: String, 
        required: true 
    },
    filepath: { 
        type: String, 
        required: true 
    },
    imageFilepath: { 
        type: Number, 
        required: true 
    }
}, {timestamps: true})

const musicModel = mongoose.models.music || mongoose.model('Music', musicSchema)

export default musicModel