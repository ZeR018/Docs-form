import { Request, Response, Router } from "express";
import { HTTP_STATUSES } from "./http-statuses";
import { db } from "../database/db";

export const documentsRouter = Router({})

documentsRouter.get('/', 
async (req: Request, res: Response) => {
    const allRequests = await db.takeAllRequests();
    if (allRequests) {
        res.json(allRequests)
    }
})

documentsRouter.post('/', 
async (req: Request, res: Response) => {

    if (!req.body) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    }
    const constructorId = req.body.constructorId;
    const docName = req.body.docName;
    const newRequest = await db.addDocRequest(docName, constructorId);

    if (!newRequest) {
        res.sendStatus(HTTP_STATUSES.CONFLICT_409)
    }
    res.json(newRequest)
})
