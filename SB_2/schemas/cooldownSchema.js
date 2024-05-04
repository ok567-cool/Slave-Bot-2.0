const { Schema, model } = require('mongoose');

const cooldownSchema = new Schema({
    commandName:{
        type: String,
        required: true,

    },
    userId:{
        type: String,
        required: true,

    },
    endsat:{
        type: Date,
        required: true,

    }
});

module.exports = model('cooldown', cooldownSchema);