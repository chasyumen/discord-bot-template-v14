import { Client, Collection } from "discord.js";
import LocaleManager from "../managers/LocaleManager.js";
import EventManager from "../managers/EventManager.js";
import CommandManager from "../managers/CommandManager.js";
import ContextMenuManager from "../managers/ContextMenuManager.js";
import MessageComponentManager from "../managers/MessageComponentManager.js";
import formatLogger from "../utils/formatLogger.js";
// const MessageComponentManager = require("../managers/MessageComponentManager.js");
// const VoiceManager = require("../managers/VoicePlayerManager.js");
import Database from "../database/index.js";
// const CooldownManager = require("../managers/CooldownManager.js");

export default class CustomClient extends Client {
    constructor(options) {
        super(options);
        this.config = options.botConfig;
        this.locale = new LocaleManager(this);
        this.events = new EventManager(this);
        this.commands = new CommandManager(this);
        this.contextMenus = new ContextMenuManager(this);
        this.isCommandRegistrationFinished = undefined;
        this.messageComponents = new MessageComponentManager(this);
        this.allShardsReady = false;
        this.presenceUpdater = false;
        this.log = formatLogger("BOT")
        // this.cooldowns = new CooldownManager(this);
        this.db = new Database();
        // this.players = new VoiceManager(this);
    }

    async start(token) {
        await this.locale.loadAll();
        await this.commands.loadAll();
        await this.contextMenus.loadAll();
        this.isCommandRegistrationFinished = false;
        await this.messageComponents.loadAll();
        await this.events.loadAll();
        if (process.env.MONGO_URL) {
            await this.db.connect(process.env.MONGO_URL);
            await this.db.load_models();
            if (this.config.dbCache) {
                await this.db.saveCache();
                this.db.cacheInterval = setInterval(async () => { this.db.saveCache() }, 20000);
            }
        } else {
            console.error(new Error("Database url not set continuing without it."));
        }
        
        return await this.login(token);
    }
}