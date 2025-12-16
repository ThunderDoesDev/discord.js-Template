const {
    ButtonBuilder,
    ButtonStyle,
    Colors,
    EmbedBuilder
} = require('discord.js');

module.exports.run = async (client, message, args) => {
    try {
        if (message.content === `<@${client.user.id}>` || message.content === `<@!${client.user.id}>`) {
            if (!message.author.bot) {
                const supportButton = new ButtonBuilder().setURL(`${client.settings.bot.supportGuild}`).setLabel('Support Server').setStyle(ButtonStyle.Link);
                const embed = new EmbedBuilder()
                    .setTitle(`Hello there, I'm ${client.user.username}.`)
                    .setDescription("I am your assistant, how can I help you today?")
                    .addFields({
                        name: `**Commands:**`,
                        value: `Use help command to see all commands.`
                    })
                    .setColor(client.settings.bot.embedColor)
                    .setFooter({
                        text: client.footer
                    })
                    .setThumbnail(client.user.displayAvatarURL({
                        dynamic: true
                    }))
                    .setTimestamp();
                return message.reply({
                    embeds: [embed],
                    components: [supportButton]
                });
            }
        }
    } catch (error) {
        return client.errors(client, error.stack, message, 'Event');
    }
};