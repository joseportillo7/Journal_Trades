const express = require('express')
const { check } = require('express-validator')
const routeraccount = express.Router()
const { validations } = require('../helpers/validations')

const { createAccount, getAccounts, deleteAccount } = require('../controllers/accounts')

/**
 * METHODS FOR ACCOUNT
 */

routeraccount.get('/:email',[

    check('email').notEmpty().withMessage('The field email cannot be empty'),

    //custom validations
    check('email').custom(validations.validateEmail)

],getAccounts)

routeraccount.post('/createAccount', [

    check('name').notEmpty().withMessage('The field name cannot be empty'),
    check('type_program').notEmpty().withMessage('The field type program cannot be empty'),
    check('type_program').isIn(['9K', '50K', '100k', '200K']).withMessage('You must use only this types of programs: 9K, 50K, 100K, 200K'),
    check('type_account').notEmpty().withMessage('The field type account cannot be empty'),
    check('type_account').isIn(['DEMO', 'REAL']).withMessage('You must use only this types of accounts: DEMO, REAL'),
    check('balance').notEmpty().withMessage('The field balance cannot be empty'),
    check('email').notEmpty().withMessage('The field email cannot be empty'), //this validation it will remove afterward (maybe)

    //custom validations
    check('email').custom(validations.validateEmail),
    check('name').custom(validations.existAccount)

], createAccount)

routeraccount.delete('/deleteAccount/:account',[

    check('account').notEmpty().withMessage('The field account cannot be empty'),

    //custom validations
    check('account').custom(validations.validateAccount)

],deleteAccount)


module.exports = routeraccount;