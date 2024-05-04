const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { ApplicationCommandOptionType } = require('discord.js');
const UserProfile = require('../schemas/UserProfile');
const Inventory = require('../schemas/Inventory');
const market = require('../schemas/MarketplaceSchema');
const MarketplaceSchema = require('../schemas/MarketplaceSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('buy')
        .setDescription('Buy a slave from the marketplace'),
        options:[
            {
                name: 'slave',
                description: 'The Slave you want to buy',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
            {
                name: 'ammount',
                description:'The ammount of slaves you want to buy',
                type: ApplicationCommandOptionType.String,
                required: true,
            }
        ], 
    run: async({interaction}) => {
            let userProfile = await UserProfile.findOne({ userId: interaction.member.id });
            let inventory   = await Inventory.findOne({ userId: interaction.member.id });
            let market = await MarketplaceSchema.findOne({guildId:'0000'})
            //CHECKING IF THE USER HAS A REGISTERED USERPROFILE AND AN INVENTORY
            if(!userProfile || !inventory){ 
                const accountExistsEmbed = new EmbedBuilder()
                .setColor('Red')
                .setTitle('😠 You dont have an account! Try the `/create` command to make one!')
                return interaction.reply({embeds: [accountExistsEmbed]});
            }

            //IF THE USER ID HAS A REGISTERED USERPROFILE AND INVENTORY:

            let targetSlave   = interaction.options.get('slave').value;   //GET THE NAME OF THE SLAVE THE USER ENTERED IN THE COMMAND OPTIONS
            let targetAmmount = interaction.options.get('ammount').value; //GET THE AMMOUNT OF SLAVES THE USER WANTS ENTERED IN THE COMMAND OPTIONS

            if(targetAmmount < 1){
                const moreThanOneEmbed = new EmbedBuilder()
                    .setColor('DarkRed')
                    .setTitle('⚠️ Your `ammount` cannot be less than 1!');
                  
                return interaction.reply({embeds: [moreThanOneEmbed]});
            }

            for(let i=0; i<market.finalArr.length; i++){
                if(targetSlave == market.finalArr[i]){                             //CHECKING IF THE SLAVE THE USER ENTERED EXISTS IN THE SLAVES ARRAY
                    if(userProfile.balance >= market.finalPrices[i]*targetAmmount){   //CHECKING IF THE USER HAS ENOUGH BALANCE TO BUY THAT SPECIFIC AMMOUNT OF SLAVES
                        for(let j=0; j<targetAmmount; j++){               
                            userProfile.balance -= market.finalPrices[i];              //SUBTRACTING THE PRICE OF THE SLAVE EVERY TIME WE BUY ONE UNTIL THE LOOP ENDS                      //GIVING THE USER 2 RANKXP FOR EVERY SLAVE
                            inventory.slaves.push(targetSlave);           //ADDING THAT SLAVE IN THE SLAVES ARRAY INSIDE THE USER INVENTORY STORED IN THE DATABASE
                            inventory.buyPrice.push(market.finalPrices[i])
                            
                        } //LOOP ENDS WHEN THE J IS EQUAL TO THE TARGET AMMOUNT AND THE USER HAS THE AMMOUNT OF SLAVES HE WANTED
                        
                        userProfile.save();                               //SAVING THE USERPROFILE AND THE INVENTORY
                        inventory.save();                                 //ITS IMPORTANT THAT THESE ARE SAVED WITH THESE VARIABLE NAMES
                        const buyEmbed = new EmbedBuilder()
                            .setColor('Green')
                            .setTitle(`🛒 You bought ${targetAmmount} ${targetSlave}(s)!`)
                        return interaction.reply({embeds: [buyEmbed]}); 
                    }
                    else{//IF USER DOESNT HAVE ENOUGH MONEY
                        const buyEmbed = new EmbedBuilder()
                            .setColor('DarkRed')
                            .setTitle(`🤕 You need **${market.finalPrices[i] * targetAmmount}** 🥜 to buy all those slaves 😡 !`)
                        return interaction.reply({embeds: [buyEmbed]});
                    }
                }
                
            }   
            
            const buyEmbed = new EmbedBuilder()
                            .setColor('DarkRed')
                            .setTitle(`😡 That slave is not available on the current marketplace!`)
                            .addFields(
                                {name: ' ', value: 'use the `/marketplace` command to check what slaves are currently in the market!'}
                            )
            return interaction.reply({embeds: [buyEmbed]});


        }
        
    }
