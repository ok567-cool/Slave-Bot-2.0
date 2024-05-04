const { SlashCommandBuilder }          = require('discord.js');
const { EmbedBuilder }                 = require('discord.js');
const { ApplicationCommandOptionType } = require('discord.js');

const UserProfile = require('../schemas/UserProfile');
const Market      = require('../schemas/MarketplaceSchema');
const Cooldown    = require('../schemas/cooldownSchema');
const Inventory   = require('../schemas/Inventory');
const Trades      = require('../schemas/Trades');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('trade')
        .setDescription('Trade a slave you own with someone else at your own price'),
        options:[
            {
                name:'tradepartner',
                description:'Who do you want to trade with',
                type:ApplicationCommandOptionType.User,
                required:true,
            },
            {
                name:'slave',
                description:'The slave you want to give',
                type:ApplicationCommandOptionType.String,
                required:true,
            },
            {
                name:'price',
                description:'The ammount of nuts you want for this slave',
                type:ApplicationCommandOptionType.Number,
                required: true,
            }

        ],
    run: async({interaction}) => {
        const sucessEmbed = new EmbedBuilder()
                    .setColor('DarkRed')
                    .setTitle('🔨 This command has been shifted to the `/slavetrade` command!')
        return interaction.reply({embeds: [sucessEmbed]});
    
    }

}
