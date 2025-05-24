"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.teamRouter = void 0;
const express_1 = require("express");
const controller_1 = require("./controller");
const auth_1 = require("../middleware/auth");
const uploadFile_1 = require("../middleware/uploadFile");
const router = (0, express_1.Router)();
exports.teamRouter = router;
router.route('/')
    .post(auth_1.protect, (0, auth_1.restrictTo)("Admin"), uploadFile_1.upload.single("image"), controller_1.Controller.create)
    .get(controller_1.Controller.getAll);
router.route('/:id')
    .post(auth_1.protect, (0, auth_1.restrictTo)("Admin"), uploadFile_1.upload.single("image"), controller_1.Controller.update)
    .get(controller_1.Controller.getById)
    .delete(auth_1.protect, (0, auth_1.restrictTo)("Admin"), controller_1.Controller.remove);
router.route('/:id/player')
    .post(auth_1.protect, (0, auth_1.restrictTo)("Admin"), controller_1.Controller.addPlayer)
    .get(controller_1.Controller.getPlayers);
router.delete('/:id/player/:player_id', auth_1.protect, (0, auth_1.restrictTo)("Admin"), controller_1.Controller.removePlayer);
