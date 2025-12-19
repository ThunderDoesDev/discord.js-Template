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
            const embedGenerator = (pageGuilds, currentPage, totalPages) => {
				let description = '';
				pageGuilds.forEach(guild => {
					description += `• ${guild.name} — ${guild.owner} - ${guild.memberCount}\n`;
				});
				return {
					title: `${interaction.guild.name} • Guilds`,
					description: description,
					footer: {
						text: `Page ${currentPage} of ${totalPages}`
					},
					thumbnail: client.user.displayAvatarURL({
						dynamic: true
					}),
					color: client.settings.bot.embedColor
				};
			};
			await client.pagination.createPagination({
				client,
				items: guilds,
				itemsPerPage: 5,
				embedGenerator,
				interaction,
				timeout: 1000000,
				ephemeral: false,
				emptyOptions: {
					color: client.modules.discord.Colors.Red,
					title: 'No Guilds',
					description: 'No guilds were found for this server.'
				}
			});
        } catch (error) {
            client.errors(client, error, interaction, 'Command');
        }
    }
};