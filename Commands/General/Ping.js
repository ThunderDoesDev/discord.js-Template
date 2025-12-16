const {
    EmbedBuilder,
    Colors,
} = require("discord.js");

module.exports = {
    name: "ping",
    description: "Displays the bot's ping and latency information.",
    cooldowns: 3,
    usage: [],
    disabled: true,
    permissions: {
        client: [],
        user: [],
        staff: {
            developers: false
        }
    },
    run: async (client, interaction, args) => {
        try {
            const embed = new EmbedBuilder()
                .setTitle(`${client.settings.bot.name} • Bot Ping`)
                .addFields({
                    name: `**Websocket Ping:**`,
                    value: `\`${Math.round(client.ws.ping)}ms\``,
                    inline: true
                }, {
                    name: `**Latency:**`,
                    value: `\`${Date.now() - interaction.createdTimestamp}ms\``,
                    inline: true
                })
                .setColor(client.settings.bot.embedColor)
                .setFooter({
                    text: client.footer
                })
            return interaction.reply({
                embeds: [embed]
            });
        } catch (error) {
            return client.errors(client, error.stack, interaction, 'Command');
        }
    }
};