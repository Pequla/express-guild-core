import { Router } from "express";
import { SyncService } from "../service/sync.service";

export const SyncRouter = Router();

SyncRouter.post('/all', async (req, res) => {
    res.json(await SyncService.doSync())
})

SyncRouter.post('/new', async (req, res) => {
    res.json(await SyncService.retrieveNewLinks())
})

SyncRouter.post('/removed', async (req, res) => {
    res.json(await SyncService.retrieveRemovedLinks())
})

SyncRouter.post('/player/:uuid', async (req, res) => {
    const uuid = req.params.uuid;
    res.json(await SyncService.doPlayerSync(uuid))
})