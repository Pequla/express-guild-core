import { AppDataSource } from "../database";
import { Data } from "../entities/data";
import { addHourToDate } from "../utils";
import { SyncService } from "./sync.service";

const repo = AppDataSource.getRepository(Data);

export class DataService {
    public static async findAll() {
        return await repo.find();
    }

    public static async findById(id: number) {
        const data = await repo.findOne({
            where: {
                id: id
            }
        })

        if (data == undefined){
            return null;
        }

        if (addHourToDate(data.cachedAt) <= new Date()) {
            SyncService.doPlayerSync(data.uuid)
        }

        return data;
    }

    public static async findByUuid(uuid: string, sync = true) {
        const data = await repo.findOne({
            where: {
                uuid: uuid
            }
        })

        if (data == undefined){
            return null;
        }

        if (addHourToDate(data.cachedAt) <= new Date() && sync) {
            SyncService.doPlayerSync(data.uuid)
        }

        return data;
    }

    public static async getCount() {
        return await repo.count();
    }

    public static async getGuilds() {
        return await repo.createQueryBuilder('data').select('DISTINCT data.guild_id', 'guild_id').getRawMany()
    }

    public static async save(entity: Data) {
        return await repo.save(entity);
    }

    public static async delete(id: number) {
        return await repo.delete(id)
    }
}