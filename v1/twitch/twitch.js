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

    async getRequest(callback, uri) {
        try {

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

        } catch(error) {
            // In case of fetch errors, execution won't stop
            console.error(error)
        }
    }

    getStreams(callback, ...userLogin) {
        if(userLogin.length === 0 || userLogin[0] === undefined) throw new SyntaxError("channel names must be specified");
        else if(userLogin.length === 1 && Array.isArray(userLogin[0])) {
            userLogin = userLogin[0];
        }

        let uri = "https://api.twitch.tv/helix/streams?";

        userLogin.filter((name) => typeof(name) === 'string').forEach((name, index) => {
            uri += ("user_login=" + name);
            if(index < (userLogin.length - 1)) uri += "&";
        });
        
        return this.getRequest(callback, uri);
    }
}