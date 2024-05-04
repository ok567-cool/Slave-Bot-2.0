const { SlashCommandBuilder , EmbedBuilder, ApplicationCommandOptionType, ApplicationCommand } = require('discord.js');

const UserProfile                      = require('../schemas/UserProfile');
const Inventory                        = require('../schemas/Inventory');
const market                           = require('../schemas/MarketplaceSchema');
const MarketplaceSchema                = require('../schemas/MarketplaceSchema');
const ISinventory                      = require('../schemas/itemshopInventory');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('buyitem')
        .setDescription('Buy a something from the itemshop'),
        options:[
            {
                name:'itemtype',
                description:'The type of item you want to buy',
                type:ApplicationCommandOptionType.String,   
                required:true, 

                choices:[
                    {
                        name:'Cotton Bag',
                        value:'Cotton Bag'
                    },
                    {
                        name:'Whip',
                        value:'Whip',
                    },
                    {
                        name:'Prestige Points',
                        value:'Prestige Points',
                    }
                ],


            },
            {
                name:'itemshortname',
                description:'The shortname of the item you want to buy eg. BW or WDHW',
                type:ApplicationCommandOptionType.String,
                required:true,
            }
        ],
        
    run: async({interaction}) => {
        const userProfile = await UserProfile.findOne({userId: interaction.member.id});
        const inventory   = await Inventory.findOne({userId: interaction.member.id});
        const isInventory = await ISinventory.findOne({userId: interaction.member.id});

        if(!userProfile || !inventory){
            const accountExistsEmbed = new EmbedBuilder()
                .setColor('Red')
                .setTitle('😠 You dont have an account! Try the `/create` command to make one!')
            return interaction.reply({embed: [accountExistsEmbed]});    
        }
        
        
        const itemType      = interaction.options.get('itemtype').value;
        const itemShortName = interaction.options.get('itemshortname').value;

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

        if(itemType == 'Cotton Bag'){
            for(let i=0; i<store.cottonBags.length;i++){
                if(itemShortName == store.cShortName[i]){
                    isInventory.cBag = store.cottonBags[i];
                    isInventory.cBagXpGain = store.cXpText[i];
                    userProfile.balance -= store.cPrices[i];
                    isInventory.save();
                    userProfile.save();

                    const itemPurchasedEmbed = new EmbedBuilder()
                        .setColor('Green')
                        .setTitle(`🛍️ You bought **${store.cottonBags[i]}** for **${store.cPrices[i]}** 🥜`)
                    return interaction.reply({embeds: [itemPurchasedEmbed]});
                }
            }

            const notValidSNameEmbed = new EmbedBuilder()
                .setColor('Red')
                .setTitle('😡 Not a valid Short Name for a cotton bag!')
            return interaction.reply({embeds: [notValidSNameEmbed]});

            
        }
        if (itemType == 'Whip'){
            for(let i=0; i<store.whips.length;i++){
                if(itemShortName == store.wShortName[i]){
                    isInventory.whip = store.whips[i];
                    isInventory.wXpGain = store.wXpText[i];
                    userProfile.balance -= store.wPrices[i];
                    userProfile.save();
                    isInventory.save();

                    const itemPurchasedEmbed = new EmbedBuilder()
                        .setColor('Green')
                        .setTitle(`🛍️ You bought **${store.whips[i]}** for **${store.wPrices[i]}** 🥜`)
                    return interaction.reply({embeds: [itemPurchasedEmbed]});
                }
            }

            const notValidSNameEmbed = new EmbedBuilder()
                .setColor('Red')
                .setTitle('😡 Not a valid Short Name for a whip!')
            return interaction.reply({embeds: [notValidSNameEmbed]});
        }
        if(itemType == 'Prestige Points'){
            for(let i=0; i<store.prestigePoints.length;i++){
                if(itemShortName == store.prestigePoints[i].toString()){
                    isInventory.prestigePoints += store.prestigePoints[i];
                    userProfile.balance -= store.pPrices[i];
                    userProfile.save();
                    isInventory.save();

                    const itemPurchasedEmbed = new EmbedBuilder()
                        .setColor('Green')
                        .setTitle(`🛍️ You bought ✨ **${store.prestigePoints[i]}** Prestige Point(s) for **${store.pPrices[i]}** 🥜`)
                    return interaction.reply({embeds: [itemPurchasedEmbed]});
                }
            }

            const notValidSNameEmbed = new EmbedBuilder()
                .setColor('Red')
                .setTitle('😡 You can only buy **1,3,9 or 12** Prestige Points at a time!')
            return interaction.reply({embeds: [notValidSNameEmbed]});
        }
    }
        
}
