const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { ApplicationCommandOptionType } = require('discord.js');

const UserProfile = require('../schemas/UserProfile');
const Market = require('../schemas/MarketplaceSchema');
const Cooldown = require('../schemas/cooldownSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('givenuts')
        .setDescription('Share your nuts with someone else'),
        options:[
            {
                name:'tradepartner',
                description:'Who do you want to trade with',
                type:ApplicationCommandOptionType.User,
                required:true,
            },
            {
                name:'ammount',
                description:'The ammount of nuts you want to give',
                type:ApplicationCommandOptionType.Number,
                required:true,
            }

        ],
    run: async({interaction}) => {
        const sucessEmbed = new EmbedBuilder()
                    .setColor('DarkRed')
                    .setTitle('🔨 This command has been shifted to the `/give` command!')
        return interaction.reply({embeds: [sucessEmbed]});

    }
}