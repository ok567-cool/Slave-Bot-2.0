const { Schema, model } = require('mongoose');

const TradesSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    tradePartnerId:{
        type: String,
        required: true,
    },
    tradePrice:{
        type: Number,
        required: true,

    },
    slaveToTrade: {
        type: String,
        required: true,
    },
    tradeActive: {
        type: Boolean,
        default: false,
    },
    },
    { timestamps: true }
);

module.exports = model('Trades', TradesSchema);