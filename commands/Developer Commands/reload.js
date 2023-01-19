const {
    Message,
    Client,
    EmbedBuilder
} = require("discord.js");
const emoji = require("../../botconfig/emojis.json")
const ee = require("../../botconfig/embed.json");
const config = require("../../botconfig/config.json")

module.exports = {
    name: "reload", //userMoney, userBank, userBitcoin, userID (ALL USERVALUES)
    aliases: ['reloadcmd'],
    userPerms: [],
    clientPerms: [],
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        if (!config.DEVELOPER_IDS.includes(message.author.id)) return;

        if (args[0] === "cmd") {
            try {
                let reload = false;
                for (let i = 0; i < client.categories.length; i += 1) {
                    let dir = client.categories[i];
                    try {
                        if (!args[1])
                            return message.reply({
                                embeds: [
                                    new EmbedBuilder()
                                    .setColor(ee.errorColor)
                                    .setDescription(`Please include an argument.`),
                                ],
                            });
    
                        delete require.cache[require.resolve(`../../commands/${dir}/${args[1]}.js`)];
                        client.commands.delete(args[1]);
                        const pull = require(`../../commands/${dir}/${args[1]}.js`);
                        client.commands.set(args[1], pull);
                        reload = true;
                    } catch {}
                }
                if (reload) return message.reply({
                        embeds: [
                            new EmbedBuilder()
                            .setColor(ee.color)
                            .setDescription(`:white_check_mark: Successfully reloaded command \`[ ${args[1]} ]\``),
                        ],
                    });
    
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor(ee.errorColor)
                        .setDescription(`:x: Could not reload command: \`[ ${args[1]} ]\``),
                    ],
                });
            } catch (e) {
                console.log(e);
    
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor(ee.errorColor)
                        .setTitle(`:x: Something went very wrong`)
                        .setDescription(`\`\`\`${e.message}\`\`\``),
                    ],
                });
            }
        } else if (args[0] === "slash") {
            try {
                let reload = false;
                console.log(client.interactionCategories.length)
                for (let i = 0; i < client.interactionCategories.length; i += 1) {
                    let dir = client.interactionCategories[i];
                    try {
                        if (!args[1])
                            return message.reply({
                                embeds: [
                                    new EmbedBuilder()
                                    .setColor(ee.errorColor)
                                    .setDescription(`Please include an argument.`),
                                ],
                            });
                        delete require.cache[require.resolve(`../../SlashCommands/${dir}/${args[1]}.js`)];
                        client.interactionCommands.delete(args[1]);
                        const pull = require(`../../SlashCommands/${dir}/${args[1]}.js`);
                        client.interactionCommands.set(args[1], pull);
                        reload = true;
                    } catch {}
                }
                if (reload) return message.reply({
                        embeds: [
                            new EmbedBuilder()
                            .setColor(ee.color)
                            .setDescription(`:white_check_mark: Successfully reloaded slashcommand \`[ ${args[1]} ]\``),
                        ],
                    });
    
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor(ee.errorColor)
                        .setDescription(`:x: Could not reload slashcommand: \`[ ${args[1]} ]\``),
                    ],
                });
            } catch (e) {
                console.log(e);
    
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor(ee.errorColor)
                        .setTitle(`:x: Something went very wrong`)
                        .setDescription(`\`\`\`${e.message}\`\`\``),
                    ],
                });
            }
        } else {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.errorColor)
                    .setDescription(`:x: Please choose between types \`cmd\`, \`slash\` to reload!`),
                ],
            });
        }
    },
};