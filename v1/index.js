import { DiscordBot } from "./discord.js";
import { TwitchBot } from "./twitch.js";
// import { ReplitDatabase } from "./database.js";
import dotenv from "dotenv";

// IMPLEMENT: Error handling -> find a way to track connection/fetch errors even while the code is running on a server
// IMPLEMENT: Streamers need to be able to turn off the discord bot: either create a bot command or a condition based on stream info (such as stream name)

// DEBUG?: very short streams go undetected + if stream starts at application init, it goes undetected
class TwitchListener {
    #twitchBot = new TwitchBot();
    // #database = new ReplitDatabase();

    constructor(twitchClientId, twitchAccessToken) {
        this.#twitchBot.clientId = twitchClientId;
        this.#twitchBot.accessToken = twitchAccessToken;
    }

    streamEventHandler(response, previousResponse, previousLiveIds) {
        const discordBot = new DiscordBot(discordBotToken);

        // DEBUG: Can I avoid this extra loop?
        let previousLiveStreamers = [];
        if (previousResponse !== undefined) {
            previousLiveStreamers = previousResponse.data.map(
                (responseJSON) => responseJSON.user_login,
            );
        }

        // Sends a message if the streamer wasn't live in the previous fetch response
        // and if the stream id wasn't encountered before (to avoid bugs in case of packet loss)
        response.data.forEach(
            ({ id: liveId, user_login: userLogin, user_name: userName }) => {
                if (!previousLiveStreamers.includes(userLogin) && (previousLiveIds === undefined || previousLiveIds[userLogin] !== liveId)) {
                        const message = `${userName} è live. Andate a guardare il suo stream:\nhttps://www.twitch.tv/${userLogin}`;
                        discordBot.sendMessage(discordChannelId, message);
                        previousLiveIds[userLogin] = liveId;
                }
            },
        );
    }

    streamListener(callback, streamers) {
        let previousResponsePromise;
        let previousLiveIds = {};

        // IMPLEMENT: Error Handling
        let repeatedTask = setInterval(async () => {
            let previousResponse = await previousResponsePromise;
            try {
                previousResponsePromise = this.#twitchBot.getStreams((response) => {
                    callback(response, previousResponse, previousLiveIds);
                }, streamers);
            } catch(error) {
                console.error(error);
                clearInterval(repeatedTask);
            }
        }, 250);
    }

    init() {
        // this.#database.init();
        // this.#database.getStreamerList("streamers").then((streamers) => {
        //     this.streamListener(this.streamEventHandler, streamers.value);
        // });
        const streamers = [
            "claneko_vt",
            "damiano048",
            "kimoshivt",
            "exuhph",
            "vtharleen",
            "widdershinofficial",
            "hiyku_kun",
            "leaffiereef",
            "maty07__",
            "minetatwitch_",
            "nashquiet",
            "niki_vt",
            "no_jadeallen",
            "rengu_vt",
            "imshon_",
            "unaracnofobico",
            "kuriafokusu",
            "violex_fairy",
        ];
        this.streamListener(this.streamEventHandler, streamers);
    }
}

dotenv.config({ path: "../secrets/.env" });

const twitchClientId = process.env.TWITCH_CLIENT_ID;
const twitchAccessToken = process.env.TWITCH_ACCESS_TOKEN;

const discordBotToken = process.env.DISCORD_BOT_TOKEN;
const discordChannelId = process.env.DISCORD_CHANNEL_ID;

let twitchListener = new TwitchListener(twitchClientId, twitchAccessToken);
twitchListener.init();