const client = require("../../index.js");
const ee = require("../../botconfig/embed.json");
const {
    LoggerLog
} = require("../../handler/functions");
const { EmbedBuilder } = require("discord.js");

client.on("roleCreate", async (role) => {
    if(await client.roleCreate.has(`${role.guild.id}`) && await client.loggingmodule.has(`${role.guild.id}`)) {
        await LoggerLog(role.guild, {
            embeds: [
                new EmbedBuilder()
                .setColor(ee.successColor)
                .setTitle(`:warning: Role Created :warning:`)
                .addFields([{
                    name: 'Role Name',
                    value: `${role.name}`
                }, {
                    name: 'Role Color',
                    value: '#000000'
                }, {
                    name: 'Mentionable',
                    value: `${role.mentionable === false ? ":x:" : ":white_check_mark:"}`
                }, {
                    name: 'Hoisted',
                    value: `${role.hoist === false ? ":x:" : ":white_check_mark:"}`
                }])
                .setFooter({text: `Role ID: ${role.id}`})
                .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1054749803193585714/support.png`)
                .setTimestamp()
            ]
        });
    }
});


/*

Code used in this script has been written by original PizzaParadise developer - PGamingHD#0666
Require assistance with scripts? Join the discord and get help right away! - https://discord.gg/pxySje4GPC
Other than that, please do note that it is required if you are using this to mention the original developer
Original Developer - PGamingHD#0666

*/