const { Schema, model } = require('mongoose');

const inventorySchema = new Schema({
    userId:{
        type:String,
    },
    slaves:{
        type:Array,
    },
    buyPrice:{
        type:Array,
    }
    },
    { timestamps: true }
);

module.exports = model('Inventory', inventorySchema);