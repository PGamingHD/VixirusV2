const {
    Client,
    CommandInteraction,
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    EmbedBuilder,
    ApplicationCommandOptionType
} = require('discord.js');
const ee = require('../../botconfig/embed.json');
const emoji = require('../../botconfig/emojis.json')
const prettyMilliseconds = require('pretty-ms');
const config = require('../../botconfig/config.json');
const {
    languageControl,
    stringTemplateParser
} = require("../../handler/functions");
require('dotenv').config();
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

module.exports = {
    name: 'ai',
    globalCooldown: 10,
    description: 'Ask the OpenAI anything, provided by OpenAI!',
    options: [{
        name: 'question',
        description: 'The question you wish to ask the AI',
        type: ApplicationCommandOptionType.String,
        required: true
    }],
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async (client, interaction, args) => {
        const question = interaction.options.getString('question');

        await interaction.reply({
            content: `${emoji.loading} Thinking...`
        })
        
        try {
            const completion = await openai.createCompletion({
              model: "text-davinci-003",
              prompt: question,
              max_tokens: 4000
            });
            
            return await interaction.editReply({
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
            return await interaction.editReply({
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
    }
}