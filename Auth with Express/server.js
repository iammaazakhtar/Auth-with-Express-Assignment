import dotenv from "dotenv"
import mongoose from "mongoose";
import fs from "fs"
import express, { urlencoded } from "express";
import router from "./routers.mjs";
import path from "path";

const app = express();

dotenv.config()

const FALL_BACK_PROT = 8000;
const FIVE_SEC = 5000;
const CONNECTION_OPTIONS = {
	dbName: process.env.MONGO_DB,
	maxPoolSize: 1,
	minPoolSize: 1,
	family: 6,
	serverSelectionTimeoutMS: FIVE_SEC,
};

const port = process.env.API_PROT ?? FALL_BACK_PROT;
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(router);
app.use((err, req, res, next)=> {
	console.log(err)
	if(err){
		res.render("404", {message: err.message})
	}else{
		next()
	}
})

app.set('views', "pages")
app.set("view engine", "ejs")


const server = app.listen(port, () => console.info(`api server ${server.address().address} started listening on ${server.address().port}`));

mongoose
	.connect(process.env.MONGO_URI, CONNECTION_OPTIONS)
	.then((res) => {
		console.info("connected to mongodb server");
	})
	.catch((error) => {
		console.error(error.message);
	});
