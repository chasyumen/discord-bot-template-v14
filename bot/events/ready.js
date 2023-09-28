module.exports.name = "ready";
module.exports.event = "ready";

module.exports.run = async function () {
    console.log(`The bot has been logged in as ${client.user.tag}.`);
    await client.application.commands.fetch();
    // await async2.eachSeries(client.application.commands.cache.toJSON(), async (cmd) => {
    //     if (cmd.type !== "CHAT_INPUT") return;
    //     var command = client.commands.toJSON().find(x => x.name == cmd.name);
    //     if (!command) {
    //         await cmd.delete();
    //     } else if (command.disableSlash === true) {
    //         await cmd.delete();
    //     }
    //     return true;
    // });
    // await async2.eachSeries(client.commands.toJSON(), async (cmd) => {
    //     var set = false;
    //     var command = client.application.commands.cache.find(x => x.name == cmd.name);
    //     if (typeof command == "object") {
    //         var descriptionParsed = `${cmd.description.en_US} / ${cmd.description.ja}`;
    //         if (descriptionParsed !== command.description) {
    //             set = true;
    //         } else if (cmd.slashOptions.options) {
    //             if (cmd.slashOptions.options.length !== command.options.length) {
    //                 set = true;
    //             }
    //         } else if (!cmd.slashOptions.options && command.options.length >= 1) {
    //             set = true;
    //         }
    //     } else {
    //         set = true;
    //     }

    //     if (cmd.disableSlash) {
    //         set = false;
    //     }
    //     // console.log(command, "\n", set, "\n", cmd)

    //     var commandData = cmd.slashOptions;
    //     commandData["name"] = cmd.name;
    //     commandData["description"] = `${descriptionParsed}`;
    //     if (set) {
    //         if (command) {
    //             await command.delete();
    //         }
    //         await client.application.commands.create(commandData);
    //     }
    //     return true;
    // });
    // console.log(client.locale.getString("test2", "ja"))
    var number = 0;
    setPresence();
    setInterval(setPresence, 10000);
    async function setPresence() {
        var presences = [
            { name: `Discord Bot Template v14 | Version: ${require("../../package.json").version}`, type: 0 },
            { name: `Under Testing | Version: ${require("../../package.json").version}`, type: 0 },
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