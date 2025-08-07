import createController from "./controller.js";
import createRouter from "./router.js";

export default function createShowsModule() {
    const controller = createController();

    return createRouter({controller});
}