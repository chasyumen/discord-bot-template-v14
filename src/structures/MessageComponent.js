import MessageComponentExecute from "./MessageComponentExecute.js";

export default class MessageComponent {
    constructor(cmd) {
        this.name = cmd.name;
        this.id = cmd.id;
        this.hide = cmd.hide;
        this.type = cmd.type;
        this.permissions = cmd.permissions;
        this.exec = cmd.exec;
    }

    executor(raw, info) {
        return new MessageComponentExecute(this, raw, info);
    }
}