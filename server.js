import express from "express";
import cors from "cors";
import reviews from "./api/reviews.route.js";

const app = express();

//Middleware
app.use(cors());
app.use(express.json());

//Routes
app.use("/api/v1/reviews",reviews);

app.use("*", (req,res) => res.status(404).json({error: "route not found"}));

//Exportation
export default app;
