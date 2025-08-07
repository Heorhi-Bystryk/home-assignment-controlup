import axios from "axios";
import {TV_SHOWS_API_BASE_URL} from "../../constants.js";

export default function createController() {
    async function getShows(req, res) {
        const {search} = req.query;
        const shows = (await axios.get(`${TV_SHOWS_API_BASE_URL}/search/shows`, {params: {q: search}})).data

        return res.status(200).send(shows.map(({show}) => ({
            id: show.id,
            name: show.name,
            genres: show.genres,
        })));
    }

    async function getShowById(req, res) {
        const {id} = req.params;
        const show = (await axios.get(`${TV_SHOWS_API_BASE_URL}/shows/${id}`)).data

        return res.status(200).send(show);
    }

    return {
        getShows,
        getShowById,
    }
}
