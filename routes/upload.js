const { uploadData } = require('../controllers/upload')
const { check } = require('express-validator')
const express = require('express')
const { validations } = require('../helpers/validations')

const router = express.Router()
const path = require('path');

router.post('/', [
  check('archivo').custom(validations.validExtension)
], uploadData);

module.exports = router

