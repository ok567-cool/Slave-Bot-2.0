const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const UserProfile = require('../schemas/UserProfile');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('Collect your daily peanuts'),
    run: async({interaction}) => {
        let userProfile = await UserProfile.findOne({userId: interaction.member.id});
        if(!userProfile) return interaction.reply('😖 __No account found! Try and use `/create` to make a new one!__');

        let defaultDailyValue = 1000;
        let currentDate   = new Date().toDateString();
        let lastDailyDate = userProfile.lastDailyCollected?.toDateString();

        if(currentDate == lastDailyDate){
            const dailyAlreadyCollectedEmbed = new EmbedBuilder()
                .setColor('Red')
                .setTitle('😠 You have already collected your daily peanuts 🥜 for today!')
            return interaction.reply({embeds: [dailyAlreadyCollectedEmbed]})
        }

        if(Date.now() - userProfile.lastDailyCollected < 1.728e+8 && userProfile.defaultDailyValue != 7){
            userProfile.defaultDailyValue += 1;
        }else if(Date.now() - userProfile.lastDailyCollected > 1.728e+8){
            userProfile.defaultDailyValue = 1;
        }


        defaultDailyValue = defaultDailyValue * userProfile.dailyMultiplier;
        userProfile.balance += defaultDailyValue;
        userProfile.lastDailyCollected = new Date();
        userProfile.save();
        const dailyAlreadyCollectedEmbed = new EmbedBuilder()
                .setColor('Green')
                .setTitle(`💰 You collected your daily ${defaultDailyValue} 🥜!`)
        return interaction.reply({embeds: [dailyAlreadyCollectedEmbed]})
    }
}