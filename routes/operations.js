const express = require('express')
const { check } = require('express-validator')
const routeroperation = express.Router()
const { validations } = require('../helpers/validations')

const { insertOperation, getOperations, deleteOperation } = require('../controllers/operations')

/**
 * METHODS FOR OPERATIONS
 */
routeroperation.post('/insertOperation', [

    check('instrument').notEmpty().withMessage('The field instrument cannot be empty'),
    check('instrument').isIn(['NQ', 'MNQ']).withMessage('You must use only this types of instruments: NQ, MNQ,'),
    check('entry_time').notEmpty().withMessage('The field entry time cannot be empty'),
    check('exit_time').notEmpty().withMessage('The field exit time cannot be empty'),
    check('entry').notEmpty().withMessage('The field entry cannot be empty'),
    check('exit_name').notEmpty().withMessage('The field exit name cannot be empty'),
    check('profit').notEmpty().withMessage('The field profit cannot be empty'),
    check('account_name').notEmpty().withMessage('The field name account cannot be empty'), //this validation it will remove afterward (maybe)

    //custom validations
    check('account_name').custom(validations.validateAccount)

], insertOperation)

routeroperation.get('/:account',[

    check('account').notEmpty().withMessage('The field account cannot be empty'),

    //custom validations
    check('account').custom(validations.validateAccount)

], getOperations)

routeroperation.delete('/deleteOperation/:id',[
    check('id').notEmpty().withMessage('The param id cannot be empty')
], deleteOperation)


module.exports = routeroperation;