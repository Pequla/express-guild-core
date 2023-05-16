import axios from "axios"
import dotenv from "dotenv"
import { DataService } from "./data.service"
import { DataModel } from "../dto/data.model"

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
    public static async doPlayerSync(uuid: string) {
        const link = await client.get(`/data/uuid/${uuid}`)
        return await this.cachePlayer(link.data)
    }

    public static async doSync() {
        let total = 5; // start value
        for (let i = 0; i < total; i++) {
            const rsp = await client.get(`/data?page=${i}&size=30`)
            total = rsp.data.totalPages

            for (let model of rsp.data.content) {
                this.cachePlayer(model)
            }
        }
    }

    public static async retrieveNewLinks() {
        const rsp = await client.get(`/data/created/after/${this.getISODateOneHourBefore()}`)
        for (let model of rsp.data) {
            this.cachePlayer(model)
        }
    }

    public static async retrieveRemovedLinks() {
        const rsp = await client.get(`/data/deleted/after/${this.getISODateOneHourBefore()}`)
        for (let model of rsp.data) {
            this.removePlayer(model)
        }
    }

    private static getISODateOneHourBefore() {
        const date = new Date();
        date.setDate(date.getHours() - 1)
        return date.toISOString().substring(0, 19)
    }

    private static async cachePlayer(model: DataModel) {
        console.log(`[INFO]: Sync started for ${model.uuid}`)
        try {
            const link = await client.get(`/user/${guild}/${model.uuid}`)
            const mojang = await client.get(`/cache/uuid/${model.uuid}`)

            // Record exists, save to database
            const record = {
                "id": model.id,
                "name": mojang.data.name,
                "uuid": model.uuid,
                "discordId": model.user.discordId,
                "tag": link.data.name,
                "nickname": link.data.nickname,
                "avatar": link.data.avatar,
                "guildId": model.guild.discordId,
                "createdAt": new Date(model.createdAt),
                "cachedAt": new Date()
            }

            // Save the entity
            console.log(`[INFO]: Saved player ${model.uuid} as ${link.data.nickname}`)
            return await DataService.save(record);
        } catch (err) {
            console.log(`[ERROR]: Caching for player ${model.uuid} failed: ${err.message}`)
            return await this.removePlayer(model);
        }
    }

    private static async removePlayer(model: DataModel) {
        const record = await DataService.findByUuid(model.uuid);
        if (record != null) {
            console.log(`[INFO]: Removing player ${model.uuid} as ${record.nickname}`)
            return await DataService.delete(record.id)
        }
    }
}