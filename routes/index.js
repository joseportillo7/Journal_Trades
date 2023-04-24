const express = require('express')
const router = express.Router()

const { Controllers } = require('../controllers')

router.get('/login', (req, res)=>{
    res.send('Welcome to the Journal Trades!')
})

router.get('/trades', Controllers.getTrades)

module.exports = router;