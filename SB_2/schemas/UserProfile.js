const { Schema, model } = require('mongoose');

const userProfileSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    balance: {
        type: Number,
        default: 0,

    },
    lastDailyCollected: {
        type: Date,
    },
    dailyMultiplier:{
        type: Number,
        default: 1,
    },
    rankXp:{
        type:Number,
        default:0,
    },
    rank:{
        type:String,
        default:'Beginner',
    }
    },
    { timestamps: true }
);

module.exports = model('UserProfile', userProfileSchema);