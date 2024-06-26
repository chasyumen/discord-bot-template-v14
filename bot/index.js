import * as Discord from "discord.js";
import { GatewayIntentBits, Guild, TextChannel, User } from "discord.js";
import async2 from "async";
import config from "../config.js";
import Client from "../src/structures/Client.js";
import UserPermission from "../src/structures/InternalPermissionsBitField.js";
import { readFileSync } from "fs";

global.async2 = async2;
global.Discord = Discord;
global.config = config;

const client = (global.client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        // GatewayIntentBits.MessageContent
    ], //all intents / 3243773 no special intents
    allowedMentions: { repliedUser: false },
    presence: {
        status: "idle",
        activities: [
            { name: `Starting up... (1/2) | ${JSON.parse(readFileSync("./package.json").toString()).version}` }//Starting | ${require("./../package.json").version}
        ]
    },
    botConfig: config
}));

process.on("message", (...msg) => client.emit("processMessage", ...msg));

TextChannel.prototype.fetchMessages = async function (number) {
    if (!this.isText()) return false;
    var messages = new Collection();
    async function fm(...opt) {
        return await this.messages.fetch(...opt);
    };

    while (messages.size < number) {
        var smallestId = null;
        if (messages.size >= 1) {
            messages.forEach(m => {
                if (!smallestId) {
                    smallestId = m.id;
                }
                if (smallestId > m.id) {
                    smallestId = m.id;
                }
            });
        }

        console.log(number - messages.size)
        var data = await fm({ limit: number - messages.size >= 101 ? 100 : number - messages.size, before: smallestId });
        data.forEach(m => messages.set(m.id, m))
    };
    return messages;
};

User.prototype.getPermissions = async function () {
    var dbPerm = null;
    if (typeof config.userPermissions[this.id] == "number") {
        var configuredPermisson = String(config.userPermissions[this.id]);
    } else {
        var configuredPermisson = false;
    }
    var bitNumber = dbPerm || configuredPermisson;
    if (!bitNumber) {
        bitNumber = 0;
    }
    try {
        var UP = new UserPermission(Number(String(bitNumber)));
        return UP;
    } catch (error) {
        try {
            var UP = new UserPermission(Number(bitNumber));
            return UP;
        } catch (error) {
            throw error;
        }
    }
};

User.prototype.getdb = async function () {
    try {
        var userData = this.client.db.cache.user.find(data => data.userId == this.id);
    } catch (error) {
        var userData = await this.client.db.models.user.findOne({
            userId: this.id
        });
    }
    // var guildData = await this.client.db.guild.findOne({
    //     guildId: this.id
    // });
    if (!userData) {
        userData = new client.db.user({
            userId: this.id
        });
    }
    return userData;
};

User.prototype.setdb = async function (data) {
    var userData = await this.client.db.user.findOne({
        userId: this.id
    });
    if (!userData) {
        var dataSave = data;
        dataSave["userId"] = this.id;
        return await (new client.db.user(dataSave)).save();
    } else {
        return await client.db.user.findOneAndUpdate({ userId: this.id }, data);
    }
};

Guild.prototype.getdb = async function () {
    try {
        var guildData = this.client.db.cache.guild.find(data => data.guildId == this.id);
    } catch (error) {
        var guildData = await this.client.db.models.guild.findOne({
            guildId: this.id
        });
    }
    // var guildData = await this.client.db.guild.findOne({
    //     guildId: this.id
    // });
    if (!guildData) {
        guildData = new client.db.guild({
            guildId: this.id
        });
    }
    return guildData;
};

Guild.prototype.setdb = async function (data) {
    var guildData = await this.client.db.guild.findOne({
        guildId: this.id
    });
    if (!guildData) {
        var dataSave = data;
        dataSave["guildId"] = this.id;
        return await (new client.db.guild(dataSave)).save();
    } else {
        return await client.db.guild.findOneAndUpdate({ guildId: this.id }, data);
    }
};


client.start(process.env.DISCORD_TOKEN);

process.on("uncaughtException", console.error);
process.on("unhandledRejection", console.error);