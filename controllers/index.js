const sequelize = require('../database/config')
const { validationResult } = require('express-validator')

module.exports.Controllers = {

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

            await sequelize.query(`update User set name = '${name}', email = '${email}', password = '${password}'
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

            const iduser = Number(req.params.id)
            await sequelize.query(`update User set password = '${password}'
                                    where id_user = ${iduser};`,{type: sequelize.QueryTypes.UPDATE})
            res.json({message: `Password was updated successfully`})
        } catch (error) {
            throw new Error(error)
        }
    },


    /**
     * Controllers for Accounts of Users.
     */
    createAccount: async(req,res) => {
        try {
            //Verifying errors from express-validator
            const errors = validationResult(req)
            if(!errors.isEmpty()) return res.status(400).json(errors)

            const {name, type_account, balance, id_user} = req.body

            const iduser = Number(id_user)
            const balance_account = Number(balance)

            let id_counter = await sequelize.query('select count(*) from Account', { type: sequelize.QueryTypes.SELECT})
            let count = Object.values(id_counter[0])[0]+1

            await sequelize.query(`insert into Account(id_account,name,type_account,balance,id_user)
                                    values(${count},'${name}','${type_account}','${balance_account}', ${iduser});`, { type: sequelize.QueryTypes.INSERT });
            res.json({message: 'Account was created successfully'})
        } catch (error) {
            throw new Error(error)
        }
    },

    /**
     * Controllers for Operations
     */
    insertOperation: async(req,res)=>{
        try {
            //Verifying errors from express-validator
            const errors = validationResult(req)
            if(!errors.isEmpty()) return res.status(400).json(errors)

            const {entry, exit_name, profit, account_name} = req.body

            const result = await sequelize.query(`select id_account from Account where name = '${account_name}';`,{type: sequelize.QueryTypes.SELECT})
            const idaccount = result[0].id_account

            const profit_account = Number(profit)

            let id_counter = await sequelize.query('select count(*) from Operation', { type: sequelize.QueryTypes.SELECT})
            let count = Object.values(id_counter[0])[0]+1

            await sequelize.query(`insert into Operation(id_operation,entry,exit_name,profit,id_account)
                                    values(${count},'${entry}','${exit_name}',${profit_account}, ${idaccount});`,{ type: sequelize.QueryTypes.INSERT });
            res.json({message: 'Operation was inserted successfully'})
            
        } catch (error) {
            throw new Error(error)
        }
    },

    getOperations: async(req,res)=>{
        try {
            //Verifying errors from express-validator
            const errors = validationResult(req)
            if(!errors.isEmpty()) return res.status(400).json(errors)

            const account = req.params.account

            const result = await sequelize.query(`select id_account from Account where name = '${account}';`,{type: sequelize.QueryTypes.SELECT})
            const idaccount = result[0].id_account

            const operations = await sequelize.query(`select * from Operation where id_account = ${idaccount} `, { type: sequelize.QueryTypes.SELECT })

            res.json(operations)
        } catch (error) {
            throw new Error(error)
        }
    }
}