import express from 'express';
import cors from "cors";
import {API_PORT} from './constants.js';
import createShowsModule from "./src/shows/index.js";

const server = express();

server.use(express.json());
server.use(cors());

server.use('/shows', createShowsModule());

server.listen(API_PORT, () => {
    console.log(`Listening on ${API_PORT}`);
})