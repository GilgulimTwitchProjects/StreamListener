export class DiscordBot {
    #_botToken;

    constructor(botToken) {
        this.#_botToken = botToken;
    }

    get botToken() {
        return this.#_botToken;
    }
    set botToken(botToken) {
        this.#_botToken = botToken;
    }

    // IMPLEMENT: Error Handling
    async postRequest(uri, requestBody, callback) {
        let fetchPromise = fetch(
            uri,
            {
                method: "POST",
                headers: {
                    "authorization": `Bot ${this.#_botToken}`,
                    "accept": "/",
                    "authority": "discord.com",
                    "content-type": "application/json"
                },
                body: JSON.stringify(requestBody)
            }
        )
        let HTTPResponse = await fetchPromise;
        let responseJSON = await HTTPResponse.json();
        callback(responseJSON);
        return responseJSON;
    }

    sendMessage(channelId, message) {
        const uri = `https://discord.com/api/v10/channels/${channelId}/messages`;
        const body = { content: message };
        return this.postRequest(uri, body, (response) =>  response /* console.log(response) */);
    }
}