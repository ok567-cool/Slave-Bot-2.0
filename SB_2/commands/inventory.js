const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { ApplicationCommandOptionType } = require('discord.js');

const UserProfile = require('../schemas/UserProfile');
const Inventory = require('../schemas/Inventory');
const Market = require('../schemas/MarketplaceSchema');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('inventory')
        .setDescription('Check your inventory'),
        options:[
            {
                name: 'user',
                description: 'The user you want to check the inventory of',
                type: ApplicationCommandOptionType.User,
            },
        ], 
    run: async({interaction}) => {
            const targetUserId = interaction.options.getUser('user')?.id || interaction.user.id;
            const targetUserName = interaction.options.getUser('user')?.displayName || interaction.user.displayName;

            let inventory = await Inventory.findOne({userId: targetUserId});
            if(!inventory){
                const accountExistsEmbed = new EmbedBuilder()
                .setColor('Red')
                .setTitle('😠 The selected user doesnt have an account! Try the `/create` command to make one!')
                return interaction.reply({embeds: [accountExistsEmbed]});
            }

            let inventoryItems  = '';
            let inventoryPrices = '';

            if(inventory.slaves.length == 0){
                const balanceEmbed = new EmbedBuilder().setColor('Gold').setTitle(`🎒 Your inventory`).addFields({name:' ', value:'😔 Looks like your inventory is empty!', inline:true,})
                const UbalanceEmbed = new EmbedBuilder().setColor('Gold').setTitle(`🎒 ${targetUserName} inventory`).addFields({name:' ', value:"😔 Looks like this user's inventory is empty!", inline:true,})
                targetUserId === interaction.user.id? interaction.reply({embeds: [balanceEmbed]}) : interaction.reply({embeds: [UbalanceEmbed]}) 
                
                return;
            }
            for(let i=0;i<inventory.slaves.length;i++){
                inventoryItems += `${inventory.slaves[i]}\n`
                inventoryPrices += `**Bought for** **${inventory.buyPrice[i]}** 🥜\n`
            }

            targetUserId === interaction.user.id? balanceEmbed = new EmbedBuilder().setColor('Gold').setTitle(`🎒 Your inventory`).addFields({name:' ', value:`${inventoryItems}`, inline:true,}, {name:' ', value:`${inventoryPrices}`, inline:true} ) : balanceEmbed = new EmbedBuilder().setColor('Gold').setTitle(`🎒 ${targetUserName}'s inventory`).addFields({name:' ', value:`${inventoryItems}`, inline:true}, {name:' ', value:`${inventoryPrices}`, inline: true} )
            interaction.reply(
                targetUserId === interaction.user.id? {embeds: [balanceEmbed]} : {embeds: [balanceEmbed]} 
            )
        }
        
    }
