import express from "express";
import generateRoutes from "./allRoutes/generate.routes.js";
import saveRoutes from "./allRoutes/save.routes.js";

const router = express.Router();

router.use("/generate", generateRoutes);
router.use("/save", saveRoutes);

export default router;
