const { Client, Collection } = require("discord.js");
const LocaleManager = require("../managers/LocaleManager.js");
const EventManager = require("../managers/EventManager.js");
// const CommandManager = require("../managers/CommandManager.js");
// const MessageComponentManager = require("../managers/MessageComponentManager.js");
// const VoiceManager = require("../managers/VoicePlayerManager.js");
// const Database = require("../database/index.js");
// const CooldownManager = require("../managers/CooldownManager.js");

module.exports = class CustomClient extends Client {
    constructor(options) {
        super(options);
        this.locale = new LocaleManager(this);
        this.events = new EventManager(this);
        // this.commands = new CommandManager(this);
        // this.messagecomponents = new MessageComponentManager(this);
        // this.cooldowns = new CooldownManager(this);
        // this.db = new Database();
        // this.players = new VoiceManager(this);
    }

    async start(token) {
        await this.locale.loadAll();
        // await this.commands.loadAll();
        // await this.messagecomponents.loadAll();
        await this.events.loadAll();
        // await this.db.connect(process.env.MONGO_URL);
        // await this.db.load_models();
        // await this.db.saveCache();
        // this.db.cacheInterval = setInterval(async () => { this.db.saveCache() }, 5000);
        return await this.login(token);
    }
}