const { Schema, model } = require('mongoose');

const marketplaceSchema = new Schema({
    guildId:{
        type:String,
    },
    finalArr:{
        type:Array,
    },
    finalPrices:{
        type:Array,
    },
    finalEmojis:{
        type:Array,
    },
    marketplaceChangeDate:{
        type:Date,
    },
    ogPrices:{
        type: Array,
    },
    finalRarities:{
        type:Array,
    }
    },
    { timestamps: true }
);

module.exports = model('Marketplace', marketplaceSchema);