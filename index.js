import app from "./server.js";
import mongodb from "mongodb";
import dotenv from "dotenv";
import ReviewsDAO from './dao/reviewsDAO.js';
dotenv.config();

const MongoClient = mongodb.MongoClient;

const port = process.env.port || 8000;

MongoClient.connect(
    process.env.ATLAS_URI,
    {
        maxPoolSize: 50,
        wtimeoutMS: 2500
    }
    )
    .catch(err => {
        console.error(err.stack);
        process.exit(1);
    })
    .then(async client => {
        //Call DB connection
        await ReviewsDAO.injectDB(client);
        
        //App listener
        app.listen(port, () => {
            console.log(`listening on port ${port}`)
        });
    })
