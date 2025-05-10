const jwt = require("jsonwebtoken");
const User = require("../model/user.model");
const bcrypt = require("bcrypt");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    let matchPass = await bcrypt.compare(password, user.password);
    if (!matchPass) {
      return res.status(400).json({ message: "Password is not matched" });
    }
    let payload = {
      userId: user._id,
    };
    let token = await jwt.sign(payload, "user");
    return res
      .status(200)
      .json({ message: "user Login Success", userToken: token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const register = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password before saving
    const user = new User({ username, email, password: hashedPassword, role });
    await user.save();
    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    res.status(400).json({ message: "Registration failed.", error: err.message });
  }
};

const logout = (req, res) => {
  res.clearCookie("jwt").status(200).json({ message: "Logged out successfully." });
};

const getProfile = async (req, res) => {
  try {
    const user = req.user; // The user attached to the request by the middleware

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Welcome to your profile",
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
        // Add other fields you want to expose in the profile
      },
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Forgot Password - Send reset link
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetLink = `http://localhost:9005/user/reset-password/${user._id}`;

    await transporter.sendMail({
      from: '"User Support" <gohildhruvi168529@gmail.com>',
      to: email,
      subject: "Reset Your Password",
      html: `<p>Click the link below to reset your password:</p>
             <a href="${resetLink}">${resetLink}</a>`
    });

    res.status(200).json({ message: "Password reset link sent to your email." });
  } catch (err) {
    console.error("User Forgot Password Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("User Reset Password Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// Change Password controller
const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = req.user;

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Incorrect old password." });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  res.status(200).json({ message: "Password changed successfully." });
};

// Update Profile controller
const updateProfile = async (req, res) => {
  const { username, email } = req.body;
  const user = req.user;

  user.username = username || user.username;
  user.email = email || user.email;

  await user.save();
  res.status(200).json({ message: "Profile updated successfully" });
};

// Get all users (Admin Only)
const getAllUsers = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  const users = await User.find();
  res.status(200).json({ users });
};

// Delete user (Admin Only)
const deleteUser = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  const { userId } = req.params;
  await User.findByIdAndDelete(userId);
  res.status(200).json({ message: "User deleted successfully" });
};

// Upload Profile Picture controller
const uploadProfilePicture = async (req, res) => {
  // Handle file upload and save profile picture
  res.status(200).json({ message: "Profile picture uploaded successfully" });
};

module.exports = {
  login,
  register,
  logout,
  getProfile,
  forgotPassword,
  resetPassword,
  changePassword,
  updateProfile,
  getAllUsers,
  deleteUser,
  uploadProfilePicture,
};