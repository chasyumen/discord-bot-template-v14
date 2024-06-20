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
	shards.log("LOG", "shard create: ", shard.id);
	// console.log("shard create");
	shard.on("ready", async () => {
		// shard.send({type: "shardId", data: shard.id});
		// console.log("shardid", shard.id);
		// shard.send({type: "shardId", data: shard.id});
	});
	shard.on("message", async (message) => {
		if (!message) return;
		if (typeof message !== "object") return;
		if (!message.type) return;
	});
});

async function fetchGuilds() {
	var guilds = await shards.fetchClientValues("guilds.cache.size").then((shardGuilds) => {return shardGuilds.reduce((a, b) => {return a + b})});
	shards.shards.map((shard) => shard.send({ type: "guildCount", data: guilds }));
	// console.log(guilds);
}

(async () => {
	// await database.connect(process.env.MONGO_URL);
	// await shards.start({amount: 3, delay: 5000});
	await shards.start();
	await fetchGuilds();
	shards.fetchGuildsInterval = setInterval(fetchGuilds, 20000);
	shards.shards.map((shard) => shard.send({ type: "allShardsReady" }));
})();