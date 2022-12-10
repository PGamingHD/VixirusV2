const client = require("../../index");
const config = require("../../botconfig/config.json");
const emoji = require("../../botconfig/emojis.json");
const {
    Cron
} = require("croner");
const fs = require("fs");
const {
    ActivityType,
    Interaction
} = require("discord.js");
const chalk = require("chalk");
const {
    startupCooldown,
    maintenanceMode,
    blacklistedGuilds,
    blacklistedUsers,
    latestTOS,
    agreementDate,
} = require("../../index");
const getPool = require("../../handler/database");

//TWITCH TESTING
const {
    ClientCredentialsAuthProvider
} = require('@twurple/auth');
const {
    ApiClient
} = require('@twurple/api');
const {
    DirectConnectionAdapter,
    EventSubListener
} = require('@twurple/eventsub');

client.on("ready", async (client) => {
    try {
        try {
            const stringlength = 69;
            console.log(chalk.green(`[LOGIN] <==> || I successfully logged into ${client.user.tag} and started ALL services || <==> [LOGIN]`));
            console.log(chalk.red(`[COOLDOWN] <==> || Entering bot cooldown for 60 seconds while the Database connects correctly! || <==> [COOLDOWN]`));
        } catch (error) {
            console.log(error)
        }

        Cron('0 */1 * * * *', () => {
            const currentMB = Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100
            const file = fs.readFileSync('./botconfig/heapusage.json');

            const newfile = JSON.parse(file);

            const newObj = {
                "heap_1": currentMB,
                "heap_2": newfile['heap_1'],
                "heap_3": newfile['heap_2'],
                "heap_4": newfile['heap_3'],
                "heap_5": newfile['heap_4'],
                "heap_6": newfile['heap_5'],
                "heap_7": newfile['heap_6'],
                "heap_8": newfile['heap_7'],
                "heap_9": newfile['heap_8'],
                "heap_10": newfile['heap_9']
            }

            fs.writeFileSync('./botconfig/heapusage.json', JSON.stringify(newObj));
        });
            /*const clientId = 'ft1bzbayhmf62hzlf4wytywx6yr5z0';
            const clientSecret = 'gvp576i85a93wg3c06nrckrh2uxqd3';

            const authProvider = new ClientCredentialsAuthProvider(clientId, clientSecret);
            const apiClient = new ApiClient({
                authProvider
            });

            const adapter = new DirectConnectionAdapter({
                hostName: 'example.com',
                sslCert: {
                    key: `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDXh7wJwkWTwwk7
8RGpmBpTJa0YvT1dR/YbqOka5qYYnhoeuLMT8zqVtokgCihzw+PgWUfLuhHhwCMi
jIZ9cKDfqwx0RdjdvhSdCBzUZ/Rbg9jkI2h1ay5/b6Rv72BqSpiSKWhcSHD/X7qu
4BXYIiK+0LaCId2UNsY5dhwonKTUsadfQWdGZyCW9orevzGiePYkoN1i2gQTasFZ
Cip/2sCug4R0SXlLijEBZqY7p7HvqcA23dda4dfyFRJ+VqO+YuNtBlP4zvFi6WJt
ZtvC3LBb5rEtU/Saujte3/yqv7+G41xntHMp1BFpGxoB/a7Sijm+C9FpeIvMB7Ll
Ut7jEoEFAgMBAAECggEAO5+vIzv9J31jBpQQAMy1K59WnWtsmGuZ59j4c5qvBExo
iWsrDy/QWy5eDOECg9QDLENGm1NkMwGGNr6NThJkTrvw/BF+hwlYhoCCCTig3thA
ngw1j5YRDOwDn3unPoBYaMbPugfISr1e1ZXkNSBsYEE43BMmSyRD/g1wiMOczcG9
Ywx+P92B0eHQHcHw4v3wmYhQ0qAao9e2zbWpFDJMGdnaUJrKQZx1q6VUNGyaq2pS
7DyP978KGO3FeQBMJwmWoFTlyMU2DcqhntEkV01zz/TeXgtVAU4XuvguO0tO0QC4
Vpg33Uls0olcNMgPqOMIbOY7o6Z9lxNn4beWUL4sWQKBgQDZYywLlzkLXvU6H/+V
WHtugLxf81wokxyichMxINX/2CETLmV9tF10S3YWog1iGiZ8NDV2HmKRdNKMXZuh
0blZPFPAGcTZld6HIRCASBGFiuNEn9V9ggyvNUIYyCUNdJsmxDcbvNqDPkup+MUg
09cTmUeR2pcVFBUYGRfx35NlDwKBgQD90B1cMAQ8JI15FB5gYLZXYnmCj97RQCqA
FfqFciynIvH1Ua3yUm1jx6kdV62VrCeXn18Xx0jxX3fO3UujlReZBIIH1NSfQaNA
JxsJNXdVcJAAJyBhn+f2Y2XmjBT5r1V96mv+0GQwm2cM4bVtiIDrPCPymr1pT3jY
r2A7JoIAqwKBgQCDI2dbqqM379XBdbIp9tGnLLP2sglDVNOuT2Cyf1t5VnlFZ/TD
qz3BPRCEwMeQCbRzss8ZbWUK2E13bbTIHotQgKsJNMJifB1cqR6aNF+Vjt5g9IbG
iuB6BYfVCVAI2PILpcyUyA2NpNPiOnc4wXJ6mTnqi9IeXhoHioO+XqA9EwKBgGcy
8m0kXORzXE6JvpwjVqCLOqq6greEJoOz7AvMU5mVnNnJXzezCiVS7lEu8DZ2LBb7
RvftIJx728PxuKqHmXOvIIu8nsMuNgmEnPqOkbncrcBSKFlpYjCNU8Z82J55CwLK
iSSvaL1Wwny7XUBvCzQaXOdswW0LUjCQhkkmrB9HAoGAMZi6aCL9CrA0De8MjZt3
qBDKaBPjbABxRLW89Ro691Y+8MoP0jlU74Uyg2aWvGJI1yKTFhqlnr9stlqqMzWH
pl6JB7h5cFEPj6S+JSOcDdF3ZZ4IA83omT1LzgBFViZuqkXW7i/maWGSycJ40mJG
W5sJj9PI10pF1D3xlUloRLw=
-----END PRIVATE KEY-----`,
                    cert: `-----BEGIN CERTIFICATE-----
MIIEqzCCAxOgAwIBAgIQE5VeWlCVCK4rUcA+BhAoLzANBgkqhkiG9w0BAQsFADCB
pzEeMBwGA1UEChMVbWtjZXJ0IGRldmVsb3BtZW50IENBMT4wPAYDVQQLDDVQT05U
VVMtREVTS1RPUFxwb250dUBQT05UVVMtREVTS1RPUCAoUG9udHVzIEthcmxzc29u
KTFFMEMGA1UEAww8bWtjZXJ0IFBPTlRVUy1ERVNLVE9QXHBvbnR1QFBPTlRVUy1E
RVNLVE9QIChQb250dXMgS2FybHNzb24pMB4XDTIyMTIwNzIyMDk0NVoXDTI1MDMw
NzIyMDk0NVowaTEnMCUGA1UEChMebWtjZXJ0IGRldmVsb3BtZW50IGNlcnRpZmlj
YXRlMT4wPAYDVQQLDDVQT05UVVMtREVTS1RPUFxwb250dUBQT05UVVMtREVTS1RP
UCAoUG9udHVzIEthcmxzc29uKTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
ggEBANeHvAnCRZPDCTvxEamYGlMlrRi9PV1H9huo6RrmphieGh64sxPzOpW2iSAK
KHPD4+BZR8u6EeHAIyKMhn1woN+rDHRF2N2+FJ0IHNRn9FuD2OQjaHVrLn9vpG/v
YGpKmJIpaFxIcP9fuq7gFdgiIr7QtoIh3ZQ2xjl2HCicpNSxp19BZ0ZnIJb2it6/
MaJ49iSg3WLaBBNqwVkKKn/awK6DhHRJeUuKMQFmpjunse+pwDbd11rh1/IVEn5W
o75i420GU/jO8WLpYm1m28LcsFvmsS1T9Jq6O17f/Kq/v4bjXGe0cynUEWkbGgH9
rtKKOb4L0Wl4i8wHsuVS3uMSgQUCAwEAAaOBjzCBjDAOBgNVHQ8BAf8EBAMCBaAw
EwYDVR0lBAwwCgYIKwYBBQUHAwEwHwYDVR0jBBgwFoAUfZiuF3ZwutKsPnWxbsh4
eDKniHIwRAYDVR0RBD0wO4ILZXhhbXBsZS5jb22CCXZpeGlydXN2MoIJbG9jYWxo
b3N0hwR/AAABhxAAAAAAAAAAAAAAAAAAAAABMA0GCSqGSIb3DQEBCwUAA4IBgQCb
uOXN93/zJOd0gU+KUomQiCtgUriCJqKEs/ZCxm61f61FBM2U86c+J9gPaU8ytiMU
dUKK2wzcCvhqVHkKQazI92NPthnm3jClYCV0YipjKB7n5COld/OXem679dU9NA8V
WjWth+ngPjLYSIjT8BZuu5bHFJW3Amwl/efRyJnblHwSLsr0XecX+Azsp+m47PWB
lRXwmxNlyXLGvQwg4w+jPehQwRuWs34lV9LHeWRr1yF3468FpetilKu9EdVxVvcX
UcQNaDG36i3V0sjUZx/f0sYOlb1Zv+WQZDbXiwV+OkwhuiXmi6d/ULfHgLVd8iRx
pQtYgeY+VK3w3M6SkOBG9hOOD6N4ogPi/vODaX3oW2TVc0AzkXc4JKEjHAKIao6M
q0ddiavTSvVlVcXdEso3iX7rGvt/7izoxZAXCga3gEWqGQp6RDWJbwpuGDRjlgOB
QPgdYOQTcXAvQK0pu7LxaFHk84aKcOK2788UBbkg6iGClIfSxSBgmFoUbFQTqTM=
-----END CERTIFICATE-----`
                }
            });
            const secret = 'soThisisAfafikwei19291489!#@';
            const listener = new EventSubListener({
                apiClient,
                adapter,
                secret,
                strictHostCheck: true
            });
            await listener.listen();

            const PGSubscription = await listener.subscribeToStreamOnlineEvents('202348216', e => {
                console.log(`${e.broadcasterDisplayName} just went live!`);
            });

            console.log(await offlineSubscription.getCliTestCommand());*/ //NEED TO OPEN LISTEN PORT 443 TO RECIEVE EVENTS!

        //SET GUILD CACHED LANGUAGES!
        const pool = await getPool().getConnection();
        const [guilds, guildsRow] = await pool.query(`SELECT * FROM guild_data`);
        guilds.forEach(async (guild) => {

            //SETTINGS

            await client.cachedGuildLanguages.set(`${guild.guild_id}`, guild.guild_language);

            await client.cachedServerPrefixes.set(`${guild.guild_id}`, guild.guild_prefix);

            await client.cachedWelcomeMessages.set(`${guild.guild_id}`, guild.guild_welcome);
            if (guild.guild_welcomechannel === "") {
                await client.cachedWelcomeChannels.set(`${guild.guild_id}`, null);
            } else {
                await client.cachedWelcomeChannels.set(`${guild.guild_id}`, guild.guild_welcomechannel);
            }
            await client.cachedLeaveMessages.set(`${guild.guild_id}`, guild.guild_bye);
            if (guild.guild_byechannel === "") {
                await client.cachedLeaveChannels.set(`${guild.guild_id}`, null);
            } else {
                await client.cachedLeaveChannels.set(`${guild.guild_id}`, guild.guild_byechannel);
            }
            await client.cachedPrivateMessages.set(`${guild.guild_id}`, guild.guild_private);
            await client.cachedAutoRoles.set(`${guild.guild_id}`, guild.guild_autoroles);

            //MODULES

            if (guild.guild_welcomemodule) {
                await client.welcomemodule.set(`${guild.guild_id}`, "Welcome Enabled!");
            }

            if (guild.guild_joinmodule) {
                await client.joinmodule.set(`${guild.guild_id}`, "Join Enabled!");
            }

            if (guild.guild_leavemodule) {
                await client.leavemodule.set(`${guild.guild_id}`, "Leave Enabled!");
            }

            if (guild.guild_privatemodule) {
                await client.privatemodule.set(`${guild.guild_id}`, "Private Enabled!");
            }

            if (guild.guild_languagemodule) {
                await client.languagemodule.set(`${guild.guild_id}`, "Language Enabled!");
            }

            if (guild.guild_prefixmodule) {
                await client.prefixmodule.set(`${guild.guild_id}`, "Prefix Enabled!");
            }

            if (guild.guild_rolemodule) {
                await client.rolemodule.set(`${guild.guild_id}`, "Autoroles Enabled!");
            }
        });
        await pool.release();

        client.user.setActivity('In Development', {
            type: ActivityType.Watching
        });

    } catch (e) {
        console.log(String(e.stack))
    }
});

/*

Code used in this script has been written by original PizzaParadise developer - PGamingHD#0666
Require assistance with scripts? Join the discord and get help right away! - https://discord.gg/pxySje4GPC
Other than that, please do note that it is required if you are using this to mention the original developer
Original Developer - PGamingHD#0666

*/