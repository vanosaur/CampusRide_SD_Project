"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rideController_1 = require("../controllers/rideController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const validateMiddleware_1 = require("../middleware/validateMiddleware");
const rideValidation_1 = require("../validation/rideValidation");
const router = (0, express_1.Router)();
// All ride routes require a valid JWT
router.use(authMiddleware_1.authMiddleware);
// ─── Collection routes ───────────────────────────────────────────────────────
router.get('/my', rideController_1.getMyRides);
router.get('/', (0, validateMiddleware_1.validate)(rideValidation_1.getRidesQuerySchema), rideController_1.getRides);
router.post('/', (0, validateMiddleware_1.validate)(rideValidation_1.createRideSchema), rideController_1.createRide);
// ─── Single-ride routes ──────────────────────────────────────────────────────
router.get('/:id', (0, validateMiddleware_1.validate)(rideValidation_1.rideIdParamSchema), rideController_1.getRideById);
router.post('/:id/join', (0, validateMiddleware_1.validate)(rideValidation_1.rideIdParamSchema), rideController_1.joinRide);
router.put('/:id/confirm', (0, validateMiddleware_1.validate)(rideValidation_1.rideIdParamSchema), rideController_1.confirmRide);
router.put('/:id/cancel', (0, validateMiddleware_1.validate)(rideValidation_1.rideIdParamSchema), rideController_1.cancelRide);
router.put('/:id/members', (0, validateMiddleware_1.validate)(rideValidation_1.updateMemberStatusSchema), rideController_1.updateMemberStatus);
exports.default = router;
