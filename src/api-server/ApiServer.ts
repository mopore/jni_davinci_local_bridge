import express from "express";
import { Functions } from "./Functions.js";

const apiPortRaw = process.env["API_PORT"];
const apiPort = Number(apiPortRaw);

const app = express();
app.use( express.json() );
Functions.apply( app );
export const server = app;

server.listen( 
	apiPort, 
	() => console.info( `API Server is listening at port ${apiPort}...`) 
);