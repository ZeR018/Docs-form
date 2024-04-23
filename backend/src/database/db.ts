import database from './db-config.js'

function fChangeKeyName(pathKey : any, oldNameKey : string, newNameKey : string) {
    pathKey[newNameKey] = pathKey[oldNameKey];
    delete pathKey[oldNameKey];
  }

export type constructorType = {
    id: number
    fullname: string
}

export type requestType = {
    id: number
    constructorId: number
    docName: string
}

export const db = {
    async getConstructors(): Promise<constructorType[] | undefined>{
        const res = await database.query(`SELECT * FROM constructors`)
        return res.rows
        
    },
    async getConstructorById(id : number): Promise<constructorType | undefined> {
        const constructor = await database.query(`SELECT * FROM constructors WHERE id = $1`, [id])
        
        return constructor.rows[0]
    },
    async addConstructor(constructorName : string): Promise<constructorType | undefined>{
        const newConstructor = await database.query(`INSERT INTO constructors (fullname) VALUES ($1) RETURNING *`, [constructorName])
        return newConstructor.rows[0]
    },
    async deleteConstructor(id: number): Promise<constructorType | undefined>{
        const deletedConstructor = await database.query(`DELETE FROM constructors WHERE id = $1 RETURNING *`, [id])
        return deletedConstructor.rows[0]
    },
    async updateConstructor(id: number, newName : string): Promise<constructorType | undefined>{
        const newConstructor = await database.query(`UPDATE constructors set fullname = $1 WHERE id = $2 RETURNING *`, [newName, id])
        return newConstructor.rows[0]
    },
    async addDocRequest(docName : string, constructorId: number): Promise<requestType | undefined> {
        const isRequestsInDB = await database.query(`SELECT * FROM requests WHERE constructor_id = $1 AND doc_name = $2`, [constructorId, docName])
        if (isRequestsInDB.rows[0]) {
            return undefined
        }
        const result = await database.query(`INSERT INTO requests (constructor_id, doc_name) VALUES ($1, $2) RETURNING *`, [constructorId, docName])
        const newRequest = result.rows[0]
        fChangeKeyName(newRequest, "doc_name", "docName");
        fChangeKeyName(newRequest, "constructor_id", "constructorId");
        return newRequest
    },
    async takeAllRequests() {
        const requests = await database.query(`SELECT * FROM requests`)

        requests.rows.forEach((r) => {
            fChangeKeyName(r, "constructor_id", "constructorId");
            fChangeKeyName(r, "doc_name", "docName")
        })
        
        return requests.rows
    }
}