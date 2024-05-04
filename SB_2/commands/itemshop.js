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
        .setName('itemshop')
        .setDescription('Shows you the itemshop'),
    run: async({interaction}) => {
        const store = {
            whips: ['Beginer Level Whip [BLW]', 'Bronze Whip [BW]', 'Intermediate Level Whip [ILW]', 'Blue Dragon Hide Whip [BDHW]', 'Red Dragon Hide Whip [RDHW]', 'White Dragon Hide Whip [WDHW]', "Goku's balls [DB]", "Zone's Whip [ZW]"],
            wShortName:['BLW', 'BW', 'ILW', 'BDHW', 'RDHW', 'WDHW', 'GB', 'ZW'],
            wPrices:[2000, 3000, 6000, 10000, 15000, 25000, 35000, 50000],
            wXpText:[1,2,3,4,5,6,7,8],

            prestigePoints: [1, 10,25],
            pPrices:[2000, 15000, 40000],

            cottonBags:["Basic Cotton Bag [BCB]", "Intermediate Cotton Bag [ICB]", "Semi Advanced Cotton Bag [SACB]", "Advanced Cotton Bag [ACB]"],
            cPrices:[2000, 10000, 30000, 50000],
            cShortName:['BCB', 'ICB', 'SACB', 'ACB'],
            cXpText:[1,3,9,12],
        }

        let whipText = '';
        let wShortNameText = '';
        let wPricesText = '';
        let wXpText = '';

        let ppText = '';
        let pPrices = '';

        let cBagsText = '';
        let cPricesText = '';
        let cShortName = '';
        let cXpText = '';

        for(let i=0; i<store.whips.length;i++){
            whipText += `<:whip_crack12:1152471741201920000> **${store.whips[i]}**\n`;
            wShortNameText += `**${store.wShortName[i]}**\n`;
            wPricesText += `**${store.wPrices[i]}** 🥜\n`;
            wXpText += `**x${store.wXpText[i]}** Xp gain\n`;
        }

        for(let i=0; i<store.prestigePoints.length;i++){
            ppText += `✨ **${store.prestigePoints[i]}**\n`;
            pPrices += `**${store.pPrices[i]}** 🥜\n`;
        }

        for(let i=0; i<store.cottonBags.length;i++){
            cBagsText += `<:bag:1152472463091970108> **${store.cottonBags[i]}**\n`;
            cPricesText += `**${store.cPrices[i]}**\n`;
            cShortName += `**${store.cShortName[i]}**\n`;
            cXpText += `**x${store.cXpText[i]}** Xp gain\n`;
        }

        const itemshopEmbed = new EmbedBuilder()
            .setColor('DarkAqua')
            .setTitle('🛒 Item Shop')
            .addFields(
                {name: 'Whips', value:' '},
                {name: ' ', value:`${whipText}`, inline:true},
                {name: ' ', value:`${wShortNameText}`, inline:true},
                {name: ' ', value:`${wPricesText}`, inline:true},
                {name: ' ', value:`**x1 Extra Xp Gain With Each Whip Upgrade**`, inline:true},

                {name:'Prestige Points', value:' '},
                {name: ' ', value:`${ppText}`, inline:true},
                {name: ' ', value:`${pPrices}`, inline:true},

                {name: 'Cotton Bags', value:' '},
                {name: ' ', value:`${cBagsText}`, inline:true},
                {name: ' ', value:`${cShortName}`, inline:true},
                {name: ' ', value:`${cPricesText}`, inline:true},
                {name: ' ', value:`**x3 Extra Xp Gain With Each Cotton Bag Upgrade**`, inline:true},
                

            )
            .setFooter({text: '⚠️ Use the `/itembuy <ITEM TYPE> <ITEMSHORTNAME>` command to buy something from the itemshop'})
            .setTimestamp()

            return interaction.reply({embeds: [itemshopEmbed]})


    }
}


