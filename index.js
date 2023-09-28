require('dotenv').config();

const Discord = (global.Discord = require("discord.js"));
const ShardingManager = require("./src/managers/ShardingManager.js");
const shards = new ShardingManager("./bot/index.js");
process.on("uncaughtException", console.error);
process.on("unhandledRejection", console.error);

shards.on("shardCreate", shard => {
	// Listeing for the ready event on shard.
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