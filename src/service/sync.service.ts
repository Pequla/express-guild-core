import {DataService} from "./data.service"
import {DataModel} from "../dto/data.model"
import {WebService} from "./web.service"

export class SyncService {
    public static async doPlayerSync(uuid: string) {
        try {
            const link = await WebService.getDataByUUID(uuid)
            return await this.cachePlayer(link.data)
        } catch (err) {
            console.log(`[ERROR]: Caching for player ${uuid} failed: ${err.message}`)
            return await this.removePlayer(uuid);
        }
    }

    public static async doSync() {
        let total = 5; // start value
        for (let i = 0; i < total; i++) {
            const rsp = await WebService.getDataPaged(i)
            total = rsp.data.totalPages

            for (let model of rsp.data.content) {
                await this.cachePlayer(model)
            }
        }
    }

    public static async retrieveNewLinks() {
        const rsp = await WebService.getCreatedData()
        for (let model of rsp.data) {
            await this.cachePlayer(model)
        }
    }

    public static async retrieveRemovedLinks() {
        const rsp = await WebService.getDeletedData()
        for (let model of rsp.data) {
            await this.removePlayer(model.uuid)
        }
    }

    public static async syncExisting() {
        const all = await DataService.findAll();
        for (let data of all) {
            const model = await WebService.getDataByID(data.id)
            await this.cachePlayer(model.data)
        }
    }

    private static async cachePlayer(model: DataModel) {
        console.log(`[INFO]: Sync started for ${model.uuid}`)
        try {
            const link = await WebService.getDiscordUserByUUID(model.uuid)
            const mojang = await WebService.getMojangAccountByUUID(model.uuid)

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
            return await this.removePlayer(model.uuid);
        }
    }

    private static async removePlayer(uuid: string) {
        const record = await DataService.findByUuid(uuid, false);
        if (record != null) {
            console.log(`[INFO]: Removing player ${uuid} as ${record.nickname}`)
            return await DataService.delete(record.id)
        }
    }
}