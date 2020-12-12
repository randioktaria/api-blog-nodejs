const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const blog = require('../controllers/blog');

router.get('/', blog.getAll);

router.post('/post', [
    body('title')
        .isLength({min: 5}).withMessage('title min 5 character'), 
    body('body')
        .isLength({min: 5}).withMessage('body min 5 character')], blog.create);

router.get('/id/:id', blog.getById);

router.put('/update/:id', [
    body('title').isLength({min: 5}).withMessage('title min 5 character'), 
    body('body').isLength({min: 5}).withMessage('body min 5 character')], blog.update);
    
router.delete('/delete/:id', blog.delete);


module.exports = router;