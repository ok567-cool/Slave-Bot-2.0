const { Schema, model } = require('mongoose');

const ISinventorySchema = new Schema({
    userId:{
        type:String,
    },
    cBag:{
        type:String,
        default: 'None',
    },
    whip:{
        type:String,
        default:'None',
    },
    pPoints:{
        type:Number,
        default:0,
    },
    cBagXpGain:{
        type:Number,
        default:0,
    },
    wXpGain:{
        type:Number,
        default:0,
    }
    },
    { timestamps: true }
);

module.exports = model('ISinventory', ISinventorySchema);