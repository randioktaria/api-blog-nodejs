const { Post } = require('../models');
const { User } = require('../models');
const { validationResult } = require('express-validator');

const path = require('path');
const fs = require('fs');

exports.getAll = (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 5;

    Post.findAndCountAll({
        offset: (page - 1) * size,
        limit: size, 
        order: [['createdAt', 'DESC']],
        include: [{
            as: 'author',
            model: User,
            attributes: ['id', 'name', 'email']
        }]
    })
    .then(result => {
        res.status(200).json({
            message: 'Get blog post seccess',
            data: result.rows,
            total_data: result.count,
            per_page: size,
            page: page
        })

    })
    .catch(err => {
        next(err)
    })
}

exports.create = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new Error('Invalid Value');
        err.errorStatus = 400;
        err.data = errors.array();
        throw err;
    }

    if (!req.file) {
        const err = new Error('Image harus diupload');
        err.errorStatus = 422;
        throw err;
    }

    const title = req.body.title;
    const image = req.file.path;
    const body = req.body.body;
    const author = 1

    Post.create({
        title: title,
        image: image,
        body:body,
        author: author
    })
    .then(result => {
        res.status(201).json({
            message: 'Created blog post seccess',
            data: result
        })   
    })
    .catch(err => {
        next(err)
    })
}

exports.getById = (req, res, next) => {
    const id = req.params.id;
    Post.findOne({
        where: {id: id}, 
        include: [{
            as: 'author',
            model: User,
            attributes: ['id', 'name', 'email']
        }]
    })
    .then(result => {
        if (!result) {
            const err = new Error('Data tidak ditemukan');
            err.errorStatus = 404;
            throw err;
        }

        res.status(200).json({
            message: `Get blog post by id ${id} seccess`,
            data: result
        })
    })
    .catch(err => {
        next(err);
    })
}

exports.update = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new Error('Invalid Value');
        err.errorStatus = 400;
        err.data = errors.array();
        throw err; 
    }

    const id = req.params.id
    const title = req.body.title;
    const body = req.body.body;
    const author = 1

    Post.findOne({where: {id: id}})
    .then(result => {
        if (!result) {
            const err = new Error('Data tidak ditemukan');
            err.errorStatus = 404;
            throw err;
        }

        if (!req.file) {
            result.image = result.image;
        } else {
            removeImage(result.image)
            result.image = req.file.path;
        }

        result.title = title;
        result.body = body;
        result.author = author;

        return result.save();

    })
    .then(result => {
        res.status(201).json({
            message: 'Updated blog post success',
            data: result
        })
    })
    .catch(err => {
        next(err)
    })
}

exports.delete = (req, res, next) => {
    const id = req.params.id
    Post.findOne({where:{id: id}})
    .then(result => {
        if (!result) {
            const err = new Error('Data tidak ditemukan');
            err.errorStatus = 404;
            throw err;
        }

        removeImage(result.image);
        return result.destroy();

    })
    .then(result => {
        res.status(200).json({
            message: `Delete blog post id ${id} success`,
            data: result
        })
    })
    .catch(err => {
        next(err);
    })
}

const removeImage = (filePath) => {
    filePath = path.join(__dirname, './..', filePath);
    fs.unlink(filePath, err => console.log(err));
}