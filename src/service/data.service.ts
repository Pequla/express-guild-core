import { AppDataSource } from "../database";
import { Data } from "../entities/data";

const repo = AppDataSource.getRepository(Data);

export class DataService {
    public static async findAll() {
        return await repo.find();
    }

    public static async findById(id: number) {
        return await repo.findOne({
            where: {
                id: id
            }
        })
    }

    public static async findByUuid(uuid: string) {
        return await repo.findOne({
            where: {
                uuid: uuid
            }
        })
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