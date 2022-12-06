const client = require("../../index.js");
const config = require("../../botconfig/config.json");
const {
    stringTemplateParser,
    sendVerification,
    confirmUserData
} = require("../../handler/functions");

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
    return;
});