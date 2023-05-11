import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import morgan from "morgan"
import { AppDataSource } from "./database"
import { notFoundResponse } from "./utils"

// Setting up web server
const app = express()
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
// No routes yet

// Default not found page
app.get('*', function (req, res) {
    notFoundResponse(res)
});