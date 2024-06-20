export const name = "processMessage";
export const event = "processMessage";
export const once = false;

export async function run (msg) {
    if (typeof msg !== "object") return;
    if (!msg.type) return;
    if (msg.type == "guildCount") {
        client.guilds.count = msg.data;
        return;
    } else if (msg.type == "shardId") {
        client.shardId = msg.data;
        return;
    } else if (msg.type == "allShardsReady") {
        client.emit("allShardsReady");
        return;
    } 
}