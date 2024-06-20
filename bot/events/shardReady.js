import { readFileSync } from "fs";
import formatLogger from "../../src/utils/formatLogger.js";

export const name = "shardReady";
export const event = "shardReady";
export const once = true;

export async function run(shardId) {
    client.shardId = shardId;
    client.log = formatLogger(`SHARD${client.shardId}`);
    client.log("LOG", `SID: ${shardId} | Process Online with ${client.user.tag}`);
    client.user.presence.set({
        activities: [{ name: `Initializing (2/2) | Version: ${JSON.parse(readFileSync("./package.json").toString()).version}`, type: 0 },],
        status: "online",
        shardId: Number(shardId)
    });
    await client.application.commands.fetch();
    if (shardId == 0) {
        await client.commands.slashReg();
        client.isCommandRegistrationFinished = true;
        client.log("LOG", `Initializing process completed.`);
    } else {
        client.log("LOG", `Initializing process skipped.`);
    }
    client.guilds.count = client.guilds.cache.size;
    client.isCommandRegistrationFinished = true;
    // console.log(client.locale.getString("test2", "ja"))
    var number = 0;
    // setPresence();
    // setInterval(setPresence, 5000);
    // // client.fetchClientValues("client.guilds.cache.size");
    client.user.presence.set({
        activities: [{ name: `${client.guilds.count}guilds| Shard: ${client.shardId}(${client.shardId+1}/${client.shard.count}) | Pre`, type: 0 }],
        status: "online",
        shardId: client.shardId
    });
    // async function setPresence() {
    //     var presences = [
    //         { name: `${client.guilds.cache.size}, ShardID: ${client.shardId}, Total Shards: ${client.shardId+1}/${client.shard.count}`, type: 0 },
    //         // { name: `Discord Bot Template v14 | Version: ${JSON.parse(readFileSync("./package.json").toString()).version}`, type: 0 },
    //         // { name: `Discord Bot Template v14 | Version: ${JSON.parse(readFileSync("./package.json").toString()).version}`, type: 0 },
    //         // { name: `Under Testing | Version: ${JSON.parse(readFileSync("./package.json").toString()).version}`, type: 0 },
    //     ]
    //     if (number >= (presences.length - 1)) {
    //         number = 0;
    //     } else {
    //         number++;
    //     }
    //     // console.log(presences[number])
    //     client.user.presence.set({
    //         activities: [presences[number]],
    //         status: "online",
    //         shardId: client.shardId
    //     });
    // }
}