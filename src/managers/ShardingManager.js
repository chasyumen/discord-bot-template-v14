import { ShardingManager } from "discord.js";
import formatLogger from "../utils/formatLogger.js";

export default class BotShardingManager extends ShardingManager{
    constructor(...options) {
        super(...options);
        this.log = formatLogger("MANAGER")
    }

    async start(...data) {
        return this.spawn(...data);
    }
}