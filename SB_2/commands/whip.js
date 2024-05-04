const { SlashCommandBuilder , EmbedBuilder, ApplicationCommandOptionType, ApplicationCommand } = require('discord.js');

const UserProfile                      = require('../schemas/UserProfile');
const Inventory                        = require('../schemas/Inventory');
const market                           = require('../schemas/MarketplaceSchema');
const MarketplaceSchema                = require('../schemas/MarketplaceSchema');
const ISinventory                      = require('../schemas/itemshopInventory');
const Cooldown                         = require('../schemas/cooldownSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('whip')
        .setDescription('Whip a slave you own for xp'),
        options:[
            {
                name:'slave',
                description:'The slave you want to whip',
                type:ApplicationCommandOptionType.String,
                required: true,
            }
        ],
        
        
    run: async({interaction}) => {

        const commandName = 'whip';
        const userId      = interaction.member.id;

        let userProfile = await UserProfile.findOne({userId: interaction.member.id});
        let inventory   = await Inventory.findOne({userId: interaction.member.id});
        let isInventory = await ISinventory.findOne({userId: interaction.member.id});
        let cooldown = await Cooldown.findOne({userId, commandName});

        

        if(cooldown && Date.now() < cooldown.endsat){
            const { default : prettyMs } = await import('pretty-ms');

            const onCooldownEmbed = new EmbedBuilder()
                .setColor('Red')
                .setTitle(`⏲️ You are on cool down try again after ${prettyMs(cooldown.endsat - Date.now())} :timer: !`)
            await interaction.reply(
                {embeds: [onCooldownEmbed]}
            );
            return;
        }


        if(!cooldown){
            cooldown = new Cooldown({ userId, commandName })

        }

        if(!userProfile || !inventory){
            const accountExistsEmbed = new EmbedBuilder()
                .setColor('Red')
                .setTitle('😠 The selected user doesnt have an account! Try the `/create` command to make one!')
            return interaction.reply({embeds: [accountExistsEmbed]});
        }

        let defaultXpGain = 5;
        const targetSlave = interaction.options.get('slave').value;

        if(isInventory.whip == 'None'){
            const whipEmbed = new EmbedBuilder()
                    .setColor('DarkRed')
                    .setTitle(`🤕 You down own a whip, however you can buy one from the store!`)

            return interaction.reply({embeds: [whipEmbed]});
        }

        for(let i=0;i<inventory.slaves.length; i++){
            if(targetSlave == inventory.slaves[i]){
                defaultXpGain *= isInventory.wXpGain;
                randXp = Math.round(Math.floor(Math.random() * defaultXpGain));
                
                userProfile.rankXp += randXp;
                userProfile.save();

                cooldown.endsat = Date.now() + 300_000;
                cooldown.save();
                const whipEmbed = new EmbedBuilder()
                    .setColor('DarkGold')
                    .setTitle(`<:whip_crack12:1152471741201920000> You whipped ${targetSlave}`)
                    .setDescription(`+${randXp} 🍌`);

                return interaction.reply({embeds: [whipEmbed]});

            }
        }

        const whipEmbed = new EmbedBuilder()
                .setColor('Red')
                .setTitle(`🤕 Could not find '${targetSlave}' in your inventory!`)


        return interaction.reply({embeds: [whipEmbed]});



    }
        
}
