"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventRouter = void 0;
const express_1 = require("express");
const controller_1 = require("./controller");
const auth_1 = require("../middleware/auth");
const uploadFile_1 = require("../middleware/uploadFile");
const router = (0, express_1.Router)();
exports.eventRouter = router;
router.route('/')
    .post(auth_1.protect, (0, auth_1.restrictTo)("Admin", "Coach"), uploadFile_1.upload.single("image"), controller_1.Controller.create)
    .get(controller_1.Controller.getAll);
router.route('/live')
    .get(controller_1.Controller.getAllLive);
router.get('/admin', auth_1.protect, (0, auth_1.restrictTo)("Admin"), controller_1.Controller.getAllByAdmin);
router.route('/:id')
    .get(controller_1.Controller.getById)
    .post(auth_1.protect, (0, auth_1.restrictTo)("Admin", "Coach"), controller_1.Controller.update)
    .delete(auth_1.protect, (0, auth_1.restrictTo)("Admin", "Coach"), controller_1.Controller.remove);
router.route('/:id/live-toggle')
    .post(controller_1.Controller.liveToggle);
router.route('/:id/upload-video')
    .post(uploadFile_1.upload.single("video"), controller_1.Controller.uploadVideo);
router.get('/team/:team_id', controller_1.Controller.getCreatedByTeam);
router.get('/opponent/:team_id', controller_1.Controller.getCreatedByOpponent);
router.get('/all/:team_id', controller_1.Controller.getTotalEventsOfTeam);
