import express from 'express'
import { constructorsRouter } from './routers/constructors-router'
import { documentsRouter } from './routers/documents-requests-router'
var cors = require('cors')

const app = express()
const port = process.env.port || 3001


app.use(cors())

const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)

app.use('/constructors', constructorsRouter)
app.use('/requests', documentsRouter)


app.listen(port, () => {
    console.log(`Example on port ${port}`)
})

