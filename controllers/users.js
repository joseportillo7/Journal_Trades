const sequelize = require('../database/config')
const { validationResult } = require('express-validator')
const bcryptjs = require('bcryptjs')

module.exports = {

    /**
     * Controllers for User
     */

    getUsers: async(req,res)=>{
        try {
            const users = await sequelize.query(`select * from User where state = ${true} `, { type: sequelize.QueryTypes.SELECT });
            res.json(users)
        } catch (error) {
            console.log('An error occur getting users '+ error);
            throw new Error(error)
        }
    },
    getUserById: async(req,res)=>{
        try {
            //Verifying errors from express-validator
            const errors = validationResult(req)
            if(!errors.isEmpty()) return res.status(400).json(errors)
            const id_user = Number(req.params.id)
            const user = await sequelize.query(`select * from User where id_user = ${id_user};`,{type: sequelize.QueryTypes.SELECT})
            res.json(user)
        } catch (error) {
            throw new Error(error)
        }
    },
    createUser: async(req,res)=>{
        try {
            //Verifying errors from express-validator
            const errors = validationResult(req)
            if(!errors.isEmpty()) return res.status(400).json(errors)

            const {name, email, password} = req.body

             //encrypting password
             const salt = bcryptjs.genSaltSync()//default: 10
             const newpassword = bcryptjs.hashSync(password, salt)

            let id_counter = await sequelize.query('select count(*) from User', { type: sequelize.QueryTypes.SELECT})
            let count = Object.values(id_counter[0])[0]+1
            await sequelize.query(`insert into User(id_user,name,email,password,state) 
                                    values(${count},'${name}','${email}','${newpassword}', ${true});`, { type: sequelize.QueryTypes.INSERT });
            res.json({message: 'User was created successfully'})
        } catch (error) {
            console.log('An error occur creating user ' + error);
            throw new Error(error)
        }
        
    },
    updateUserById: async(req,res)=>{
        try {
            //Verifying errors from express-validator
            const errors = validationResult(req)
            if(!errors.isEmpty()) return res.status(400).json(errors)

            const {name, email, password} = req.body

             //encrypting password
             const salt = bcryptjs.genSaltSync()//default: 10
             const newpassword = bcryptjs.hashSync(password, salt)

            const iduser = Number(req.params.id)

            await sequelize.query(`update User set name = '${name}', email = '${email}', password = '${newpassword}'
                                    where id_user = ${iduser};`,{type: sequelize.QueryTypes.UPDATE})
            res.json({message: 'User was updated successfully'})

        } catch (error) {
            throw new Error(error)
        }
    },
    deleteUserById: async(req,res) => {
        try {
            //Verifying errors from express-validator
            const errors = validationResult(req)
            if(!errors.isEmpty()) return res.status(400).json(errors)

            const iduser = Number(req.params.id)
            await sequelize.query(`update User set state = ${false} 
                                    where id_user = ${iduser};`,{type: sequelize.QueryTypes.UPDATE})
            res.json({message: `User with id: ${iduser} was deleted successfully`})
        } catch (error) {
            throw new Error(error)
        }
    },

    updatePassword: async(req, res) =>{
        try {
            //Verifying errors from express-validator
            const errors = validationResult(req)
            if(!errors.isEmpty()) return res.status(400).json(errors)

            const { password } = req.body

             //encrypting password
             const salt = bcryptjs.genSaltSync()//default: 10
             const newpassword = bcryptjs.hashSync(password, salt)

            const iduser = Number(req.params.id)
            await sequelize.query(`update User set password = '${newpassword}'
                                    where id_user = ${iduser};`,{type: sequelize.QueryTypes.UPDATE})
            res.json({message: `Password was updated successfully`})
        } catch (error) {
            throw new Error(error)
        }
    },
}