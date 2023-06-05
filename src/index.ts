import express, {Express} from "express"
import cors from "cors"
import dotenv from "dotenv"
import morgan from "morgan"
import {AppDataSource} from "./database"
import {notFoundResponse} from "./utils"
import {DataRouter} from './controller/data.route'
import {SyncRouter} from "./controller/sync.route"

// Setting up web server
const app: Express = express()
app.use(express.json())
app.use(morgan('combined'))
app.use(cors())

// Reading env variables
dotenv.config();
const port = process.env.SERVER_PORT;

// Connect to database
AppDataSource.initialize()
    .then(() => {
        console.log('Connected to database');
        app.listen(port, () => console.log(`Listening on port ${port}`));
    })
    .catch((error) => console.log(error))

// Route setup
app.use('/api/data', DataRouter);
app.use('/api/sync', SyncRouter)

// Default not found page
app.get('*', function (req, res) {
    notFoundResponse(res)
});