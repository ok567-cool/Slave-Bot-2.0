const { Client, IntentsBitField } = require('discord.js');
const { CommandHandler }          = require('djs-commander');
const { EmbedBuilder }            = require('discord.js');

const mongoose = require('mongoose');
const path     = require('path');

const client = new Client({
    intents:[
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

new CommandHandler({
    client,
    commandsPath: path.join(__dirname, 'commands'),
    eventsPath: path.join(__dirname, 'events'),
});

(async () =>{
    await mongoose.connect('<DATABASE_CONNECTION LINK>');  //BOT CANT WORK WITHOUT THIS
    console.log(`✅ Sucessfully connected to the database`)
    client.login('<TOKEN>');				  //BOT CANT WORK WITHOUT THIS

})();	