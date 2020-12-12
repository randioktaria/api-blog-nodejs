const express = require('express');
const router = express.Router();

const  { body } = require('express-validator')

const auth = require('../controllers/auth');

router.post('/register', [
    body('name')
        .isLength({min: 5}).withMessage('name min 5 character'),
    body('email')
        .isEmail().withMessage('email not valid'),
    body('password')
        .isLength({min: 8}).withMessage('password min 8 character')
], auth.register);

module.exports = router;