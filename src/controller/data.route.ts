import { Router } from "express";
import { DataService } from "../service/data.service";

export const DataRouter = Router();

DataRouter.get('/', async (req, res) => {
    res.json(await DataService.findAll())
})

DataRouter.get('/stats', async (req, res) => {
    const all = (await DataService.getGuilds()).map(obj => obj.guild_id)
    res.json({
        count: await DataService.getCount(),
        guilds: {
            count: all.length,
            list: all
        }
    })
})