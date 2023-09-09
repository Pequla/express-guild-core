import {Router} from "express";
import {StatusService} from "../service/status.service";
import {responseHandler} from "../utils";

export const StatusRouter = Router();

StatusRouter.get('/:addr', async (req, res) => {
    const addr = (req.params.addr) as any as string
    await responseHandler(res, StatusService.fromAddress(addr))
})