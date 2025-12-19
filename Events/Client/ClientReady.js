async function updateStatus(client) {
    const statuses = [
        `${client.users.cache.size} Users`,
        `${client.shard.ids} Shards`,
        `${client.guilds.cache.size} Guilds`
    ];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    client.user.setPresence({
        activities: [{
            name: status,
            state: status,
            type: client.modules.discord.ActivityType.Custom
        }],
        status: 'online'
    });
}

module.exports.run = async (client) => {
    try {
        client.handlers.loadSlashCommands(client);
        await updateStatus(client);
        setInterval(() => updateStatus(client), 100000);
        if (client.shard.ids.includes(client.shard.count - 1)) {
            const resultG = await client.shard.broadcastEval(client => client.guilds.cache.size);
            const memberNum = await client.shard.broadcastEval(client => client.users.cache.size);
            const totalGuilds = resultG.reduce((prev, guildCount) => prev + guildCount, 0);
            const totalMembers = memberNum.reduce((prev, memberCount) => prev + memberCount, 0);
            let journalChannel = client.channels.cache.find(chan => chan.id === client.settings.channels.journal) || null;
            if (journalChannel) {
                const embed = new client.modules.discord.EmbedBuilder()
                    .setTitle(`${client.user.username} • Ready & Online`)
                    .addFields({
                        name: `**Total Members:**`,
                        value: `${totalMembers}`
                    })
                    .addFields({
                        name: `**Total Guilds:**`,
                        value: `${totalGuilds}`
                    })
                    .addFields({
                        name: `**Total Shards:**`,
                        value: `${client.shard.ids.join(', ')}`
                    })
                    .setColor(client.settings.bot.embedColor)
                    .setFooter({
                        text: client.footer
                    })
                    .setThumbnail(client.user.displayAvatarURL({
                        dynamic: true
                    }))
                    .setTimestamp();
                await journalChannel.send({
                    embeds: [embed]
                });
            }
            client.logger.log('WHO AM I', `Logged In As ${client.user.tag}`);
            client.logger.log("STATS", `${totalGuilds > 1 ? `${totalGuilds} Guilds` : `${totalGuilds} Guild`}, ${totalMembers > 1 ? `${totalMembers} Users` : `${totalMembers} User`}`);
            client.logger.log("SHARDING MANAGER", `All Shards (${client.shard.ids.join(', ')}) Loaded.`);
            client.logger.log("CONNECTED", "Connected To Discord's V10 Gateway");
        }
    } catch (error) {
        return client.errors(client, error.stack, null, 'Event');
    }
}