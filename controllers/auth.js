const { User } = require('../models');
const { validationResult } = require('express-validator');

exports.register = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new Error('Invalid Value');
        err.errorStatus = 400;
        err.data = errors.array();
        throw err;
    }

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    // cek email di databse

    User.findOne({where: {email: email}})
    .then(result => {
        if (result) {
            const err = new Error('Email is Already Exists');
            err.errorStatus = 400;
            throw err;
        } else {
            return User.create({
                name: name,
                email: email,
                password: password
            })
        }
    })
    .then(result => {
        res.status(201).json({
            message: 'Register User Success',
            data: {
                id: result.id,
                name: result.name,
                email: result.email,
            }
        });
    })
    .catch(err => {
        next(err)
    });
}