import { readFileSync } from "fs";

export const name = "statusUpdate";
export const event = "statusUpdate";
export const once = true;

export async function run() {
    // if (!client.allShardsReady) return;
    // if (client.presenceUpdater) return;
    // client.presenceUpdater = true;
    // console.log(`shardAll.log${client.shardId}`);
    var number = 0;
    
    client.presenceUpdater = setTimeout(() => {
        setPresence();
        setInterval(setPresence, 10000);
    }, 2000*client.shardId);
    // // client.fetchClientValues("client.guilds.cache.size");
    // client.user.presence.set({
    //     activities: [{ name: `${client.guilds.count}guilds| Shard: ${client.shardId}(${client.shardId+1}/${client.shard.count}) | preparing`, type: 0 }],
    //     status: "online",
    //     shardId: client.shardId
    // });
    async function setPresence() {
        var presences = [
            { name: `${client.guilds.count} guilds| Shard: ${client.shardId} (${client.shardId+1}/${client.shard.count}) | Ready`, type: 0 },
            { name: `Discord Bot Template v14 | Version: ${JSON.parse(readFileSync("./package.json").toString()).version}`, type: 0 },
            // { name: `Discord Bot Template v14 | Version: ${JSON.parse(readFileSync("./package.json").toString()).version}`, type: 0 },
            // { name: `Under Testing | Version: ${JSON.parse(readFileSync("./package.json").toString()).version}`, type: 0 },
        ]
        if (number >= (presences.length - 1)) {
            number = 0;
        } else {
            number++;
        }
        // console.log(presences[number])
        client.user.presence.set({
            activities: [presences[number]],
            status: "online",
            shardId: client.shardId
        });
    }
}