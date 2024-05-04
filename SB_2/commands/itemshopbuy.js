const { SlashCommandBuilder , EmbedBuilder, ApplicationCommandOptionType, ApplicationCommand } = require('discord.js');

const UserProfile                      = require('../schemas/UserProfile');
const Inventory                        = require('../schemas/Inventory');
const market                           = require('../schemas/MarketplaceSchema');
const MarketplaceSchema                = require('../schemas/MarketplaceSchema');
const ISinventory                      = require('../schemas/itemshopInventory');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('itembuy')
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
        const shiftEmbed = new EmbedBuilder()
            .setColor('DarkRed')
            .setTitle('🤕 This command has been shifted to the `/buyitem` command!')
        return interaction.reply({embeds: [shiftEmbed]});
    }
    
    
}
