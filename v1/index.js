import { DiscordBot } from "./discord.js";
import { TwitchBot } from "./twitch.js";
// import { ReplitDatabase } from "./database.js";
import dotenv from "dotenv";

// DEBUG: If a streamer manages to end a stream and start a new one within the time frame that passes between one GET request and the next, the new stream will go undetected
class TwitchListener {
    #twitchBot = new TwitchBot();
    // #database = new ReplitDatabase();

    constructor(twitchClientId, twitchAccessToken) {
        this.#twitchBot.clientId = twitchClientId;
        this.#twitchBot.accessToken = twitchAccessToken;
    }

    streamEventHandler(response, previousResponse, pausedStreamers) {
        const discordBot = new DiscordBot(discordBotToken);

        // DEBUG: Can I avoid this extra loop?
        let previousLiveStreamers = [];
        if (previousResponse !== undefined) {
            previousLiveStreamers = previousResponse.data.map(
                (responseJSON) => responseJSON.user_login,
            );
        }

        response.data.forEach(
            ({ user_login: userLogin, user_name: userName }) => {
                if (!previousLiveStreamers.includes(userLogin) && !pausedStreamers.includes(userLogin)) {
                    const message = `${userName} è live. Andate a guardare il suo stream:\nhttps://www.twitch.tv/${userLogin}`;
                    discordBot.sendMessage(discordChannelId, message);

                    pausedStreamers.push(userLogin);
                    setTimeout(() => {
                        pausedStreamers.shift();
                    }, 5000);
                }
            },
        );
    }

    streamListener(callback, streamers) {
        let previousResponsePromise;
        let pausedStreamers = [];

        // IMPLEMENT: Error Handling
        setInterval(async () => {
            let previousResponse = await previousResponsePromise;
            previousResponsePromise = this.#twitchBot.getStreams((response) => {
                callback(response, previousResponse, pausedStreamers);
            }, streamers);
        }, 250);
    }

    init() {
        // this.#database.init();
        // this.#database.getStreamerList("streamers").then((streamers) => {
        //     this.streamListener(this.streamEventHandler, streamers.value);
        // });
        const streamers = [
            "fragolaqt",
            "eqyuriko",
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