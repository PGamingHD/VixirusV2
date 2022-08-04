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
    const {
        languageControl,
        stringTemplateParser
    } = require("../../handler/functions");

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
                        .setTitle(await languageControl(interaction.guild, 'VOTE_REWARDS_TITLE'))
                        .setDescription(await languageControl(interaction.guild, 'VOTE_REWARDS_DESC'))
                        .addFields([{
                            name: await languageControl(interaction.guild, 'VOTE_TIMER_TITLE'),
                            value: await languageControl(interaction.guild, 'VOTE_TIMER_READY')
                        }, {
                            name: await languageControl(interaction.guild, 'VOTE_STREAK_TITLE'),
                            value: `${voting_streak}`
                        }])
                        .setFooter({
                            text: await languageControl(interaction.guild, 'VOTE_AUTOMATIC_ADD')
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
                        .setTitle(await languageControl(interaction.guild, 'VOTE_REWARDS_TITLE'))
                        .setDescription(await languageControl(interaction.guild, 'VOTE_REWARDS_DESC'))
                        .addFields([{
                            name: await languageControl(interaction.guild, 'VOTE_TIMER_TITLE'),
                            value: stringTemplateParser(await languageControl(interaction.guild, 'VOTE_TIMER_NOTREADY'), {timeUntilNextVote: prettyMilliseconds(timeleft, {verbose: true})})
                        }, {
                            name: await languageControl(interaction.guild, 'VOTE_STREAK_TITLE'),
                            value: `${voting_streak}`
                        }])
                        .setFooter({
                            text: await languageControl(interaction.guild, 'VOTE_AUTOMATIC_ADD')
                        })
                    ]
                })
            }
        }
    }