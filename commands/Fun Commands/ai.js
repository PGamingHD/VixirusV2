const {
    Message,
    Client,
    EmbedBuilder
} = require("discord.js");
const emoji = require("../../botconfig/emojis.json")
const ee = require("../../botconfig/embed.json");
const config = require("../../botconfig/config.json");
const prettyMilliseconds = require("pretty-ms");
const {
    languageControl,
    stringTemplateParser
} = require("../../handler/functions")
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

module.exports = {
    name: "ai",
    globalCooldown: 10,
    aliases: ['openai', 'askai'],
    userPerms: [],
    clientPerms: [],
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args, con) => {
        const question = args;

        const msg = await message.reply({
            content: `${emoji.loading} Thinking...`
        })

        try {
            const completion = await openai.createCompletion({
              model: "text-davinci-002",
              prompt: question,
              max_tokens: 4000
            });
            
            return await msg.edit({
                content: '',
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.color)
                    .setTitle(`:robot: AI Response :robot:`)
                    .setDescription(`\`\`\`${completion.data.choices[0].text}\`\`\``)
                    .setTimestamp()
                ]
            })
          } catch (error) {
            return await msg.edit({
                content: '',
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.errorColor)
                    .setTitle(`:robot: Response Failed :robot:`)
                    .setDescription(`Woops, is this resource being rate limited? Try asking again in a few minutes.`)
                    .setTimestamp()
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