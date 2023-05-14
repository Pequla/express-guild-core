import { Router } from "express";
import { SyncService } from "../service/sync.service";

export const SyncRouter = Router();

SyncRouter.post('/global', async (req, res)=> {
    res.json(await SyncService.doGlobalSync())
})

SyncRouter.post('/local', async (req, res)=> {
    res.json(await SyncService.doLocalSync())
})