import { ShardingManager } from "discord.js";

export default class BotShardingManager extends ShardingManager{
    constructor(...options) {
        super(...options);
    }

    async start(...data) {
        return this.spawn(...data);
    }
}