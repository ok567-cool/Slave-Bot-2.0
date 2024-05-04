const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const UserProfile = require('../schemas/UserProfile');
const Inventory = require('../schemas/Inventory');
const ISinventory = require('../schemas/itemshopInventory')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create')
        .setDescription('Creates Account'),
    run: async({interaction}) => {
        let userProfile = await UserProfile.findOne({userId: interaction.member.id});

        if(!userProfile){
            userProfile = new UserProfile({userId: interaction.member.id});
            userProfile.save();
            inventory = new Inventory({userId: interaction.member.id});
            inventory.save();
            isInventory = new ISinventory({userId: interaction.member.id});
            isInventory.save();
            const accountCreateEmbed = new EmbedBuilder()
                .setColor('Green')
                .setTitle('🤑 Account created!')
                .setThumbnail(interaction.member.displayAvatarURL ({dynamic: true}))
                .addFields(
                    {name:' ', value:'You now have a place to store all of your peanuts 🥜'}
                )
            return interaction.reply({embeds: [accountCreateEmbed]});
        }else{
            const accountExistsEmbed = new EmbedBuilder()
                .setColor('Red')
                .setTitle('😡 You already have an account!')
            return interaction.reply({embeds: [accountExistsEmbed]});
        }


    }
}
