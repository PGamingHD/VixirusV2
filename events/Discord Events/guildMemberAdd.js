const client = require("../../index.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const {createCanvas, loadImage} = require("@napi-rs/canvas");
const prettyMilliSeconds = require("pretty-ms"); 
const {
    AttachmentBuilder,
    EmbedBuilder
} = require("discord.js");
const {
    stringTemplateParser,
    sendVerification,
    confirmUserData,
    LoggerLog
} = require("../../handler/functions");

client.on("guildMemberAdd", async (member) => {
    if (client.welcomemodule.has(`${member.guild.id}`) && client.joinmodule.has(`${member.guild.id}`) && client.cachedWelcomeChannels.get(`${member.guild.id}`) && client.cachedWelcomeMessages.get(`${member.guild.id}`) !== "") {
        try {
            const cachedChannel = await client.channels.fetch(`${client.cachedWelcomeChannels.get(`${member.guild.id}`)}`);

            const canvas = createCanvas(1024, 450);
            const ctx = canvas.getContext('2d');

            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0,0, canvas.width, canvas.height);
            let img = await loadImage("https://wallpaperaccess.com/full/86407.jpg");
            ctx.drawImage(img, canvas.width / 2 - img.width / 2, canvas.height / 2 - img.height / 2);

            ctx.fillStyle = "#000000";
            ctx.globalAlpha = 0.5;
            ctx.fillRect(0,0,25, canvas.height);
            ctx.fillRect(canvas.width - 25, 0, 25, canvas.height);
            ctx.fillRect(25, 0, canvas.width - 50, 25);
            ctx.fillRect(25, canvas.height - 25, canvas.width - 50, 25);
            ctx.globalAlpha = 1;

            ctx.font = "bold 90px Sans";
            ctx.strokeStyle = "#000000";
            ctx.lineWidth = 12;
            ctx.strokeText("WELCOME", 400, 200);
            ctx.fillStyle = "#FFFFFF";
            ctx.fillText("WELCOME", 400, 200);

            ctx.font = "bold 45px Sans";
            ctx.strokeStyle = "#000000";
            ctx.lineWidth = 10;
            ctx.strokeText(`${member.user.username}#${member.user.discriminator}`, canvas.width - 565, canvas.height - 175);
            ctx.fillStyle = "#eb6123";
            ctx.fillText(`${member.user.username}#${member.user.discriminator}`, canvas.width - 565, canvas.height - 175);


            ctx.font = "bold 40px Sans";
            ctx.strokeStyle = "#000000";
            ctx.lineWidth = 10;
            ctx.strokeText(`Member #${member.guild.memberCount}`, 535, canvas.height - 100);
            ctx.fillStyle = "#FFFFFF";
            ctx.fillText(`Member #${member.guild.memberCount}`, 535, canvas.height - 100);

            ctx.beginPath();
            ctx.lineWidth = 10;
            ctx.strokeStyle = "#e96423";
            ctx.arc(180, 225, 135, 0, Math.PI * 2, true);
            ctx.stroke();
            ctx.closePath();
            ctx.clip();
            img = await loadImage(member.displayAvatarURL({extension: "png"}));
            ctx.drawImage(img, 45, 90, 270, 270);
            ctx.restore();

            const attachment = new AttachmentBuilder(await canvas.encode("png"), {name: `welcome-${member.id}.png`});

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
                }),
                files: [attachment]
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

    const guildRoles = await client.cachedAutoRoles.get(`${member.guild.id}`);
    if (client.rolemodule.has(`${member.guild.id}`) && guildRoles.length !== 0) {
        const fetchedGuild = await client.guilds.fetch(`${member.guild.id}`);
        await guildRoles.forEach(async (role) => {
            try {
                const fetchedRole = await fetchedGuild.roles.fetch(`${role}`);
                await member.roles.add(fetchedRole);
            } catch {}
        });
    }

    if (await client.guildMemberAdd.has(`${member.guild.id}`) && await client.loggingmodule.has(`${member.guild.id}`)) {
        await LoggerLog(member.guild, {
            embeds: [
                new EmbedBuilder()
                .setColor(ee.successColor)
                .setTitle(`:warning: Member Joined :warning:`)
                .addFields([{
                    name: 'Member',
                    value: `${member}`
                }, {
                    name: 'Join Position',
                    value: `${member.guild.memberCount}`
                }, {
                    name: 'Member Account Created',
                    value: `${prettyMilliSeconds(Date.now() - member.user.createdTimestamp, {verbose: true})} ago`
                }])
                .setFooter({text: `User ID: ${member.user.id}`})
                .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1054749803193585714/support.png`)
                .setTimestamp()
            ]
        });
    }
    return;
});