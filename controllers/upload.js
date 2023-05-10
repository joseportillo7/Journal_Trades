const sequelize = require('../database/config')
const {validationResult} = require('express-validator')
const path = require('path')

module.exports = {
    uploadData: async(req,res) => {

        //Verifying errors from express-validator
        const errors = validationResult(req)
        if(!errors.isEmpty()) return res.status(400).json(errors)

        const { archivo } = req.files;

        const uploadPath = path.join(__dirname, '../uploads', archivo.name)
        archivo.mv(uploadPath, function(err) {
            if (err) {
            return res.status(500).send(err);
            }
            res.send('File uploaded to ' + uploadPath);
        });
    }
}
