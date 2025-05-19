export class TwitchBot {
    #_clientId;
    #_accessToken;

    constructor(clientId, accessToken) {
        this.#_clientId = clientId;
        this.#_accessToken = accessToken;
    }

    get clientId() {
        return this.#_clientId;
    }
    set clientId(clientId) {
        this.#_clientId = clientId;
    }

    get accessToken() {
        return this.#_accessToken;
    }
    set accessToken(accessToken) {
        this.#_accessToken = accessToken;
    }

    // IMPLEMENT: Error Handling
    async getRequest(callback, uri) {
        let fetchPromise = fetch(
            uri,
            {
                method: "GET",
                headers: {
                    "client-id": this.#_clientId,
                    "authorization": `Bearer ${this.#_accessToken}`
                }
            }
        );
        let HTTPResponse = await fetchPromise;
        let responseJSON = await HTTPResponse.json();
        callback(responseJSON);
        return responseJSON;
    }

    getStreams(callback, ...userLogin) {
        if(userLogin === undefined) throw new SyntaxError("channel names must be specified");
        else if(userLogin.length === 1 && Array.isArray(userLogin[0])) {
            userLogin = userLogin[0];
        }

        let uri = "https://api.twitch.tv/helix/streams?";
        userLogin.forEach((name, index) => {
            if(typeof(name) !== "string") throw new SyntaxError("channel names must be passed as strings either singly or in a list");
            uri += ("user_login=" + name);
            if(index < (userLogin.length - 1)) uri += "&";
        });

        return this.getRequest(callback, uri);
    }
}