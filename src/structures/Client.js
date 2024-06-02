import { Client, Collection } from "discord.js";
import LocaleManager from "../managers/LocaleManager.js";
import EventManager from "../managers/EventManager.js";
import CommandManager from "../managers/CommandManager.js";
// const MessageComponentManager = require("../managers/MessageComponentManager.js");
// const VoiceManager = require("../managers/VoicePlayerManager.js");
// const Database = require("../database/index.js");
// const CooldownManager = require("../managers/CooldownManager.js");

export default class CustomClient extends Client {
    constructor(options) {
        super(options);
        this.locale = new LocaleManager(this);
        this.events = new EventManager(this);
        this.commands = new CommandManager(this);
        // this.messagecomponents = new MessageComponentManager(this);
        // this.cooldowns = new CooldownManager(this);
        // this.db = new Database();
        // this.players = new VoiceManager(this);
    }

    async start(token) {
        await this.locale.loadAll();
        await this.commands.loadAll();
        // await this.messagecomponents.loadAll();
        await this.events.loadAll();
        // await this.db.connect(process.env.MONGO_URL);
        // await this.db.load_models();
        // await this.db.saveCache();
        // this.db.cacheInterval = setInterval(async () => { this.db.saveCache() }, 5000);
        return await this.login(token);
    }
}