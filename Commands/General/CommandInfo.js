module.exports = {
    name: "commandinfo",
    description: "Displays the information of a command.",
    cooldowns: 3,
    usage: ["/commandinfo <command>"],
    disabled: false,
    permissions: {
        client: [],
        user: [],
        staff: {
            developers: false
        }
    },
    options: [{
        name: "command",
        description: "The command to get information about.",
        type: 3,
        required: true
    }],
    run: async (client, interaction, args) => {
        try {
            const commandInput = interaction.options.getString("command");
            if (!commandInput) {
                return client.responses('Commands.CommandInfo.noCommandMatching', interaction);
            }
            let foundCommand = client.slash.get(commandInput.toLowerCase());
            if (!foundCommand) {
                foundCommand = client.slash.find(cmd => cmd && cmd.name && cmd.name.toLowerCase() === commandInput.toLowerCase());
            }
            if (!foundCommand && commandInput.includes('-')) {
                const [category, cmdName] = commandInput.toLowerCase().split('-');
                foundCommand = client.slash.get(`${category}-${cmdName}`);
            }
            if (!foundCommand) {
                return client.responses('Commands.CommandInfo.noCommandMatching', interaction);
            }
            const cmdName = foundCommand.name;
            const categoryName = foundCommand.category ? foundCommand.category.charAt(0).toUpperCase() + foundCommand.category.slice(1).toLowerCase() : "None";
            const cmdCategory = foundCommand.category ? `\`${foundCommand.category}\`` : "`None`";
            const cmdDescription = foundCommand.description ? `\`${foundCommand.description}\`` : "`None`";
            const usage = foundCommand.usage && foundCommand.usage.length > 0 ? `\`${foundCommand.usage.join(", ")}\`` : "`None`";
            const cooldowns = foundCommand.cooldowns ? `\`${foundCommand.cooldowns} seconds\`` : "`None`";
            const botPermissions = foundCommand.permissions.client && foundCommand.permissions.client.length > 0 ?
                foundCommand.permissions.client.map(perm => {
                    const permBits = new client.modules.discord.PermissionsBitField(perm);
                    return `\`${permBits.toArray().join(', ')}\``;
                }).join("\n") : "`None`";
            const userPermissions = foundCommand.permissions.user && foundCommand.permissions.user.length > 0 ?
                foundCommand.permissions.user.map(perm => {
                    const permBits = new client.modules.discord.PermissionsBitField(perm);
                    return `\`${permBits.toArray().join(', ')}\``;
                }).join("\n") : "`None`";
            const developerCheck = foundCommand.permissions.staff.developers ? '<:yes:1452183820085366867>' : '<:no:1452183796903317524>';
            const disabledCheck = foundCommand.disabled ? '<:yes:1452183820085366867>' : '<:no:1452183796903317524>';
            const embed = new client.modules.discord.EmbedBuilder()
                .setTitle(`${client.settings.bot.name} • ${cmdName} - ${categoryName} Information`)
                .addFields({
                    name: `**Command Category:**`,
                    value: `\`${cmdCategory}\``
                }, {
                    name: `**Command Description:**`,
                    value: `\`${cmdDescription}\``
                }, {
                    name: `**Command Usage:**`,
                    value: `\`${usage}\``
                }, {
                    name: `**Command Cooldowns:**`,
                    value: `\`${cooldowns}\``
                }, {
                    name: `**Command Bot Permissions:**`,
                    value: `\`${botPermissions}\``
                }, {
                    name: `**Command User Permissions:**`,
                    value: `\`${userPermissions}\``
                }, {
                    name: `**Developer Only:**`,
                    value: `${developerCheck}`
                }, {
                    name: `**Disabled:**`,
                    value: `${disabledCheck}`
                })
                .setColor(client.settings.bot.embedColor)
                .setThumbnail(client.user.displayAvatarURL({
                    dynamic: true
                }))
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