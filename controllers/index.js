const sequelize = require('../database/config')
const { validationResult } = require('express-validator')
const { validations } = require('../helpers/validations')

module.exports.Controllers = {

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
            const iduser = Number(req.params.id)
            const user = await validations.existUser(iduser)
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

            let id_counter = await sequelize.query('select count(*) from User', { type: sequelize.QueryTypes.SELECT})
            let count = Object.values(id_counter[0])[0]+1
            await sequelize.query(`insert into User(id_user,name,email,password,state) 
                                    values(${count},'${name}','${email}','${password}', ${true});`, { type: sequelize.QueryTypes.INSERT });
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

            const iduser = Number(req.params.id)
            const user = await validations.existUser(iduser)

            if(!user.length > 0) return res.json({message: `The user with id ${iduser} doesn't exist into the database`})

            await sequelize.query(`update User set name = '${name}', email = '${email}', password = '${password}'
                                    where id_user = ${iduser};`,{type: sequelize.QueryTypes.UPDATE})
            res.json({message: 'User was updated successfully'})

        } catch (error) {
            throw new Error(error)
        }
    },
    deleteUserById: async(req,res) => {
        try {
            
            const iduser = Number(req.params.id)
            const user = await validations.existUser(iduser)

            if(!user.length > 0) return res.json({message: `The user with id ${iduser} doesn't exist into the database`})

            await sequelize.query(`update User set state = ${false} 
                                    where id_user = ${iduser};`,{type: sequelize.QueryTypes.UPDATE})
            res.json({message: `User with id: ${iduser} was deleted successfully`})
        } catch (error) {
            throw new Error(error)
        }
    }

}