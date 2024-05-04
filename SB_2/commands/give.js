const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { ApplicationCommandOptionType } = require('discord.js');

const UserProfile = require('../schemas/UserProfile');
const Market = require('../schemas/MarketplaceSchema');
const Cooldown = require('../schemas/cooldownSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('give')
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
        
        if(!interaction.inGuild){
            interaction.reply('This command only works in servers :rage: !')
        }

        try {
            let amount = interaction.options.get('ammount');
            
            let userProfile = await UserProfile.findOne({ userId: interaction.member.id });
            userTarget = interaction.options.get('tradepartner').user.id;

            if(!userProfile){
                const accountExistsEmbed = new EmbedBuilder()
                    .setColor('Red')
                    .setTitle('😠 You dont have an account! Try the `/create` command to make one!')
                return interaction.reply({embed: [accountExistsEmbed]});    
            }

            if(userProfile.balance >= amount.value){
                 
                userProfile.balance -= amount.value
                userProfile.save();
                
                userProfile = await UserProfile.findOne({ userId: userTarget})
                userProfile.balance += amount.value
                userProfile.save();


                const sucessEmbed = new EmbedBuilder()
                    .setColor('Green')
                    .setTitle('💳 Transaction Sucessful!')
                    .addFields(
                        {name:' ', value:`You gave **${amount.value}** 🥜 to <@${userTarget}>`}
                    )
                return interaction.reply({embeds: [sucessEmbed]});

            }
            else{
                const sucessEmbed = new EmbedBuilder()
                    .setColor('Red')
                    .setTitle('🤕 Transaction Unsucessful!')
                    .addFields(
                        {name:' ', value:`You dont that much money to give!`}
                    )
                return interaction.reply({embeds: [sucessEmbed]});
            }
        } catch (error) {
            console.log(error)
        }

    }
}