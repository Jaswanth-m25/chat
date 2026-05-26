const express = require('express');
const router = express.Router();

const User = require('../models/User');

router.post('/sync-user', async (req, res) => {
    console.log("SYNC USER HIT");
    console.log(req.body);
    try {

        const {
            clerkId,
            username,
            email,
            avatar
        } = req.body;

        let user = await User.findOne({ clerkId });

        if (!user) {

            user = new User({
                clerkId,
                username,
                email,
                avatar
            });

            await user.save();
        }

        res.json({
            success: true,
            user
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: 'Failed to sync user'
        });
    }
});

module.exports = router;