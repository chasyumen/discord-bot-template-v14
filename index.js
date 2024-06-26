import dotenv from 'dotenv';

dotenv.config();

import * as Discord from "discord.js";

global.Discord = Discord;
import ShardingManager from "./src/managers/ShardingManager.js";
const shards = new ShardingManager("./bot/index.js");
process.on("uncaughtException", console.error);
process.on("unhandledRejection", console.error);

shards.shardInitDone = 0;
shards.exited = 0;
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
		// shards.log("DEBUG", message)
		if (message.type == "shardInitDone") {
			shards.shardInitDone = shards.shardInitDone+1;
		} else if (message.type == "shutdownSignal") {
			shards.log("LOG", "shutting down")
			shards.shards.map((shard) => shard.send({ type: "shutdown" }));
			await new Promise((resolve) => {
				test();
				function test() {
					if (shards.exited == shards.shards.size) {
						resolve();
					} else {
						setTimeout(test, 200);
					}
				}
			});
			shards.log("LOG", "shutdown process completed")
			process.exit();
		} else if (message.type == "exited") {
			shards.exited = shards.exited+1;
		}
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
	shards.log("DEBUG", "allShardsCreated")
	await new Promise((resolve) => {
		test();
		function test() {
			if (shards.shardInitDone == shards.shards.size) {
				resolve();
			} else {
				setTimeout(test, 200);
			}
		}
	});
	shards.log("LOG", "all shards are now active")
	await fetchGuilds();
	shards.fetchGuildsInterval = setInterval(fetchGuilds, 20000);
	shards.shards.map((shard) => shard.send({ type: "allShardsReady", data: shards.shards.size }));
})();