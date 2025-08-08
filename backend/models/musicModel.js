import mongoose from 'mongoose'

const musicSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true,
        trim: true,
        maxlength: 200
    },
    artist: { 
        type: String, 
        required: true,
        trim: true,
        maxlength: 100
    },
    filepath: { 
        type: String, 
        required: true 
    },
    imageFilepath: { 
        type: String,
        required: true 
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fileSize: {
        type: Number,
        required: true
    },
    duration: {
        type: Number, // Duration in seconds
        default: null
    },
    playCount: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {timestamps: true})

// Add indexes for better performance
musicSchema.index({ title: 1, artist: 1 })
musicSchema.index({ uploadedBy: 1 })
musicSchema.index({ createdAt: -1 })

const musicModel = mongoose.models.Music || mongoose.model('Music', musicSchema)

export default musicModel