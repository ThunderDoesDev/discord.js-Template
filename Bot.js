const Discord = require("discord.js");

const client = new Discord.Client({
    allowedMentions: {
        parse: ["roles", "users", "everyone"],
        repliedUser: false
    },
    partials: [
        'MESSAGE',
        'CHANNEL',
        'REACTION',
    ],
    intents: [
        Discord.IntentsBitField.Flags.AutoModerationConfiguration,
        Discord.IntentsBitField.Flags.AutoModerationExecution,
        Discord.IntentsBitField.Flags.DirectMessagePolls,
        Discord.IntentsBitField.Flags.DirectMessageReactions,
        Discord.IntentsBitField.Flags.DirectMessageTyping,
        Discord.IntentsBitField.Flags.DirectMessages,
        Discord.IntentsBitField.Flags.GuildExpressions,
        Discord.IntentsBitField.Flags.GuildIntegrations,
        Discord.IntentsBitField.Flags.GuildInvites,
        Discord.IntentsBitField.Flags.GuildMembers,
        Discord.IntentsBitField.Flags.GuildMessagePolls,
        Discord.IntentsBitField.Flags.GuildMessageReactions,
        Discord.IntentsBitField.Flags.GuildMessageTyping,
        Discord.IntentsBitField.Flags.GuildMessages,
        Discord.IntentsBitField.Flags.GuildModeration,
        Discord.IntentsBitField.Flags.GuildPresences,
        Discord.IntentsBitField.Flags.GuildScheduledEvents,
        Discord.IntentsBitField.Flags.GuildVoiceStates,
        Discord.IntentsBitField.Flags.GuildWebhooks,
        Discord.IntentsBitField.Flags.Guilds,
        Discord.IntentsBitField.Flags.MessageContent
    ],
});

client.cooldowns = new Discord.Collection();
client.slash = new Discord.Collection();
client.commands = new Discord.Collection();
client.loadedCommands = new Discord.Collection();

client.settings = require("./Settings/Config.json");
client.packages = require("./package.json");
client.logger = require("./Utils/Logger.js");
client.modules = require("./Utils/Modules.js");
client.errors = require("./Utils/Errors.js");
client.responses = require("./Utils/Responses.js");
client.handlers = require('./Utils/Handlers.js');

client.handlers.eventsLoader(client);
client.handlers.commandsLoader(client);

let date = new Date();
client.footer = `\u00a9 ${date.getFullYear()} • ${client.settings.bot.name}`

let userAgent = client.userAgent || `${client.settings.bot.name}/${client.packages.version}`;
headers = {
    'Content-Type': 'application/json',
    'User-Agent': userAgent
};

client.login(client.settings.bot.token).catch(err => {
    client.logger.error("TOKEN_ERROR", err);
});
