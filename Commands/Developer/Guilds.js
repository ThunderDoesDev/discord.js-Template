const {
    EmbedBuilder,
    Colors
} = require('discord.js');

module.exports = {
    name: "guilds",
    description: "Sends you a detailed list of the bot's guilds.",
    cooldowns: 3,
    usage: [],
    disabled: false,
    permissions: {
        client: [],
        user: [],
        staff: {
            developers: true
        }
    },
    run: async (client, interaction, args) => {
        try {
            const guilds = client.guilds.cache.map(guild => {
                const owner = client.users.cache.get(guild.ownerId);
                return {
                    name: guild.name,
                    id: guild.id,
                    owner: owner ? owner.username : 'Unknown',
                    memberCount: guild.memberCount
                }
            });
            const embed = new EmbedBuilder()
                .setTitle(`${client.settings.bot.name} • Guilds`)
                .setDescription(guilds.map(guild => `**${guild.name}** - ${guild.owner} - ${guild.memberCount}`).join('\n'))
                .setColor(client.settings.bot.embedColor)
                .setFooter({
                    text: client.footer
                })
                .setTimestamp();
            return interaction.reply({
                embeds: [embed]
            });
        } catch (error) {
            client.errors(client, error, interaction, 'Command');
        }
    }
};