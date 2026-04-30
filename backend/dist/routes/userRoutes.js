"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const validateMiddleware_1 = require("../middleware/validateMiddleware");
const userValidation_1 = require("../validation/userValidation");
const router = (0, express_1.Router)();
// All user routes require authentication
router.use(authMiddleware_1.authMiddleware);
/**
 * PUT /api/users/profile
 * Update current user's name, phone, and/or gender.
 * Body: { name?, phone?, gender? }  (at least one required)
 */
router.put('/profile', (0, validateMiddleware_1.validate)(userValidation_1.updateProfileSchema), userController_1.updateProfile);
/**
 * PUT /api/users/photo
 * Update current user's profile photo URL.
 * Body: { profilePhoto: "https://..." }
 */
router.put('/photo', (0, validateMiddleware_1.validate)(userValidation_1.updatePhotoSchema), userController_1.updatePhoto);
exports.default = router;
