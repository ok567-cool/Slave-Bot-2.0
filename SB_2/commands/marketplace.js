const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { ApplicationCommandOptionType } = require('discord.js');

const UserProfile = require('../schemas/UserProfile');
const Marketplace = require('../schemas/MarketplaceSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('marketplace')
        .setDescription('Shows you the slave market'), 
    run: async({interaction}) => {
        let slaves   = ['Jamol', 'Tyrone', 'Zoey', 'Ahmed Jamol', 'Saffi', 'Darksy', 'Dmaann', 'Dmann Super Sayan', 'Primz S-Mod AK', 'The Rock', 'Herculies', 'Goku', 'Xiao', 'BukhariGameplay', 'Khudabakhsh', 'Bronny James', 'Terrel', 'Usain Bolt', 'Lil Nas X', 'Snoopy', 'IShowSpeed', 'Shaunie', 'Grown Up Saffi', 'Rub', 'Femboy Arc Rub', 'George', 'Andrew', 'Willy', 'Kumail Ansari']
        let prices   = [350, 800, 300, 600, 8000, 18000, 1000, 5000, 80000, 4000, 100000, 150000, 700, 12000, 900, 5000, 600, 12000, 1800, 6000, 6000, 30000, 20000, 12000, 21000, 30000, 400, 900, 300, 1000000000]
        let emojis   = ['👨🏿', '👨🏿‍🦰', '👩🏿', '🧔🏿‍♂️', '👶🏿', '🤡', '🤦🏿‍♂️', '🧚🏿‍♂️', '🏳️‍🌈', '🪨', '🦁', '💪🏿', '👲🏿', '👨🏿‍🎤', '👨🏿‍🦰', '⛹🏿', '👨🏿‍🦳', '🏃🏿‍♂️', '👨🏿‍🎤', '🐶', '🐒', '<a:sheep_:1152911335689031680>','🧔🏿‍♂️', '💏' , '👧🏿', '🐒', '👱🏿‍♂️', '🤓', '👲🏻']
        let rarities = ['❤️ Common', '💚 Uncommon', '❤️ Common', '💚 Uncommon', '💙 Rare', '💜 Legendary', '🧡 Hard to find', '🧡 Hard to find', '🤍 Immortal', '💙 Rare', '🤍 Immortal', '💖 Godly', '💚 Uncommon', '💜 Legendary', '🧡 Hard to find', '💙 Rare', '💙 Rare', '💜 Legendary', '🤮', '🧡 Hard to find', '🧡 Hard to find' ,'💜 Legendary', '💜 Legendary', '💜 Legendary', '💗 Kawai', '❤️ Common',  '💚 Uncommon', '❤️ Common', '💗 Kawai']

        var refreshText='⚠️ You can use `/refreshmarket` \nto check new prices every 5 minutes';

        let marketplace = await Marketplace.findOne({guildId: '0000'});

        if(marketplace.marketplaceChangeDate.toDateString() == new Date().toDateString()){
            var nameText  = '';
            var priceText = '';
            var emojiText = '';
            var rarityText= '';

            for (let i=0;i<marketplace.finalArr.length;i++){
                nameText  += `${marketplace.finalEmojis[i]} ${marketplace.finalArr[i]}\n`
                priceText += `${marketplace.finalPrices[i]} 🥜\n`
                rarityText+= `${marketplace.finalRarities[i]}\n`
            }

            const marketplaceEmbed = new EmbedBuilder()
                .setTitle("Today's Slave Market")
                .setColor('Aqua')
                .setDescription('🛒🛒🛒')
                .addFields(
                    {name:' ', value:`**${nameText}**`, inline:true},
                    {name:' ', value:`${priceText}`, inline:true},
                    {name:' ', value:`${rarityText}`, inline:true},
                    {name:' ', value:`${refreshText}`}

                )
                .setFooter({text:'New slaves are added every 24 hours \nwith upto a 100+ slaves \navailable!\n'})
                .setTimestamp()
            
            return interaction.reply({embeds: [marketplaceEmbed]})
        }

        let finalArr   =[];
        let finalPrices=[];
        let finalEmojis=[];
        let finalRarities =[];
        let randI;
        let sLength = slaves.length;
        let canPush = true;

        if(finalArr < 10){
            for(let i=0;i<slaves.length;i++){
            
                randI = Math.floor(Math.random() * sLength)
                
                
                for(let j=0;j<finalArr.length;j++){
                    if(finalArr[j] == slaves[randI]){
                        canPush = false
                    }
            
            
                }
                
                if(canPush && finalArr.length !=20){
                    finalArr.push(slaves[randI]);
                    finalPrices.push(prices[randI]);
                    finalEmojis.push(emojis[randI]);
                    finalRarities.push(rarities[randI]);
                    canPush = true;
                }
                    
            }  
            
            
            
            }
            marketplace.ogPrices    = finalPrices;
            
            for(let i=0;i<finalArr.length;i++){
                if(finalPrices[i] >= 1000 && finalPrices[i] < 5000){
                    finalPrices[i] += Math.floor(Math.random() * 1001);
                }
                else if(finalPrices[i] >= 5000 && finalPrices[i] < 15000){
                    finalPrices[i] += Math.floor(Math.random() * 5001);
                }
                else{
                    finalPrices[i] += Math.floor(Math.random() * 501);
                }
            }


            marketplace.finalArr    = finalArr;
            marketplace.finalPrices = finalPrices;
            marketplace.finalEmojis = finalEmojis;
            marketplace.finalRarities = finalRarities;
            marketplace.marketplaceChangeDate = new Date();

            marketplace.save();

            var nameText = '';
            var priceText= '';
            var rarityText='';//
            

            for (let i=0;i<finalArr.length;i++){
                nameText  += `${marketplace.finalEmojis[i]} ${marketplace.finalArr[i]}\n`
                priceText += `${marketplace.finalPrices[i]} 🥜\n`
                rarityText+= `${marketplace.finalRarities[i]}\n`//
            }

            const marketplaceEmbed = new EmbedBuilder()
                .setTitle("Today's Slave Market")
                .setColor('Aqua')
                .setDescription('🛒🛒🛒')
                .addFields(
                    {name:' ', value:`**${nameText}**`, inline:true},
                    {name:' ', value:`${priceText}`, inline:true},
                    {name:' ', value:`${rarityText}`, inline:true},//
                    {name:' ', value:`${refreshText}`}
                    

                )
                .setFooter({text:'New slaves are added every 24 hours \nwith upto a 100+ slaves \navailable!\n'})
                .setTimestamp()
            
            return interaction.reply({embeds: [marketplaceEmbed]})
        }
}