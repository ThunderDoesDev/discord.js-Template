const {
    ShardingManager
} = require('discord.js');
const {
    log,
    error
} = require("./Utils/Logger");
const config = require("./Settings/Config.json");
const Events = require('./Utils/Handlers');

const manager = new ShardingManager('./Bot.js', {
    token: config.bot.token,
    totalShards: 'auto',
    mode: 'process',
    respawn: true,
    timeout: -1,
    shardList: 'auto',
    execArgv: ['--trace-warnings'],
    spawnTimeout: 300000,
});

Events.eventsLoader(manager, './Events/Sharding');

(async () => {
    try {
        await manager.spawn();
        log("SHARDING MANAGER", "All shards spawned successfully");
    } catch (err) {
        error("SHARDING MANAGER", `Failed to spawn shards: ${err.message}`);
        process.exit(1);
    }
})();