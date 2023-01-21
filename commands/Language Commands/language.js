const {
    Message,
    Client,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder
} = require("discord.js");
const emoji = require("../../botconfig/emojis.json");
const ee = require("../../botconfig/embed.json");
const prettyMilliseconds = require('pretty-ms');
const config = require('../../botconfig/config.json');
let cpuStat = require("cpu-stat");
let os = require("os");
const {
    languageControl
} = require("../../handler/functions");

module.exports = {
    name: "language",
    aliases: ['lang'],
    userPerms: [],
    clientPerms: [],
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args, con, prefix) => {
        const newLanguage = args[0];
        let guildLang = client.cachedGuildLanguages.get(message.guild.id);

        if (guildLang === "sv") {
            guildLang = "Swedish"
        } else if (guildLang === "en") {
            guildLang = "English"
        }

        if (newLanguage === null || !newLanguage || newLanguage !== "sv" && newLanguage !== "en") {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.color)
                    .setTitle(`:warning: Language Settings :warning:`)
                    .setDescription(`Your server currently has the language \`${guildLang}\` chosen as its language.`)
                    .setAuthor({
                        name: await languageControl(message.guild, 'LANGUAGE_TRANSLATION_CREDITS')
                    })
                ]
            })
        }
    },
};

/*

Code used in this script has been written by original PizzaParadise developer - PGamingHD#0666
Require assistance with scripts? Join the discord and get help right away! - https://discord.gg/pxySje4GPC
Other than that, please do note that it is required if you are using this to mention the original developer
Original Developer - PGamingHD#0666

*/