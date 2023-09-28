const { ShardingManager } = require("discord.js");

module.exports = class BotShardingManager extends ShardingManager{
    constructor(...options) {
        super(...options);
    }

    async start(...data) {
        return this.spawn(...data);
    }
}