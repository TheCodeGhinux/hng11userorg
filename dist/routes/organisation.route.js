"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const organisation_controller_1 = require("../controllers/organisation.controller");
const authGuard_1 = require("../middlewares/authGuard");
const router = (0, express_1.Router)();
router.get('/organisations', authGuard_1.authGuard, organisation_controller_1.getAllOrganisation);
router.get('/organisations', authGuard_1.authGuard, organisation_controller_1.getAllOrganisation);
router.get('/organisations/:orgId', authGuard_1.authGuard, organisation_controller_1.getUserOrganisation);
// router.post('/organisations', createOrganisation)
router.post('/organisations/:orgId/users', authGuard_1.authGuard, organisation_controller_1.addUserToOrganisation);
router.post('/organisations', authGuard_1.authGuard, organisation_controller_1.createOrganisation);
// router.get('/users/:firstName', getUserByFirstName)
// router.get('/users/:email', getUserByEmail)
// router.get('/user', getAllUsers)
// router.post('/api/organisations/addUser', authGuard, addUserToOrganisation)
router.post('/api/organisations/removeUser', authGuard_1.authGuard, organisation_controller_1.removeUserFromOrganisation);
module.exports = router;
//# sourceMappingURL=organisation.route.js.map