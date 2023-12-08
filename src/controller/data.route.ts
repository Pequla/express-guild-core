import {Router, Request, Response} from "express";
import {DataService} from "../service/data.service";
import {notFoundResponse} from "../utils";

export const DataRouter = Router();

DataRouter.get('/', async (req: Request, res: Response) => {
    res.json(await DataService.findAll())
})

DataRouter.get('/uuid/:uuid', async (req, res) => {
    const uuid = (req.params.uuid) as any as string
    const data = await DataService.findByUuid(uuid);
    if (data == null) {
        return notFoundResponse(res);
    }
    res.json(data);
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

DataRouter.get('/:id', async (req, res) => {
    const id = (req.params.id) as any as number
    const data = await DataService.findById(id)
    if (data == null) {
        return notFoundResponse(res);
    }
    res.json(data);
})