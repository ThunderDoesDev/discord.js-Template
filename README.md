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

## Requirements

- Node.js (LTS recommended)
- A Discord application + bot
- A Discord server for testing

---

## Project Structure

```
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
│  └─ Responses.js
│
├─ Bot.js
├─ Sharding.js
├─ package.json
└─ start.bat
```

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

## Support

For support, issues, or enhancements, please open an issue in this repository or join our discord support server.

[Join Support Server](https://discord.gg/thunderdoesdev)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.