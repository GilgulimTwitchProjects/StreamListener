import { DiscordBot } from "./discord/discord.js";
import { TwitchListener } from "./twitch/twitchListener.js";
import { ReplitDatabase } from "./replit/database.js";
import dotenv from "dotenv";

async function init(twitchClientId, twitchAccessToken, discordBotToken) {
    const database = new ReplitDatabase();
    database.init();

    let streamers = (await database.getStreamerList()).value;
    let safeTitles = (await database.getSafeTitles()).value;

    const twitchListener = new TwitchListener(twitchClientId, twitchAccessToken);

    twitchListener.streamListener((userLogin, userName) => {
        const discordBot = new DiscordBot(discordBotToken);
        const message = `${userName} è live. Andate a guardare il suo stream:\nhttps://www.twitch.tv/${userLogin}`;
        discordBot.sendMessage(discordChannelId, message);
    }, streamers, safeTitles);
}

dotenv.config({ path: "secrets/.env" });

const twitchClientId = process.env.TWITCH_CLIENT_ID;
const twitchAccessToken = process.env.TWITCH_ACCESS_TOKEN;

const discordBotToken = process.env.DISCORD_BOT_TOKEN;
const discordChannelId = process.env.DISCORD_CHANNEL_ID;

init(twitchClientId, twitchAccessToken, discordBotToken);