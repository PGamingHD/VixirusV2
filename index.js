//           --------------------<CONSTRUCTORS>--------------------

const {
    Client,
    Collection,
    Intents,
    GatewayIntentBits,
    Partials,
    IntentsBitField
} = require("discord.js");
const {
    readdirSync,
    readdir
} = require("fs");
const chalk = require("chalk");
require('dotenv').config();


//           --------------------<CONSTRUCTORS>--------------------


//           --------------------<CONSTRUCTING CLIENTS>--------------------

const client = new Client({
    allowedMentions: {
        parse: ["users"], // "everyone", "roles", "users"
        repliedUser: false,
    },
    waitGuildTimeout: 10000,
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildEmojisAndStickers
    ],

    partials: [
        Partials.ActivityType,
    ],
});

//           --------------------<CONSTRUCTING CLIENTS>--------------------


//           --------------------<MODULE EXPORTS>--------------------

module.exports = client;

//           --------------------<MODULE EXPORTS>--------------------


//           --------------------<GLOBAL VARIABLES CONSTRUCTION>--------------------

client.commands = new Collection();
client.slashCommands = new Collection();
client.categories = readdirSync("./commands/");
client.slashcategories = readdirSync("./SlashCommands/");
client.dashboardSettings = readdirSync("./dashboard/settings/");
client.dashboardLanguages = readdirSync("./dashboard/languages");
client.config = require("./botconfig/config.json");

//           --------------------<GLOBAL VARIABLES CONSTRUCTION>--------------------


//           --------------------<DB VARIABLES CONTSTRUCTION>--------------------

//GLOBALS
client.userCooldown = new Collection();
client.startupCooldown = new Collection();

//MODULES
client.prefixmodule = new Collection();

client.welcomemodule = new Collection();
client.joinmodule = new Collection();
client.leavemodule = new Collection();
client.privatemodule = new Collection();
client.rolemodule = new Collection();

client.languagemodule = new Collection();

client.modmodule = new Collection();
client.modlogmodule = new Collection();

client.funmodule = new Collection();

client.loggingmodule = new Collection();

//SETTINGS
client.cachedGuildLanguages = new Collection();

client.cachedServerPrefixes = new Collection();

client.cachedWelcomeMessages = new Collection();
client.cachedWelcomeChannels = new Collection();
client.cachedLeaveMessages = new Collection();
client.cachedLeaveChannels = new Collection();
client.cachedPrivateMessages = new Collection();
client.cachedAutoRoles = new Collection();
client.cachedModRoles = new Collection();
client.cachedWarns = new Collection();
client.cachedMuteds = new Collection();
client.cachedModLogs = new Collection();
client.cachedLoggingChannels = new Collection();

//COMMANDS
client.slowmodeCmd = new Collection();

//LOGS
client.roleUpdate = new Collection();
client.roleDelete = new Collection();
client.roleCreate = new Collection();
client.messageUpdate = new Collection();
client.messageDelete = new Collection();
client.guildUpdate = new Collection();
client.guildBanRemove = new Collection();
client.guildBanAdd = new Collection();
client.emojiUpdate = new Collection();
client.emojiDelete = new Collection();
client.emojiCreate = new Collection();
client.channelUpdate = new Collection();
client.channelDelete = new Collection();
client.channelCreate = new Collection();
client.guildMemberRemove = new Collection();
client.guildMemberAdd = new Collection();
client.roleUpdates = new Collection();
client.nicknameUpdates = new Collection();
client.avatarUpdates = new Collection();
client.timeoutUpdates = new Collection();



//           --------------------<DB VARIABLES CONTSTRUCTION>--------------------


//           --------------------<REQUIRES>--------------------

require("./handler/dashboard");
require("./handler/anticrash")(client);
require("./handler")(client);

//           --------------------<REQUIRES>--------------------


//           --------------------<DATABASE ARGUMENTS>--------------------

//           --------------------<DATABASE ARGUMENTS>--------------------


//           --------------------<STARTING ARGUMENTS>--------------------

client.login(process.env.LOGIN_TOKEN).catch((e) => {
    console.log(e)
    console.log(chalk.red("[LOGIN] <==> || Failed to login due to token being invalid, please fix this asap! || <==> [LOGIN]"))
});

//           --------------------<STARTING ARGUMENTS>--------------------
