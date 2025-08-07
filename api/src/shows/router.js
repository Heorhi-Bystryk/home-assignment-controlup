import {Router} from "express";

export default function createRouter({controller}) {
    const router = new Router();

    router.get('/', controller.getShows);
    router.get('/:id', controller.getShowById);


    return router;
}