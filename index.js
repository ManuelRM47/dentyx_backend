import app from "./server.js";
import mongodb from "mongodb";
import dotenv from "dotenv";
import ReviewsDAO from './dao/reviewsDAO.js';
dotenv.config();

const MongoClient = mongodb.MongoClient;

const PORT = process.env.PORT || 8080;

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
        
        const __dirname = path.resolve();
        if (process.env.NODE_DEV === 'production'){
            app.use(express.static(path.join(__dirname,'client','build')))

            app.get('*', (req,res) => {
                res.sendFile(path.resolve(__dirname,'client','build','index.html'));
            });
        }

        //App listener
        app.listen(PORT, () => {
            console.log(`listening on port ${PORT}`)
        });
    })
