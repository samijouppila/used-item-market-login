const User = require('../models/User')

const createNewUser = async (req, res) => {
    try {
        const existingUser = await User.findOne({ username: req.body['username'] })
        if (existingUser) {
            return res.status(400).json({
                errorDescription: "User with that username already exists"
            });
        }
        if (!req.body.hasOwnProperty('contactInformation')) {
            return res.status(400).json({
                errorDescription: "Must include contact information in user creation"
            });
        }
        if (!req.body['contactInformation']['email'] && !req.body['contactInformation']['phoneNumber']) {
            return res.status(400).json({
                errorDescription: "Contact information must have email or phone number"
            });
        }
        const newUser = new User(req.body);
        newUser.save( (err, user) => {
            if (err || !user) {
                return res.status(400).json({
                    errorDescription: "Incorrect request body"
                });
            }
            res.status(201).json({
                username: user.username,
                birthDate: user.birthDate,
                contactInformation: user.contactInformation,
                _id: user._id
            })
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errorDescription: "Unknown error occurred"
        });
    }
}

const getSelectedUserData = async (req, res) => {
    if (req.user._id != req.params.id) {
        return res.status(401).send("Unauthorized") // User can only get their own data
    }
    User.findOne({ _id: req.params.id }, '-__v -password', function(err, user) {
        if (err || !user) return res.status(404).send({
            errorDescription: "User not found"
        });
        res.status(200).json(user);
    });
}

const modifySelectedUserData = async (req, res) => {
    if (req.user._id != req.params.id) {
        return res.status(401).send("Unauthorized") // User can only modify their own data
    }
    User.findOne({ _id: req.params.id}, '-__v', function (err, user) {
        if (err || !user) return res.status(404).send({
            errorDescription: "User not found"
        });
        for (const key in req.body) {
            if (key != 'username' && key != '_id' && key != 'contactInformation') {  // Prevent changing _id and username fields and handle contactInformation separately
                user[key] = req.body[key];
            } else if (key == 'contactInformation') {
                for (info in req.body.contactInformation) {
                    user.contactInformation[info] = req.body.contactInformation[info];
                }
            }
        }
        user.save( function (err, user) {
            if (err) return res.status(400).send({
                errorDescription: "Bad request body"
            });
            res.status(200).json({
                username: user.username,
                birthDate: user.birthDate,
                contactInformation: user.contactInformation,
                _id: user._id
            })
        })
    })
}

const deleteSelectedUser = async (req, res) => {
    if (req.user._id != req.params.id) {
        return res.status(401).send("Unauthorized") // User can only delete their own account
    }
    User.findOneAndDelete({ _id: req.params.id}, function(err, user) {
        if (err || !user)  return res.status(404).send({
            errorResponse: "User not found"
        });
        res.status(200).send("OK!");
    })
}

module.exports = {
    createNewUser,
    getSelectedUserData,
    modifySelectedUserData,
    deleteSelectedUser
}