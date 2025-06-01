import { DiscordBot } from "./discord.js";
import { TwitchBot } from "./twitch.js";
// import { ReplitDatabase } from "./database.js";
import dotenv from "dotenv";

// IMPLEMENT: Streamers need to be able to turn off the discord bot: create a bot command and a condition based on stream info (such as stream name).
// IMPLEMENT: message must be added dynamically; streamers must be added dynamically; Twitch and Discord Bot tokens must be added dynamically.
//            Execution never has to stop, user must be able to patch code remotely.

class TwitchListener {
    #twitchBot = new TwitchBot();
    // #database = new ReplitDatabase();

    constructor(twitchClientId, twitchAccessToken) {
        this.#twitchBot.clientId = twitchClientId;
        this.#twitchBot.accessToken = twitchAccessToken;
    }

    streamEventHandler(userLogin, userName) {
        const discordBot = new DiscordBot(discordBotToken);
        const message = `${userName} è live. Andate a guardare il suo stream:\nhttps://www.twitch.tv/${userLogin}`;
        discordBot.sendMessage(discordChannelId, message);
    }

    streamListener(callback, streamers) {
        let previousLiveIds = {};

        function HTTPResponseHandler(callback, response, previousLiveIds) {
            response.data.forEach(({id: liveId, user_login: userLogin, user_name: userName}) => {
                if(previousLiveIds[userLogin] !== liveId) {
                    try {
                        callback(userLogin, userName);
                        previousLiveIds[userLogin] = liveId;
                    } catch(error) {
                        // If message isn't specified, won't recognize message as sent
                        console.error(error);
                    }
                }
            });
        }

        function repeatTask(callback, delay) {
            setInterval(() => {
                callback();
            }, delay)
        }

        repeatTask(() => {
            try {
                this.#twitchBot.getStreams((response) => {
                    HTTPResponseHandler(callback, response, previousLiveIds);
                }, streamers);
            } catch(error) {
                // if streamers aren't specified, will keep trying to fetch until streamers are provided
                console.error(error);
            }
        }, 250);
    }

    init() {
        // this.#database.init();
        // this.#database.getStreamerList("streamers").then((streamers) => {
        //     this.streamListener(this.streamEventHandler, streamers.value);
        // });
        const streamers = [
            "coinquilino_",
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