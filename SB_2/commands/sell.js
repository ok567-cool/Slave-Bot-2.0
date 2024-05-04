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
        .setName('sell')
        .setDescription('Sell your slave'),
        options:[
            {
                name:'slave',
                description:'The slave you want to sell',
                type:ApplicationCommandOptionType.String,
                required:true,
            },
            {
                name:'ammount',
                description:'The ammount of slaves you want to sell at once',
                type:ApplicationCommandOptionType.Number,
                required:true,
            },
            

        ],
    run: async({interaction}) => {
        const targetSlave   = interaction.options.get('slave').value;
        const targetAmmount = interaction.options.get('ammount').value;

        if(targetAmmount < 1){
            const moreThanOneEmbed = new EmbedBuilder()
                .setColor('DarkRed')
                .setTitle('⚠️ Your `ammount` cannot be less than 1!');
                  
            return interaction.reply({embeds: [moreThanOneEmbed]});
        }

        let userProfile = await UserProfile.findOne({userId: interaction.member.id});
        let inventory   = await Inventory.findOne({userId: interaction.member.id});
        let marketplace = await Market.findOne({guildId: '0000'});

        if(!userProfile || !inventory){
            const accountExistsEmbed = new EmbedBuilder()
                .setColor('Red')
                .setTitle('😠 You dont have an account! Try the `/create` command to make one!')
                return interaction.reply({embeds: [accountExistsEmbed]});
        }

        for(let i=0; i<marketplace.finalArr.length; i++){
            if(targetSlave == marketplace.finalArr[i]){
                for(let j=0; j<targetAmmount; j++){
                    userProfile.balance += marketplace.finalPrices[i];
                    inventory.slaves.splice(targetSlave, 1);
                    let slaveArrPos = inventory.slaves.indexOf(targetSlave);
                    inventory.buyPrice.splice(slaveArrPos, 1);

                }

                inventory.save();
                userProfile.save();

                const sellEmbed = new EmbedBuilder()
                    .setColor('Green')
                    .setTitle(`💵 Someone bought your slave(s) on the marketplace for **${marketplace.finalPrices[i]}** 🥜 each, **${marketplace.finalPrices[i] * targetAmmount}** 🥜 in total!`)
                return interaction.reply({embeds: [sellEmbed]}); 
            }
            
        }

        const buyEmbed = new EmbedBuilder()
            .setColor('DarkRed')
            .setTitle(`😡 That slave is not available on the current marketplace!`)//IF THE TARGET SLAVE DOESNT EXIST 
            .addFields(
                {name: ' ', value: 'use the `/marketplace` command to check what slaves are currently in the market!'}
            )
        return interaction.reply({embeds: [buyEmbed]});

        
    
    }

    
}


