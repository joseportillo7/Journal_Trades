const express = require('express')
const { check } = require('express-validator')
const router = express.Router()
const { validations } = require('../helpers/validations')

const { Controllers } = require('../controllers')

//methods for User
router.get('/users', Controllers.getUsers)

router.get('/user/:id', [
    check('id').notEmpty().withMessage(`Id cannot be empty`),

    //custom validations
    check('id').custom(validations.isValidIdUser),
    check('id').custom(validations.existUser)

], Controllers.getUserById)

router.post('/createUser', [

    check('name').notEmpty().withMessage('The field name cannot be empty'),
    check('email').notEmpty().withMessage('The field email cannot be empty'),
    check('password').notEmpty().withMessage('The field password cannot be empty'),

    //custom validations
    check('email').custom(validations.existEmail)

],Controllers.createUser)

router.put('/updateUser/:id', [

    check('id').notEmpty().withMessage(`Id cannot be empty`),
    check('name').notEmpty().withMessage('The field name cannot be empty'),
    check('email').notEmpty().withMessage('The field email cannot be empty'),
    check('password').notEmpty().withMessage('The field password cannot be empty'),

    //custom validations
    check('id').custom(validations.isValidIdUser),
    check('email').custom(validations.existEmail),
    check('id').custom(validations.existUser)

],Controllers.updateUserById)

router.delete('/deleteUser/:id', [

    check('id').notEmpty().withMessage(`Id cannot be empty`),

    //custom validations
    check('id').custom(validations.isValidIdUser),
    check('id').custom(validations.existUser)

],Controllers.deleteUserById)


//methods for Account

//Methods for Operation


module.exports = router;