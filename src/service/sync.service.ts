import axios from "axios"
import dotenv from "dotenv"
import { DataService } from "./data.service"

// Creating an axios instance
export const client = axios.create({
    baseURL: 'https://link.samifying.com/api',
    headers: {
        'Accept': 'application/json'
    },
    validateStatus: function (status) {
        return status === 200 || status === 204
    }
})

// Retrive guild id
dotenv.config()
const guild = process.env.GUILD_ID

export class SyncService {
    public static async doGlobalSync() {
        await this.doSync();
    }

    public static async doLocalSync() {
        await this.doSync(`/data/guild/804835598920712192`);
    }

    private static async doSync(url = '/data') {
        let total = 5; // start value
        for (let i = 0; i < total; i++) {
            const rsp = await client.get(`${url}?page=${i}&size=30`);
            total = rsp.data.totalPages

            for (let e of rsp.data.content) {
                console.log(`[INFO]: Sync started for ${e.uuid}`)
                try {
                    const link = await client.get(`/user/1088934690385317928/${e.uuid}`)
                    const mojang = await client.get(`/cache/uuid/${e.uuid}`)

                    // Record exists, save to database
                    const record = {
                        "id": e.id,
                        "name": mojang.data.name,
                        "uuid": e.uuid,
                        "discordId": e.user.discordId,
                        "tag": link.data.name,
                        "nickname": link.data.nickname,
                        "avatar": link.data.avatar,
                        "guildId": e.guild.discordId,
                        "createdAt": new Date(e.createdAt),
                        "cachedAt": new Date()
                    }

                    // Save the entity
                    console.log(`[INFO]: Saved player ${e.uuid} as ${link.data.nickname}`)
                    DataService.save(record);
                } catch (err) {
                    console.log(`[ERROR]: Caching for player ${e.uuid} failed: ${err.message}`)

                    // Check if record exists
                    const record = await DataService.findByUuid(e.uuid);
                    if (record != null) {
                        console.log(`[INFO]: Removing player ${e.uuid} as ${record.nickname}`)
                        await DataService.delete(record.id)
                    }
                }
            }
        }
    }
}