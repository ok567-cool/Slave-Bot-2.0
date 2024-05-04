const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { ApplicationCommandOptionType } = require('discord.js');

const UserProfile = require('../schemas/UserProfile');
const Marketplace = require('../schemas/MarketplaceSchema');
const Inventory   = require('../schemas/Inventory');
const Trades      = require('../schemas/Trades');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tradereject')
        .setDescription('Rejects your current active trade'), 
    run: async({interaction}) => {
        let trades = await Trades.findOne({userId: interaction.member.id});
        if(!trades || trades.tradeActive == false){
            const tradeDoesntExistEmbed = new EmbedBuilder()
                .setColor('Red')
                .setTitle('😖 You dont have any active trades!')


            return interaction.reply({embeds: [tradeDoesntExistEmbed]});
        }

        trades.tradeActive = false;
        trades.save();
        const tradeDoesntExistEmbed = new EmbedBuilder()
                .setColor('DarkPurple')
                .setTitle('❌ You rejected your current trade!')


        return interaction.reply({embeds: [tradeDoesntExistEmbed]});
        


        
    }
}