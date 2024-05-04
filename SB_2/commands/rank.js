const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { ApplicationCommandOptionType } = require('discord.js');
const UserProfile = require('../schemas/UserProfile');
const Inventory = require('../schemas/Inventory');
const market = require('../schemas/MarketplaceSchema');
const MarketplaceSchema = require('../schemas/MarketplaceSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription("Check yours or someone else's rank"),
        options:[
            {
                name:'options',
                description:'options',
                type:ApplicationCommandOptionType.String,
                choices:[
                    {
                        name:'selfrank',
                        value:'selfrank',
                    },
                    {
                        name:'rankinfo',
                        value:'rankinfo',
                    }
                ],
                required:true,
            },
            {
                name: 'user',
                description: 'The user you want to check the rank of',
                type: ApplicationCommandOptionType.User,
            },
        ], 
    run: async({interaction}) => {
            const rankData = {
                ranks:['Beginner', 'Experienced', 'Cotton farm owner', 'Arab Slave owner', 'Saffi', 'Legendary Slave owner', 'Godly slave owner', 'Bring back slavery activist', 'King', 'Rub (low tier)', 'Rub (mid tier)', 'nice.', 'Rub (high tier)', 'Abdu (low tier)', 'Abdu (mid tier)', 'Abdu (high tier)', 'No lifer'],
                rankEmojis:['🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '🛞', '🪧','👑',':flag_sa:', ':flag_ne:', '👍🏿', ':flag_pk:', '🙈', '🙊', '🙉', '🧟'],
                rankTargetXp:[0,50,100,150,200,250,300,350,400,450,500,550,600, 650, 700, 750, 800],
            }

            const targetUserId = interaction.options.getUser('user')?.id || interaction.user.id;
            const targetUserName = interaction.options.getUser('user')?.displayName || interaction.user.displayName;

            const optionsChoice = interaction.options.get('options').value;

            let userProfile = await UserProfile.findOne({userId: targetUserId});
            if(!userProfile){
                const accountExistsEmbed = new EmbedBuilder()
                    .setColor('Red')
                    .setTitle('😠 The selected user doesnt have an account! Try the `/create` command to make one!')
                return interaction.reply({embeds: [accountExistsEmbed]});
            }

            let userRank;
            let userRxp;
            let progressBarText = ' ';
            let bProgressBarText = ' ';

            if(optionsChoice == 'selfrank'){
                for(let i = 0; i < rankData.ranks.length; i++){
                    if(userProfile.rank == rankData.ranks[i]){
                        if(userProfile.rankXp >= rankData.rankTargetXp[i+1]){
                            userProfile.rank = rankData.ranks[i+1]
                        
                        }
                    
                            
                    }
                }


                for(let i = 0; i < rankData.ranks.length; i++){
                    if(userProfile.rank == rankData.ranks[i]){
    
                        userRank = userProfile.rank;
                        userRxp  = userProfile.rankXp;
                    
    
                        userRxpLeft = userRxp - rankData.rankTargetXp[i];
                        userX = Math.round((userRxpLeft * 10) / 50);
    
                        for(let j = 0; j<userX; j++){
                            progressBarText += ("🟩")
                        }
                        for(let j = 0; j<(10-userX); j++){
                            bProgressBarText += ("⬛")
                        }
    
                        const rankShowEmbed = new EmbedBuilder()
                            .setColor('White')
                            .setTitle(`${rankData.rankEmojis[i]} Your rank is ${userRank}`)
                            .addFields(
                                {name:' ', value:`**${userProfile.rankXp}** 🍌    Next rank ${rankData.rankEmojis[i+1]} **${rankData.ranks[i+1]}**`},
                                {name:' ', value:`${progressBarText}${bProgressBarText}`}
                            
                            )
                        
                        const U_rankShowEmbed = new EmbedBuilder()
                            .setColor('White')
                            .setTitle(`${rankData.rankEmojis[i]} ${targetUserName}'s rank is ${userRank}`)
                            .addFields(
                                {name:' ', value:`**${userProfile.rankXp}** 🍌    Next rank ${rankData.rankEmojis[i+1]} **${rankData.ranks[i+1]}**`},
                                {name:' ', value:`${progressBarText}${bProgressBarText}`}
                        )
                        
                        
                        targetUserId === interaction.member.id? interaction.reply({embeds: [rankShowEmbed]}) : interaction.reply({embeds: [U_rankShowEmbed]})
                        return;
                            
                    }
                }
            }

            
        
            if(optionsChoice == 'rankinfo'){
                rankT = '';
                rankTargetXpT = '';

                for(let i = 0; i<rankData.ranks.length; i++){
                    rankT += `${rankData.rankEmojis[i]} **${rankData.ranks[i]}**\n`
                    rankTargetXpT += `**${rankData.rankTargetXp[i]}** 🍌\n`
                }
 
                const rankInfoEmbed = new EmbedBuilder()
                    .setColor('Blue')
                    .setTitle('⚔️ Ranks')
                    .addFields(
                        {name:' ', value:`**RANK**`, inline:true},
                        {name:' ', value: `**XP REQUIRED**`,inline:true},
                        {name:' ', value: ` `},
                        {name:' ', value:`${rankT}`, inline:true},
                        {name:' ', value: `${rankTargetXpT}`,inline:true}
                    )

                    return interaction.reply({embeds: [rankInfoEmbed]});
            }
        }
        
    }
