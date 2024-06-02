export const name = "test";
export const descriptions = {
    en_US: "test",
    ja: "test"
};
export const category = "dev";
export const aliases = ["test2"];
export const hide = true;
export const disableSlash = false;
export const slashOptions = {};
export const permissions = {
    bUser: ["TESTER"],
    dBotNeeded: 8n,
    dGuildMember: 8n,
}
export async function exec (cmd) {
    cmd.reply("test done!");
    // console.log(cmd);
}