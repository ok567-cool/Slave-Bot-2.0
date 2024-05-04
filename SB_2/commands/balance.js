const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { ApplicationCommandOptionType } = require('discord.js');
const UserProfile = require('../schemas/UserProfile');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Shows you your account balance'),
        options:[
            {
                name: 'user',
                description: 'User you want to check the balance of',
                type: ApplicationCommandOptionType.User,
            }
        ], 
    run: async({interaction}) => {

        const targetUserId = interaction.options.getUser('user')?.id || interaction.user.id;
        const targetUserName = interaction.options.getUser('user')?.displayName || interaction.user.displayName;

        try {
            let userProfile = await UserProfile.findOne({ userId: targetUserId });
            if(!userProfile){
                const accountExistsEmbed = new EmbedBuilder()
                .setColor('Red')
                .setTitle('😠 The selected user doesnt have an account! Try the `/create` command to make one!')
                return interaction.reply({embeds: [accountExistsEmbed]});
            }
            
            targetUserId === interaction.user.id? balanceEmbed = new EmbedBuilder().setColor('Gold').setTitle(`💳 Your balance is **${userProfile.balance}** Peanuts 🥜`) : balanceEmbed = new EmbedBuilder().setColor('Gold').setTitle(`💳 ${targetUserName}'s Balance is ${userProfile.balance} Peanuts :peanuts:`)
            
            interaction.reply(
                targetUserId === interaction.user.id? {embeds: [balanceEmbed]} : {embeds: [balanceEmbed]} 
            )
        }catch (error) {
            console.log(`Error handling /balance ${error}`)
        }
    }
}