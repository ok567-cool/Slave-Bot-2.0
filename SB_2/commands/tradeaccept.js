const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { ApplicationCommandOptionType } = require('discord.js');

const UserProfile = require('../schemas/UserProfile');
const Marketplace = require('../schemas/MarketplaceSchema');
const Inventory   = require('../schemas/Inventory');
const Trades      = require('../schemas/Trades');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tradeaccept')
        .setDescription('Accepts your current active trade'), 
    run: async({interaction}) => {
        let trades = await Trades.findOne({userId: interaction.member.id});
        if(!trades || trades.tradeActive == false){
            const tradeDoesntExistEmbed = new EmbedBuilder()
                .setColor('Red')
                .setTitle('😖 You dont have any active trades!')


            return interaction.reply({embeds: [tradeDoesntExistEmbed]});
        }

        let userProfile = await UserProfile.findOne({userId: interaction.member.id});
        if(!userProfile){
            if(!userProfile){
                const accountExistsEmbed = new EmbedBuilder()
                .setColor('Red')
                .setTitle('😠 You dont have an account! Try the `/create` command to make one!')
                return interaction.reply({embeds: [accountExistsEmbed]});
            }
        }

        userProfile = await UserProfile.findOne({userId: trades.tradePartnerId});
        if(!userProfile){
            
            const accountExistsEmbed = new EmbedBuilder()
                .setColor('Red')
                .setTitle('😠 Your trade partner doesnt have an account! Try the `/create` command to make one!')
            return interaction.reply({embeds: [accountExistsEmbed]});
            
        }
        let inventory = await Inventory.findOne({userId: interaction.member.id});
        if(!inventory){
            
            const accountExistsEmbed = new EmbedBuilder()
                .setColor('Red')
                .setTitle('😠 Your trade partner doesnt have an account/inventory! Try the `/create` command to make one!')
            return interaction.reply({embeds: [accountExistsEmbed]});
            
        }
        userProfile = await UserProfile.findOne({userId: trades.userId});

        inventory.slaves.push(trades.slaveToTrade);
        inventory.buyPrice.push(trades.tradePrice);
        userProfile.balance -= trades.tradePrice;
        userProfile.save();
        inventory.save();

        userProfile = await UserProfile.findOne({userId: trades.tradePartnerId});
        userProfile.balance += trades.tradePrice;
        inventory = await Inventory.findOne({userId: trades.tradePartnerId});
        inventory.slaves.splice(trades.slaveToTrade, 1);
        slaveToTradePos = inventory.slaves.indexOf(trades.slaveToTrade);
        inventory.buyPrice.splice(slaveToTradePos, 1);

        userProfile.save();
        inventory.save();


        trades.tradeActive = false;
        trades.save();
        const tradeSucessEmbed = new EmbedBuilder()
            .setColor('Aqua')
            .setTitle('🤝 Trade Sucessful!')
            .addFields(
                {name: ' ', value:`You got **${trades.slaveToTrade}** by giving <@${trades.tradePartnerId}> **${trades.tradePrice}** 🥜`}
            )


        return interaction.reply({embeds: [tradeSucessEmbed]});


        
    }
}