import { Router } from "express";
import { SyncService } from "../service/sync.service";
import { responseHandler } from "../utils";

export const SyncRouter = Router();

SyncRouter.post('/all', async (req, res) => {
    await responseHandler(res, SyncService.doSync())
})

SyncRouter.post('/new', async (req, res) => {
    await responseHandler(res, SyncService.retrieveNewLinks())
})

SyncRouter.post('/removed', async (req, res) => {
    await responseHandler(res, SyncService.retrieveRemovedLinks())
})

SyncRouter.post('/existing', async (req, res) => {
    await responseHandler(res, SyncService.syncExisting())
})

SyncRouter.post('/player/:uuid', async (req, res) => {
    const uuid = req.params.uuid;
    await responseHandler(res, SyncService.doPlayerSync(uuid))
})