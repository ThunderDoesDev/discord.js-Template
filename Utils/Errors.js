const {
    EmbedBuilder,
    Colors,
    MessageFlags,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    time
} = require("discord.js");
const logger = require("../Utils/Logger");
const fs = require("fs").promises;
const path = require('path');

const LOG_DIR = './Logs';
const MAX_LOG_SIZE = 5 * 1024 * 1024;

const formatTime = () => {
    return new Date().toLocaleString('en-AU', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZone: "Australia/Brisbane",
        hour12: true
    });
};

const writeLog = async (logPath, content) => {
    try {
        await fs.mkdir(LOG_DIR, {
            recursive: true
        });
        try {
            await fs.access(logPath);
            const stats = await fs.stat(logPath);
            if (stats.size > MAX_LOG_SIZE) {
                const backupPath = `${logPath}.${Date.now()}.backup`;
                await fs.rename(logPath, backupPath);
            }
        } catch (err) {
            if (err.code === 'ENOENT') {
                await fs.writeFile(logPath, '');
            } else {
                logger.error('ErrorLogger', `Failed to check log file: ${err}`);
            }
        }
        
        const errorStack = content.error && content.error.stack ? content.error.stack : content.error;
        const logEntry = `[${new Date().toISOString()}]\n${Object.entries(content)
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n')}\n${errorStack ? `Stack Trace:\n${errorStack}\n` : ''}\n`;
        await fs.appendFile(logPath, logEntry);
    } catch (err) {
        logger.error('ErrorLogger', `Failed to write to log file: ${err}`);
    }
};

const handleCommandError = async (error, incidentID, user) => {
    await writeLog(path.join(LOG_DIR, 'Command_Errors.log'), {
        date: new Date().toLocaleDateString(),
        time: formatTime(),
        incident: incidentID,
        user: user.username,
        error
    });
    return `Command Error: ${error}`;
};

const handleEventError = async (error, incidentID) => {
    await writeLog(path.join(LOG_DIR, 'Event_Errors.log'), {
        date: new Date().toLocaleDateString(),
        time: formatTime(),
        incident: incidentID,
        error
    });
    return `Event Error: ${error}`;
};


const handleUnknownError = async (error, incidentID) => {
    await writeLog(path.join(LOG_DIR, 'Unknown_Errors.log'), {
        date: new Date().toLocaleDateString(),
        time: formatTime(),
        incident: incidentID,
        error
    });
    return `Unknown Error: ${error}`;
};

const createErrorEmbed = (error, incidentID, errorType, user, guild) => {
    const userInfo = errorType === 'Command' ? `\nUser: ${user.username}` : '';
    const guildInfo = errorType === 'Command' ? `\nGuild: ${guild.name}` : '';
    return new EmbedBuilder()
        .setAuthor({ name: `Error Log` })
        .setTitle(`Date: ${new Date().toLocaleDateString()}\nTime: ${time()} (AEST)\nIncident: ${incidentID}${guildInfo}${userInfo}\nType: ${errorType}`)
        .setDescription(`\`\`\`yaml\n${error.toString().replace(/```/g, '`')}\`\`\``)
        .setColor(Colors.Red)
        .setTimestamp();
};

const createUserErrorResponse = (client, incidentID, errorType, user) => {
    const userInfo = user ? `\n> User: ${user.username}` : '';
    const supportButton = new ButtonBuilder()
        .setLabel('Support Guild')
        .setStyle(ButtonStyle.Link)
        .setURL(client.settings.bot.supportGuild);
    const components = [];
    if (supportButton) components.push(supportButton);
    const buildMainText = () => {
        return (
            `There has been an error!\nThis has been reported to my developers.\n` +
            `**Incident Information:**\n` +
            `> Date: ${new Date().toLocaleDateString()}\n` +
            `> Time: ${formatTime()} (AEST)\n` +
            `> Incident: ${incidentID}${userInfo}\n` +
            `> Type: ${errorType}`
        );
    };
    const embed = new EmbedBuilder()
        .setAuthor({ name: `${client.settings.bot.name} • Error Occurred` })
        .setTitle(`${buildMainText()}`)
        .setColor(Colors.Red)
        .setTimestamp();    
    const actionRow = new ActionRowBuilder();
    if (components.length > 0) {
        actionRow.addComponents(components);
    }    
    return {
        embed,
        components: components.length > 0 ? [actionRow] : []
    };
};

module.exports = async (client, error, interaction, errorType = 'Unknown') => {
    if (!error) return;
    const incidentID = Math.random().toString(36).substr(2);
    const user = interaction && interaction.user ? interaction.user : null;
    const guild = interaction && interaction.guild ? interaction.guild : null;
    try {
        switch (errorType) {
            case 'Command':
                await handleCommandError(error, incidentID, user);
                break;
            case 'Event':
                await handleEventError(error, incidentID);
                break;
            default:
                await handleUnknownError(error, incidentID);
        }
        if (interaction && interaction.reply && !interaction.replied && !interaction.deferred) {
            const { embed, components } = createUserErrorResponse(client, incidentID, errorType, user);
            await interaction.reply({
                embeds: [embed],
                components: components,
                flags: MessageFlags.Ephemeral
            });
        }
        let fetchedChannel = null;
        try {
            fetchedChannel = client.channels.cache.get(client.settings.channels.errors);
            if (fetchedChannel) {
                const errorEmbed = createErrorEmbed(error, incidentID, errorType, user, guild);
                await fetchedChannel.send({
                    embeds: [errorEmbed]
                });
            }
        } catch (err) {
            logger.error('ErrorHandler', `Failed to handle error channel operations: ${err}`);
        }
    } catch (handlingError) {
        logger.error('ErrorHandler', `Error while handling error: ${handlingError}`);
    }
};