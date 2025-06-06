import db from "@replit/database";

export class ReplitDatabase {
  database;

  async saveStreamerList(streamers) {
    await this.database.set("streamers", streamers);
  }

  async saveSafeTitles(safeTitles) {
    await this.database.set("safeTitles", safeTitles);
  }

  async getStreamerList() {
    return await this.database.get("streamers");
  }

  async getSafeTitles() {
    return await this.database.get("safeTitles");
  }

  init() {
    this.database = new db();

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
    this.saveStreamerList(streamers);

    const safeTitles = [
        "prova",
        "prove",
        "test",
    ];
    this.saveSafeTitles(safeTitles);
  }
}
