export const name = "test3";
export const descriptions = {
    en_US: "test",
    ja: "test"
};
export const category = "dev";
// export const aliases = [];
export const commandType = "1"; //1: BaseCommand, 2: SubCommand, 3: SubCommandGroup
export const parentCommand = null;
export const parentGroup = null;
export const hide = true;
export const isNsfw = false;
export const slashOptions = [];
export const permissions = {
    internal: ["Tester"],
    botNeededInChannel: 0n,
    botNeededInGuild: 8n,
    userNeeded: 8n,
}
export async function exec (cmd) {
    cmd.reply("test done!");
    // console.log(cmd);
}