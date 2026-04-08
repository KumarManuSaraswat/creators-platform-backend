const User = require('../models/User');

// @desc    Register a new user
// @route   POST /api/users/register
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Basic validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please include all fields' });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create user (password is hashed automatically by the pre-save middleware in the model)
        const user = await User.create({ name, email, password });

        // Ensure password is NOT returned in the response
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// You will need to implement these based on the same pattern!
const getUsers = async (req, res) => { /* ... */ };
const getUserById = async (req, res) => { /* ... */ };
const updateUser = async (req, res) => { /* ... */ };
const deleteUser = async (req, res) => { /* ... */ };

module.exports = {
    registerUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
};