import dotenv from 'dotenv';

dotenv.config();

import * as Discord from "discord.js";

global.Discord = Discord;
import ShardingManager from "./src/managers/ShardingManager.js";
const shards = new ShardingManager("./bot/index.js");
process.on("uncaughtException", console.error);
process.on("unhandledRejection", console.error);

shards.on("shardCreate", shard => {
	// Listeing for the ready event on shard.
	console.log("shard create")
	shard.on("ready", async () => {

	});
	shard.on("message", async (message) => {
		if (!message) return;
		if (typeof message !== "object") return;
		if (!message.type) return;
	});
});
(async () => {
	// await database.connect(process.env.MONGO_URL);
	await shards.start();
})();