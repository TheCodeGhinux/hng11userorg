"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const user_zod_1 = require("../middlewares/validations/user.zod");
const auth_1 = require("../middlewares/auth");
const auth_controlller_1 = require("../controllers/auth.controlller");
const router = (0, express_1.Router)();
router.get('/users', user_controller_1.getAllUsers);
// router.get('/users/:firstName', getUserByFirstName)
// router.get('/users/:email', getUserByEmail)
router.get('/users/:id', user_controller_1.getUserById);
router.post('/auth/register', auth_controlller_1.createUser, user_zod_1.validateCreateUserData);
router.post('/auth/login', auth_controlller_1.loginUser, auth_1.authenticate);
// router.get('/user', getAllUsers)
router.get('/profile', auth_1.authenticate, (req, res) => {
    const user = req.user;
    console.log(user);
    res.json({ user: req.user });
});
exports.default = router;
//# sourceMappingURL=user.route.js.map