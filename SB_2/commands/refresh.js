const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { ApplicationCommandOptionType } = require('discord.js');
const UserProfile = require('../schemas/UserProfile');
const Market = require('../schemas/MarketplaceSchema');
const Cooldown = require('../schemas/cooldownSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('refreshmarket')
        .setDescription('Shows you new slave prices'),
    run: async({interaction}) => {
        const userId = interaction.user.id;
        const commandName = interaction.commandName;            
        let cooldown = await Cooldown.findOne({userId, commandName});
        

        if(cooldown && Date.now() < cooldown.endsat){
            const { default : prettyMs } = await import('pretty-ms');
            const marketplaceEmbed = new EmbedBuilder()
                .setTitle(`⏳ You are on cooldown try again after ${prettyMs(cooldown.endsat - Date.now())}!`)
                .setColor('DarkVividPink')
            await interaction.reply(
                {embeds: [marketplaceEmbed]}
            );
            return;
        }
        
        
        
        var refreshText='⚠️ You can use `/refreshmarket` \nto check new prices every 5 minutes';
        market = await Market.findOne({guildId:'0000'});
        let ogPrices = market.ogPrices;

        for(let i=0;i<market.ogPrices.length;i++){
            if(ogPrices[i] >= 1000 && ogPrices[i] < 5000){
                ogPrices[i] += Math.floor(Math.random() * 1001);
            }
            else if(ogPrices[i] >= 5000 && ogPrices[i] < 15000){
                ogPrices[i] += Math.floor(Math.random() * 5001);
            }
            else{
                ogPrices[i] += Math.floor(Math.random() * 501);
            }
        }
        console.log(market.ogPrices)
        market.finalPrices = ogPrices;

        market.save();

        var nameText = '';
        var priceText= '';
        var emojiText= '';
        var finalRarities = '';

            

        for (let i=0;i<market.finalArr.length;i++){
            nameText += `${market.finalEmojis[i]} ${market.finalArr[i]}\n`
            priceText+= `${market.finalPrices[i]} 🥜\n`
            finalRarities += `${market.finalRarities[i]}\n`
        }
        const marketplaceEmbed = new EmbedBuilder()
                .setTitle("Today's Slave Market")
                .setColor('Aqua')
                .setDescription('🛒🛒🛒')
                .addFields(
                    {name:' ', value:`Today's slave market`,},
                    {name:' ', value:`**${nameText}**`, inline:true},
                    {name:' ', value:`${priceText}`, inline:true},
                    {name:' ', value:`${finalRarities}`, inline:true},
                    {name:' ', value:`${refreshText}`}

                )
                .setFooter({text:'New slaves are added every 24 hours \nwith upto a 100+ slaves \navailable!\n'})
                .setTimestamp()
        if(!cooldown){
            cooldown = new Cooldown({ userId, commandName })
        }
        cooldown.endsat = Date.now() + 300_000
        cooldown.save();
            
        return interaction.reply({embeds: [marketplaceEmbed]});



        
    }
}