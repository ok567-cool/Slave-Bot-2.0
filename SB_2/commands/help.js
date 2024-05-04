const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { ApplicationCommandOptionType } = require('discord.js');
const UserProfile = require('../schemas/UserProfile');
const Market = require('../schemas/MarketplaceSchema');
const Cooldown = require('../schemas/cooldownSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Shows you the help menu'),
    run: async({interaction}) => {
        const helpMenuEmbed = new EmbedBuilder()
            .setColor('Blue')
            .setTitle('Help Menu')
            .addFields(
                {name:'This bot is currently in beta with more features from the old bot being migrated here but it still has the core functionality of the original Slave Trade bot', value: 'Bot made by `abdudesu` AKA `Abdツ`'},

                {name: '⌨️ Commands', value:' '},
                {name: '🤑 `/create`', value:'Makes you an account'},

                {name:'🛍️ `/marketplace`', value:'Shows you the current marketplace'},
                {name:'☀️ `/daily`', value:'Gives you your daily ammount of peanuts'},
                {name:'💰 `/balance`', value:'Shows you your account balance'},
                {name: '🎒 `/inventory`', value:'Shows you your inventory where all your slaves are stored'},
                {name:'🛒 `/buy`', value:'Buys a slave of your choice from the marketplace\n\nTwo arguments `slave` (the slave you want to buy), `ammount` (the ammount of slaves you want to buy)'},
                {name:'🤝 `/sell`', value:'Sells a slave of your choice to the marketplace\n\nTwo arguments `slave` (the slave you want to sell), `ammount` (the ammount of slaves you want to sell)'},

                {name:'📨 `/slaveTrade`', value:'Trades a slave of your choice with any other user\n\nTwo arguments `tradepartner` (the user you want to trade with), `price` (the ammount of peanuts you want for that slave)'},
                {name:'🤝 `/tradeaccept`', value:'Accepts any active trade request'},
                {name:'❌ `/tradereject`', value:'Rejects any active trade request'},
                {name:'🎁 `/give`', value:'Give someone peanuts'},

                {name: '🔄️ `/refreshmarket`', value:'Refreshes the marketplace prices to show you new rates'},

                {name: '💸 `/beg`', value:'Beg for money'},

                {name: '🛒 `/itemshop`', value:'Shows you the itemshop from where you can buy cotton bags, whips and prestige points'},
                {name: '🤝 `/buyitem`', value:'Buy an item from the itemshop'},

                {name: '<:whip_crack12:1152471741201920000> `/whip`', value:'Whip a slave you own for xp'},
                {name: '<:cotton:1152886426493538435> `/cottonpick', value:'Make a slave you own pick cotton for you for xp'},
                {name: '🛡️  `/rank`', value:"Check yours or someone else's rank and XP,  two options available \n\n1. `selfrank` Allows you to check the rank and Xp of a user including yourself \n\n2. `rankinfo` Shows you all the available ranks and the xp required to get them"},
            )

            return interaction.reply({embeds: [helpMenuEmbed]})
    }
}