# discord.js-Template

A **Discord.js v14 slash-command template** built for clarity, scalability, and predictable execution.

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
    "token": "YOUR_BOT_TOKEN",
    "id": "YOUR_APPLICATION_ID",
    "name": "YourBotName",
    "developer": ["YOUR_DISCORD_ID"],
    "maintenanceMode": false,
    "embedColor": "#5865F2"
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

Commands live in `Commands/<Category>/<Command>.js`.

### Example Command

```js
module.exports = {
  name: "hello",
  description: "Replies with a greeting.",
  disabled: false,

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

## License

MIT
