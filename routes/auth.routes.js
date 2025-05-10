const express = require("express");
const router = express.Router();
const { login, register, logout, getProfile,  forgotPassword, resetPassword, changePassword, updateProfile, getAllUsers, deleteUser, uploadProfilePicture } = require("../controller/authController.controller");
const { verifyUserToken } = require("../middleware/authMiddleware");

// User login route
router.post("/login", login);

// User registration route
router.post("/register", register); 

// User logout route
router.post("/logout", logout);

// Protected route (only accessible if token is verified)
router.get("/profile", verifyUserToken, getProfile);

// Forgot Password route
router.post("/forgot-password", forgotPassword);

// Reset Password route
router.post("/reset-password/:userId", resetPassword);

// Change Password route
router.post("/change-password", verifyUserToken, changePassword);

// Update Profile route
router.put("/profile", verifyUserToken, updateProfile);

// Admin Routes (requires admin role)
router.get("/admin/users", verifyUserToken, getAllUsers);

router.delete("/admin/users/:userId", verifyUserToken, deleteUser);

// Upload Profile Picture route
router.post("/upload-profile-picture", verifyUserToken, uploadProfilePicture);

module.exports = router;
