# discord.js-Template

A **Discord.js v14 slash-command template** built for clarity, scalability and predictable execution.

This template is designed around:
- guard-first execution
- flat logic
- modular loading
- centralised utilities
- optional sharding
- reusable response helpers

---

## 📌 Table of Contents  

- [discord.js-Template](#discordjs-template)  
  - [Requirements](#requirements)  
  - [Project Structure](#project-structure)  
  - [Setup](#setup)  
    - [Install dependencies](#install-dependencies)  
    - [Configure the bot](#configure-the-bot)  
  - [Running the Bot](#running-the-bot)  
  - [Commands](#commands)  
    - [Example Command](#example-command)  
  - [Responses Helper](#responses-helper)  
  - [Modules](#modules)  
  - [Advanced Pagination](#advanced-pagination)  
    - [Example Pagination Command (Guilds)](#example-pagination-command-guilds)  
  - [Support](#support)  
  - [License](#license)  

---

## Requirements

- Node.js (LTS recommended)
- A Discord application + bot
- A Discord server for testing

---

## Project Structure

.
├─ Commands/
│  ├─ Developer/
│  │  └─ Guilds.js
│  └─ General/
│     ├─ Help.js
│     ├─ Ping.js
│     └─ Uptime.js
│
├─ Events/
│  ├─ Client/
│  │  └─ ClientReady.js
│  │
│  ├─ Interactions/
│  │  └─ InteractionCreate.js
│  │
│  ├─ Messages/
│  │  └─ MessageCreate.js
│  │
│  └─ Sharding/
│     ├─ ShardCreate.js
│     ├─ ShardDisconnect.js
│     ├─ ShardError.js
│     ├─ ShardReconnect.js
│     └─ ShardResume.js
│
├─ Logs/
│
├─ Settings/
│  └─ Config.json
│
├─ Utils/
│  ├─ Errors.js
│  ├─ Handlers.js
│  ├─ Logger.js
│  ├─ Modules.js
│  ├─ Responses.js
│  └─ Pagination.js
│
├─ Bot.js
├─ Sharding.js
├─ package.json
└─ start.bat

---

## Setup

### Install dependencies

```bash
npm install
```

### Configure the bot

Edit `Settings/Config.json`:

```json
{
  "bot": {
    "token": "your_bot_token",
    "id": "your_bot_id",
    "name": "your_bot_name",
    "supportGuild": "your-support-guild-id",
    "invite": "your-invite-link",
    "vote": "your-vote-link",
    "maintenanceMode": false,
    "debugMode": false,
    "ourGuilds": ["your-guild-id"],
    "embedColor": "your-embed-color"
  },
  "channels": {
    "errors": "your-errors-channel-id",
    "guilds": "your-guilds-channel-id",
    "commands": "your-commands-channel-id",
    "journal": "your-journal-channel-id"
  }
}
```

---

## Running the Bot

```bash
node Bot.js
```

Optional sharding:

```bash
node Sharding.js
```

---

## Commands

Commands live in `Commands/<Category>/`

### Example Command

```js
module.exports = {
  name: "hello",
  description: "Replies with a greeting.",
  cooldowns: 3,
  usage: [],
  disabled: false,
  permissions: {
    client: [],
    user: [],
    staff: {
      developers: false
    }
  },
  run: async (client, interaction) => {
    return interaction.reply("Hello!");
  }
};
```

---

## Responses Helper

Use responses as **early-return guards** or reusable replies.

```js
if (!value) return client.responses("Commands.General.missingValue", interaction);
```

Defined in `Utils/Responses.js`.

---

## Modules

Modules provide central access to reusable packages and utilities, attatched to the Discord client at startup.  
Defined in:

```
Utils/Modules.js
```

Modules currently bundled:

- discord.js  
- cfonts  
- chalk  
- fs  
- util.inspect  
- moment  

Attached during client init:

```js
client.modules = require("./Utils/Modules.js");
```

Usage example:

```js
client.modules.chalk.blue("Bot is online!");
client.modules.fs.readdirSync("./Commands");
client.modules.inspect(client);
```

This avoids requiring the same packages repeatedly throughout the bot and keeps logic clean and centralised.

All Commands, Events and Utils that use imports now use them directly from `client.modules`.

---

## Advanced Pagination

An advanced pagination utility is available for building multi-page embeds that scroll through items such as guilds, users, roles, or any other dataset.

### Example Pagination Command (Guilds)

Located at:

```
Commands/Developer/Guilds.js
```

This command lists all guilds the bot is in using the built-in pagination system.  

```js
module.exports = {
  name: "guilds",
  description: "Lists guilds the bot is in (paginated).",
  cooldowns: 5,
  usage: [],
  disabled: false,
  permissions: {
    client: [],
    user: [],
    staff: {
      developers: true
    }
  },

  run: async (client, interaction) => {

    const guilds = client.guilds.cache.map(guild => {
      const owner = client.users.cache.get(guild.ownerId);
      return {
        name: guild.name,
        id: guild.id,
        owner: owner ? owner.username : "Unknown",
        memberCount: guild.memberCount
      };
    });

    const embedGenerator = (pageGuilds, currentPage, totalPages) => {
      let description = "";

      pageGuilds.forEach(guild => {
        description += `• **${guild.name}** — ${guild.owner} — ${guild.memberCount} members\n`;
      });

      return {
        title: `${interaction.guild?.name || client.user.username} • Guilds`,
        description,
        footer: { text: `Page ${currentPage} of ${totalPages}` },
        thumbnail: client.user.displayAvatarURL({ dynamic: true }),
        color: client.settings.bot.embedColor
      };
    };

    await client.pagination.createPagination({
      client,
      items: guilds,
      itemsPerPage: 5,
      embedGenerator,
      interaction,
      timeout: 1000 * 60 * 5,
      ephemeral: false,
      emptyOptions: {
        color: client.modules.discord.Colors.Red,
        title: "No Guilds",
        description: "No guilds were found for this bot."
      }
    });
  }
};
```

---

## Support

For support, issues, or enhancements, please open an issue in this repository or join our discord support server.

[Join Support Server](https://discord.gg/thunderdoesdev)

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
