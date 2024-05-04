const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { ApplicationCommandOptionType } = require('discord.js');

const UserProfile = require('../schemas/UserProfile');
const Cooldown = require('../schemas/cooldownSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('beg')
        .setDescription('Beg for peanuts'),
    
    run: async({interaction}) => {
        if(interaction.commandName == 'beg'){
            if(!interaction.inGuild()){
                await interaction.reply("This Command only works in servers.");
                return;
            }

            try {


                const commandName = 'beg';
                const userId = interaction.user.id;
                
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

                if(!cooldown){
                    cooldown = new Cooldown({ userId, commandName })

                }
                const chance = Math.floor(Math.random() * 101)
                if(chance < 40){
                    const marketplaceEmbed = new EmbedBuilder()
                        .setTitle(`😔 You didnt get anything`)
                        .setColor('Purple')
                    await interaction.reply({embeds: [marketplaceEmbed]});

                    cooldown.endsat = Date.now() + 300_000;
                    await cooldown.save();
                    return;
                }

                const amount = Math.floor(Math.random() * 151);

                let userProfile = await UserProfile.findOne({ userId }).select('userId balance');
                if(!userProfile){
                    userProfile = new UserProfile({ userId })


                }

                userProfile.balance += amount;
                cooldown.endsat = Date.now() + 300_000

                cooldown.save();
                userProfile.save();
                
                bal = userProfile.balance;
                
                const marketplaceEmbed = new EmbedBuilder()
                        .setTitle(`💸 Some random stranger on the street gave you **${amount}** 🥜`)
                        .setColor('Green')
                await interaction.reply({embeds: [marketplaceEmbed]});
                return;
            } catch (error) {
                console.log(`Error handling /beg ${error}`)
            }
        }
    }
}