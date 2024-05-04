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
        .setName('slavetrade')
        .setDescription('Trade a slave you own with someone else at your own price'),
        options:[
            {
                name:'tradepartner',
                description:'Who do you want to trade with',
                type:ApplicationCommandOptionType.User,
                required:true,
            },
            {
                name:'slave',
                description:'The slave you want to give',
                type:ApplicationCommandOptionType.String,
                required:true,
            },
            {
                name:'price',
                description:'The ammount of nuts you want for this slave',
                type:ApplicationCommandOptionType.Number,
                required: true,
            }

        ],
    run: async({interaction}) => {
        let tradePartnerId = interaction.options.get('tradepartner').user.id;
        let slaveToTradeW_ = interaction.options.get('slave').value;
        let priceOfSlaveW_ = interaction.options.get('price').value;

        let inventory    = await Inventory.findOne({userId: interaction.member.id});
        let userProfile = await UserProfile.findOne({userId: interaction.member.id});


        if(!userProfile){
            const accountExistsEmbed = new EmbedBuilder()
                .setColor('Red')
                .setTitle('😠 You dont have an account! Try the `/create` command to make one!')
            return interaction.reply({embeds: [accountExistsEmbed]});
        }
        userProfile = await UserProfile.findOne({userId: tradePartnerId});

        if(!userProfile){
            const accountExistsEmbed = new EmbedBuilder()
                .setColor('Red')
                .setTitle('😠 Your trade partner doesnt have an account! Try the `/create` command to make one!')
            return interaction.reply({embeds: [accountExistsEmbed]});
        }

        let slaves   = ['Jamol', 'Tyrone', 'Zoey', 'Ahmed Jamol', 'Saffi', 'Darksy', 'Dmaann', 'Dmann Super Sayan', 'Primz S-Mod AK', 'The Rock', 'Herculies', 'Goku', 'Xiao', 'BukhariGameplay', 'Khudabakhsh', 'Bronny James', 'Terrel', 'Usain Bolt', 'Lil Nas X', 'Snoopy', 'IShowSpeed', 'Shaunie', 'Grown Up Saffi', 'Rub', 'Femboy Arc Rub', 'George', 'Andrew', 'Willy']

        for(let i=0; i<slaves.length; i++){
            if(slaves[i] == slaveToTradeW_){
                for(let j=0; j<inventory.slaves.length; j++){
                    if(inventory.slaves[j] == slaveToTradeW_){
                        if(userProfile.balance >= priceOfSlaveW_){
                            let trades = await Trades.findOne({userId: tradePartnerId});
                            if(!trades) {
                                trades = new Trades({userId: tradePartnerId, tradePartnerId: interaction.member.id, tradePrice: priceOfSlaveW_, slaveToTrade: slaveToTradeW_})
                                trades.tradeActive = true;
                                trades.save();

                                const tradePassEmbed = new EmbedBuilder()
                                        .setColor('Aqua')
                                        .setTitle('📨 Trade request sent!')
                                        .addFields(
                                            {name: ` `, value:`Sent to **${interaction.options.get('tradepartner').member.displayName}**`},
                                            {name: ` `, value:`Slave Name: **${slaveToTradeW_}** Asking Price: **${priceOfSlaveW_}**`},
                                            {name: ` `, value:'Your trade partner can accept this trade using the `/tradeaccept` command or use `/tradereject` if you dont like this trade'}
                                        )
                                return interaction.reply({embeds: [tradePassEmbed]});

                                
                            }


                            trades.tradePartnerId = interaction.member.id;
                            trades.tradePrice = priceOfSlaveW_;
                            trades.slaveToTrade = slaveToTradeW_;
                            trades.tradeActive = true;
                            trades.save();

                            const tradePassEmbed = new EmbedBuilder()
                                        .setColor('Aqua')
                                        .setTitle('📨 Trade request sent!')
                                        .addFields(
                                            {name: ` `, value:`Sent to **${interaction.options.get('tradepartner').member.displayName}**!`},
                                            {name: ` `, value:'Your trade partner can accept this trade using the `/tradeaccept` command'}
                                        )
                            return interaction.reply({embeds: [tradePassEmbed]});
                        }
                    }
                }
            }
        }

        const loopNotPassEmbed = new EmbedBuilder()
                .setColor('DarkRed')
                .setTitle('🤕 Error processing trade!')
                .addFields(
                    {name: ` `, value:'This might be because: `You dont own that slave`, `Your trade partner doesnt have enough money for this trade`, `The entered slave doesnt exist (check for typos)`'}
                )
        return interaction.reply({embeds: [loopNotPassEmbed]});

        
    
    }

}
