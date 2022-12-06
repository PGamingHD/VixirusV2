const {
    Client,
    CommandInteraction,
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    EmbedBuilder,
    ApplicationCommandOptionType,
    AttachmentBuilder
} = require('discord.js');
const ee = require('../../botconfig/embed.json');
const emoji = require('../../botconfig/embed.json')
const prettyMilliseconds = require('pretty-ms');
const config = require('../../botconfig/config.json');
const {
    languageControl,
    stringTemplateParser
} = require("../../handler/functions");
const fs = require("fs");

module.exports = {
    name: 'language',
    description: 'View your current language, and also a list of other languages you can pick for your server!',
    userPerms: ['ManageGuild'],
    clientPerms: [],
    options: [{
        name: 'new_language',
        description: 'Change your server language to another language!',
        type: ApplicationCommandOptionType.String,
        choices: [{
            name: 'English',
            value: 'en'
        }, {
            name: 'Swedish',
            value: 'sv'
        }]
    }],
    /** 
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, interaction, con, args) => {
        const newLanguage = interaction.options.getString('new_language');
        let guildLang = client.cachedGuildLanguages.get(interaction.guild.id);

        if (guildLang === "sv") {
            guildLang = "Swedish"
        } else if (guildLang === "en") {
            guildLang = "English"
        }

        if (newLanguage === null) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.color)
                    .setTitle(`:warning: Language Settings :warning:`)
                    .setDescription(`Your server currently has the language \`${guildLang}\` chosen as its language.`)
                    .setAuthor({
                        name: await languageControl(interaction.guild, 'LANGUAGE_TRANSLATION_CREDITS')
                    })
                ]
            })
        }
        
        
    }
}