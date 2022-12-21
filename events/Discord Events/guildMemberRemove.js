const client = require("../../index.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const {
    stringTemplateParser,
    sendVerification,
    confirmUserData,
    LoggerLog
} = require("../../handler/functions");
const {
    EmbedBuilder
} = require("discord.js");

client.on("guildMemberRemove", async (member) => {
    if (client.welcomemodule.has(`${member.guild.id}`) && client.leavemodule.has(`${member.guild.id}`) && client.cachedLeaveChannels.get(`${member.guild.id}`) && client.cachedLeaveMessages.get(`${member.guild.id}`) !== "") {
        try {
            const cachedChannel = await client.channels.fetch(`${client.cachedLeaveChannels.get(`${member.guild.id}`)}`);
            await cachedChannel.send({
                content: await stringTemplateParser(client.cachedLeaveMessages.get(`${member.guild.id}`), {
                    user: member.user,
                    username: member.user.username,
                    server: member.guild.name,
                    serverid: member.guild.id,
                    servericon: member.guild.iconURL,
                    serverowner: await client.users.fetch(`${member.guild.ownerId}`),
                    verificationlevel: member.guild.verificationLevel,
                    membercount: member.guild.memberCount,
                })
            })
        } catch (error) {
            console.log(error);
        }
    }
    
    if (await client.guildMemberRemove.has(`${member.guild.id}`) && await client.loggingmodule.has(`${member.guild.id}`)) {
        await LoggerLog(member.guild, {
            embeds: [
                new EmbedBuilder()
                .setColor(ee.errorColor)
                .setTitle(`:warning: Member Left :warning:`)
                .addFields([{
                    name: 'Member',
                    value: `${member}`
                }])
                .setFooter({text: `User ID: ${member.user.id}`})
                .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1054749803193585714/support.png`)
                .setTimestamp()
            ]
        });
    }
    return;
});