export const id = "test";
export const name = "てすとwww";
export const descriptions = {
    en_US: "Shows list commands",
    ja: "コマンド一覧を表示します。"
};
export const commandType = "3"; //2: user, 3: message,
export const dm = false;
export const permissions = {
    internal: [],
    botNeededInChannel: 0n,
    botNeededInGuild: 0n,
    userNeeded: 0n,
}
export async function exec (cmd) {
    cmd.reply("?")
}