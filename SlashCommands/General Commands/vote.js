    const {
        Client,
        CommandInteraction,
        MessageEmbed,
        MessageActionRow,
        MessageButton,
        EmbedBuilder
    } = require('discord.js');
    const ee = require('../../botconfig/embed.json');
    const emoji = require('../../botconfig/embed.json')
    const prettyMilliseconds = require('pretty-ms');
    const config = require('../../botconfig/config.json')
    const axios = require('axios');

    module.exports = {
        name: 'vote',
        description: 'Vote for the Pokémon bot and gain some special benefits!',
        /** 
         * @param {Client} client 
         * @param {Message} message 
         * @param {String[]} args 
         */
        run: async (client, interaction, con, args) => {
            const cd = await con.query(`SELECT * FROM vote_data WHERE vote_userid = ${interaction.user.id}`)

            let currentCD = 0;
            let voting_streak = `☆☆☆☆☆☆☆`;
            if (cd[0][0].length !== 0) {
                currentCD = cd[0][0].vote_latest;

                //DAYSTREAK CALCULATION
                if (cd[0].vote_daystreak === 1) {
                    voting_streak = `🟊☆☆☆☆☆☆`
                } else if (cd[0][0].vote_daystreak === 2) {
                    voting_streak = `🟊🟊☆☆☆☆☆`
                } else if (cd[0][0].vote_daystreak === 3) {
                    voting_streak = `🟊🟊🟊☆☆☆☆`
                } else if (cd[0][0].vote_daystreak === 4) {
                    voting_streak = `🟊🟊🟊🟊☆☆☆`
                } else if (cd[0][0].vote_daystreak === 5) {
                    voting_streak = `🟊🟊🟊🟊🟊☆☆`
                } else if (cd[0][0].vote_daystreak === 6) {
                    voting_streak = `🟊🟊🟊🟊🟊🟊☆`
                } else if (cd[0][0].vote_daystreak === 7) {
                    voting_streak = `🟊🟊🟊🟊🟊🟊🟊 ***[FULL]***`
                }
            }

            let cooldown = 43201000;
            if (Date.now() >= currentCD + cooldown || currentCD === 0) {

                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor(ee.color)
                        .setTitle(`Voting Rewards`)
                        .setDescription(`Vote for us on [top.gg](https://top.gg/bot/904757023797813339/vote) to recieve tokens that can then be spent in the Shop. You can vote once per 12 hours!`)
                        .addFields([{
                            name: 'Voting Timer',
                            value: `Your vote seems to be ready, vote and get your rewards now!`
                        }, {
                            name: 'Voting Streak',
                            value: `${voting_streak}`
                        }])
                        .setFooter({
                            text: 'Voting rewards will be automatically added to you after a vote has been successfully sent.'
                        })
                    ]
                })
            } else {
                let cooldown = 43201000;
                const timetobe = currentCD + cooldown;
                const timenow = Date.now();
                const timeleft = timetobe - timenow

                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor(ee.color)
                        .setTitle(`Voting Rewards`)
                        .setDescription(`Vote for us on [top.gg](https://top.gg/bot/904757023797813339/vote) to recieve tokens that can then be spent in the Shop. You can vote once per 12 hours!`)
                        .addFields([{
                            name: 'Voting Timer',
                            value: `You can vote again in **${prettyMilliseconds(timeleft, {verbose: true})}**!`
                        }, {
                            name: 'Voting Streak',
                            value: `${voting_streak}`
                        }])
                        .setFooter({
                            text: 'Voting rewards will be automatically added to you after a vote has been successfully sent.'
                        })
                    ]
                })
            }
        }
    }