const express = require('express')
const { check } = require('express-validator')
const routeruser = express.Router()
const { validations } = require('../helpers/validations')

const { getUsers, getUserById, createUser, deleteUserById, updateUserById, updatePassword } = require('../controllers/users')

/**
 * METHODS FOR USER
 */

routeruser.get('/users', getUsers)

routeruser.get('/:id', [
    check('id').notEmpty().withMessage(`Id cannot be empty`),

    //custom validations
    check('id').custom(validations.isValidIdUser),
    check('id').custom(validations.existUser)

], getUserById)

routeruser.post('/createUser', [

    check('name').notEmpty().withMessage('The field name cannot be empty'),
    check('email').notEmpty().withMessage('The field email cannot be empty'),
    check('password').notEmpty().withMessage('The field password cannot be empty'),

    //custom validations
    check('email').custom(validations.existEmail)

],createUser)

routeruser.put('/updateUser/:id', [

    check('id').notEmpty().withMessage(`Id cannot be empty`),
    check('name').notEmpty().withMessage('The field name cannot be empty'),
    check('email').notEmpty().withMessage('The field email cannot be empty'),
    check('password').notEmpty().withMessage('The field password cannot be empty'),

    //custom validations
    check('id').custom(validations.isValidIdUser),
    check('email').custom(validations.existEmail),
    check('id').custom(validations.existUser)

],updateUserById)

routeruser.delete('/deleteUser/:id', [

    check('id').notEmpty().withMessage(`Id cannot be empty`),

    //custom validations
    check('id').custom(validations.isValidIdUser),
    check('id').custom(validations.existUser)

],deleteUserById)

routeruser.put('/updatePassword/:id',[
    
    check('id').notEmpty().withMessage(`Id cannot be empty`),
    check('password').notEmpty().withMessage('The field password cannot be empty'),

    //custom validations
    check('id').custom(validations.isValidIdUser),
    check('id').custom(validations.existUser),

], updatePassword)


module.exports = routeruser;