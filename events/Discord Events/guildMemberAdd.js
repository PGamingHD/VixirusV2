const client = require("../../index.js");
const config = require("../../botconfig/config.json");
const {
    stringTemplateParser,
    sendVerification,
    confirmUserData
} = require("../../handler/functions");

client.on("guildMemberAdd", async (member) => {
    if (client.welcomemodule.has(`${member.guild.id}`) && client.joinmodule.has(`${member.guild.id}`) && client.cachedWelcomeChannels.get(`${member.guild.id}`) && client.cachedWelcomeMessages.get(`${member.guild.id}`) !== "") {
        try {
            const cachedChannel = await client.channels.fetch(`${client.cachedWelcomeChannels.get(`${member.guild.id}`)}`);
            await cachedChannel.send({
                content: await stringTemplateParser(client.cachedWelcomeMessages.get(`${member.guild.id}`), {
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

    if (client.welcomemodule.has(`${member.guild.id}`) && client.privatemodule.has(`${member.guild.id}`) && client.cachedPrivateMessages.get(`${member.guild.id}`) !== "") {
        try {
            await member.send({
                content: await stringTemplateParser(client.cachedWelcomeMessages.get(`${member.guild.id}`), {
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
        } catch {}
    }
    return;
});