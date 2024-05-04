const { SlashCommandBuilder , EmbedBuilder, ApplicationCommandOptionType, ApplicationCommand } = require('discord.js');

const UserProfile                      = require('../schemas/UserProfile');
const Inventory                        = require('../schemas/Inventory');
const market                           = require('../schemas/MarketplaceSchema');
const MarketplaceSchema                = require('../schemas/MarketplaceSchema');
const ISinventory                      = require('../schemas/itemshopInventory');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('items')
        .setDescription('Shows you your item inventory'),
        options:[
            {
                name:'user',
                description:'The user you want to check the item inventory of',
                type: ApplicationCommandOptionType.User,
            }

        ],
        
        
    run: async({interaction}) => {
        const targetUserId = interaction.options.getUser('user')?.id || interaction.user.id;
        const targetUserName = interaction.options.getUser('user')?.displayName || interaction.user.displayName;

        let isInventory = await ISinventory.findOne({userId: targetUserId});
        if(!isInventory){
            const accountExistsEmbed = new EmbedBuilder()
                .setColor('Red')
                .setTitle('😠 The selected user doesnt have an account! Try the `/create` command to make one!')
            return interaction.reply({embeds: [accountExistsEmbed]});
        }

        const yitemInventoryEmbed = new EmbedBuilder()
            .setColor('Navy')
            .setTitle('🎒 Your item inventory')
            .addFields(
                {name: '<:bag:1152472463091970108> Cotton Bag', value:`${isInventory.cBag}`},
                {name: '<:whip_crack12:1152471741201920000> Whip', value:`${isInventory.whip}`},

            )

        const titemInventoryEmbed = new EmbedBuilder()
            .setColor('Navy')
            .setTitle(`🎒 ${targetUserName}'s item inventory`)
            .addFields(
                {name: '<:bag:1152472463091970108> Cotton Bag', value:`${isInventory.cBag}`},
                {name: '<:whip_crack12:1152471741201920000> Whip', value:`${isInventory.whip}`},

            )

            targetUserId === interaction.member.id? interaction.reply({embeds: [yitemInventoryEmbed]}) : interaction.reply({embeds: [titemInventoryEmbed]})
            return;
            

        
    }
        
}
