const {
    Message,
    Client,
    EmbedBuilder
} = require("discord.js");
const emoji = require("../../botconfig/emojis.json")
const ee = require("../../botconfig/embed.json");
const config = require("../../botconfig/config.json")
const {
    inspect
} = require(`util`);

module.exports = {
    name: "eval",
    aliases: ['evaluate'],
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

        if (!args[0]) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.color)
                    .setDescription(`Please insert arguments to evaluate.`),
                ],
            });
        }
        let evaled;
        try {

            if (args.join(` `).includes(`token`)) return;

            evaled = await eval(args.join(` `));
            let string = inspect(evaled);

            if (string.includes(client.token)) return;

            let evalEmbed = new EmbedBuilder().setTitle(`${client.user.username} | EVALUTION`);
            evalEmbed.setDescription(`***Input:***\n\`\`\`js\n${args.join(` `)}\n\`\`\`\n***Output:***\n\`\`\`js\n${string}\n\`\`\``);
            message.reply({
                embeds: [evalEmbed.setColor(ee.color).setTimestamp()]
            });
        } catch (e) {
            console.log(e);
            const evalEmbed2 = new EmbedBuilder();
            evalEmbed2.setTitle(`Something went wrong`);
            evalEmbed2.setDescription(`\`\`\`${e.message}\`\`\``);
            return message.reply({
                embeds: [evalEmbed2.setColor(ee.errorColor).setTimestamp()]
            });
        }
    },
};

/*

Code used in this script has been written by original PizzaParadise developer - PGamingHD#0666
Require assistance with scripts? Join the discord and get help right away! - https://discord.gg/pxySje4GPC
Other than that, please do note that it is required if you are using this to mention the original developer
Original Developer - PGamingHD#0666

*/