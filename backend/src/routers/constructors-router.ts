import { Request, Response, Router } from "express";
import { HTTP_STATUSES } from "./http-statuses";
import { db } from "../database/db";

export const constructorsRouter = Router({})

// CRUD

constructorsRouter.get('/', 
async(req: Request, res: Response) => {

    const constructors = await db.getConstructors()
    res.json(constructors)
})

constructorsRouter.get('/:id', 
async(req: Request, res: Response) => {
    const constructorId = +req.params.id
    const foundConstructor = await db.getConstructorById(constructorId)

    if (!foundConstructor) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUNT_404);
        return;
    }
    res.json(foundConstructor)
})

constructorsRouter.post('/', 
async (req: Request, res: Response) => {
    if (!req.body.fullname) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return;
    }

    const newConstructor = await db.addConstructor(req.body.fullname)
    res.setHeader('Content-Type', 'application/json');
    res.json(newConstructor)
})

constructorsRouter.put('/:id', 
async (req: Request, res: Response) => {
    const newConstructorName = req.body.fullname

    if (!newConstructorName) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return;
    }
    const constructorId = +req.params.id
    let constructor = await db.updateConstructor(constructorId, newConstructorName)

    if (constructor) {
        res.json(constructor)
    }
    else {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        return;
    }
})

constructorsRouter.delete('/:id', 
async (req: Request, res: Response) => {
    const constructorId = +req.params.id
    const deletedConstructor = await db.deleteConstructor(constructorId)

    if (deletedConstructor) {
        res.json(deletedConstructor)
    }
    else {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }
})

