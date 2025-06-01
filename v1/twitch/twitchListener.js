import { TwitchBot } from "./twitch.js";

// IMPLEMENT: should this function be inside a service?
function repeatTask(callback, delay) {
    setInterval(() => {
        callback();
    }, delay)
}

export class TwitchListener {
    #twitchBot = new TwitchBot();

    constructor(twitchClientId, twitchAccessToken) {
        this.#twitchBot.clientId = twitchClientId;
        this.#twitchBot.accessToken = twitchAccessToken;
    }

    streamListener(callback, streamers, safeTitles) {
        let previousStreamId = {};

        function HTTPResponseHandler(callback, response, previousStreamId, safeTitles) {
            response.data.forEach(({id: streamId, user_login: userLogin, user_name: userName, title: streamTitle}) => {

                // if stream title matches one of the safe titles, it will go undetected
                streamTitle = streamTitle.toLowerCase().trim();

                if(previousStreamId[userLogin] !== streamId && !safeTitles.includes(streamTitle)) {
                    try {
                        callback(userLogin, userName);
                        previousStreamId[userLogin] = streamId;
                    } catch(error) {
                        // if message isn't specified, won't recognize live stream as seen before
                        console.error(error);
                    }
                }

            });
        }

        repeatTask(() => {
            try {
                this.#twitchBot.getStreams((response) => {
                    HTTPResponseHandler(callback, response, previousStreamId, safeTitles);
                }, streamers);
            } catch(error) {
                // if streamers aren't specified, will keep trying to fetch until streamers are provided
                console.error(error);
            }
        }, 250);
    }
}