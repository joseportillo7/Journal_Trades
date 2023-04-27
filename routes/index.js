const express = require('express')
const router = express.Router()

const { Controllers } = require('../controllers')


router.get('/users', Controllers.getUsers)
router.get('/user/:id', Controllers.getUserById)
router.post('/createUser', Controllers.CreateUser)

module.exports = router;