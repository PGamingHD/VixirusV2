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

client.slowmodemodule = new Collection();

client.funmodule = new Collection();

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
