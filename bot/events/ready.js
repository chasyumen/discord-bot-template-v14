import { readFileSync } from "fs";

export const name = "ready";
export const event = "ready";

export async function run () {
    console.log(`The bot has been logged in as ${client.user.tag}.`);
    client.user.presence.set({
        activities: [{ name: `Initializing (2/2) | Version: ${JSON.parse(readFileSync("./package.json").toString()).version}`, type: 0 },],
        status: "online"
    });
    await client.application.commands.fetch();
    await client.commands.slashReg();
    client.isCommandRegistrationFinished = true;
    // console.log(client.locale.getString("test2", "ja"))
    var number = 0;
    setPresence();
    setInterval(setPresence, 10000);
    async function setPresence() {
        var presences = [
            { name: `Discord Bot Template v14 | Version: ${JSON.parse(readFileSync("./package.json").toString()).version}`, type: 0 },
            { name: `Under Testing | Version: ${JSON.parse(readFileSync("./package.json").toString()).version}`, type: 0 },
        ]
        if (number >= (presences.length - 1)) {
            number = 0;
        } else {
            number++;
        }
        // console.log(presences[number])
        client.user.presence.set({
            activities: [presences[number]],
            status: "online"
        });
    }
}