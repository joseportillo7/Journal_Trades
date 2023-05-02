const express = require('express')
const { check } = require('express-validator')
const router = express.Router()
const { validations } = require('../helpers/validations')

const { Controllers } = require('../controllers')

/**
 * METHODS FOR USER
 */

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

router.put('/updatePassword/:id',[
    
    check('id').notEmpty().withMessage(`Id cannot be empty`),
    check('password').notEmpty().withMessage('The field password cannot be empty'),

    //custom validations
    check('id').custom(validations.isValidIdUser),
    check('id').custom(validations.existUser),

], Controllers.updatePassword)


/**
 * METHODS FOR ACCOUNT
 */

router.get('/accounts/:email',[

    check('email').notEmpty().withMessage('The field email cannot be empty'),

    //custom validations
    check('email').custom(validations.validateEmail)

],Controllers.getAccounts)

router.post('/createAccount', [

    check('name').notEmpty().withMessage('The field name cannot be empty'),
    check('type_program').notEmpty().withMessage('The field type program cannot be empty'),
    check('type_program').isIn(['9K', '50K', '100K', '200K']).withMessage('You must use only this types of programs: 9K, 50K, 100K, 200K'),
    check('type_account').notEmpty().withMessage('The field type account cannot be empty'),
    check('type_account').isIn(['DEMO', 'REAL']).withMessage('You must use only this types of accounts: DEMO, REAL'),
    check('balance').notEmpty().withMessage('The field balance cannot be empty'),
    check('email').notEmpty().withMessage('The field email cannot be empty'), //this validation it will remove afterward (maybe)

    //custom validations
    check('email').custom(validations.validateEmail),
    check('name').custom(validations.existAccount)

], Controllers.createAccount)

router.delete('/deleteAccount/:account',[

    check('account').notEmpty().withMessage('The field account cannot be empty'),

    //custom validations
    check('account').custom(validations.validateAccount)

],Controllers.deleteAccount)

/**
 * METHODS FOR OPERATIONS
 */
router.post('/insertOperation', [

    check('entry').notEmpty().withMessage('The field entry cannot be empty'),
    check('exit_name').notEmpty().withMessage('The field exit name cannot be empty'),
    check('profit').notEmpty().withMessage('The field profit cannot be empty'),
    check('account_name').notEmpty().withMessage('The field name account cannot be empty'), //this validation it will remove afterward (maybe)

    //custom validations
    check('account_name').custom(validations.validateAccount)

], Controllers.insertOperation)

router.get('/operations/:account',[

    check('account').notEmpty().withMessage('The field account cannot be empty'),

    //custom validations
    check('account').custom(validations.validateAccount)

], Controllers.getOperations)

module.exports = router;