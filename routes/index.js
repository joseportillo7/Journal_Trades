const express = require('express')
const router = express.Router()

const { Controllers } = require('../controllers')

//methods for User
router.get('/users', Controllers.getUsers)
router.get('/user/:id', Controllers.getUserById)
router.post('/createUser', Controllers.createUser)
router.put('/updateUser/:id', Controllers.updateUserById)
router.delete('/deleteUser/:id',Controllers.deleteUserById)


//methods for Account

//Methods for Operation


module.exports = router;