export interface DataModel {
    id: number,
    uuid: string,
    user: {
        id: number,
        discordId: string,
        createdAt: Date
    },
    guild: {
        id: number,
        discordId: string,
        createdAt: Date
    },
    createdAt: Date
}