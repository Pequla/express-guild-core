import axios from "axios"
import dotenv from "dotenv"

// Setup env variables
dotenv.config()
const base: string = process.env.BACKEND_BASE_URL
const guild: string = process.env.GUILD_ID

// Creating an axios instance
const client = axios.create({
    baseURL: `${base}/api`,
    headers: {
        'Accept': 'application/json'
    },
    validateStatus: function (status) {
        return status === 200 || status === 204
    }
})

export class WebService {
    public static getDataPaged(page: number) {
        return client.get(`/data/guild/${guild}?page=${page}&size=30`)
    }

    public static getDataByID(id: number) {
        return client.get(`/data/${id}`)
    }

    public static getDataByUUID(uuid: string) {
        return client.get(`/data/uuid/${uuid}`)
    }

    public static getCreatedData() {
        return client.get(`/data/created/after/${this.getISODateOneHourBefore()}`)
    }

    public static getDeletedData() {
        return client.get(`/data/deleted/after/${this.getISODateOneHourBefore()}`)
    }

    public static getDiscordUserByUUID(uuid: string) {
        return client.get(`/user/${guild}/${uuid}`)
    }

    public static getMojangAccountByUUID(uuid: string) {
        return client.get(`/cache/uuid/${uuid}`)
    }

    public static getServerStatus(addr: string) {
        return client.get(`/status/${addr}`)
    }

    private static getISODateOneHourBefore() {
        const date = new Date();
        date.setHours(date.getHours() - 1)
        return date.toISOString().substring(0, 19)
    }
}