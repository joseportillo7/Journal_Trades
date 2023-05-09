const sequelize = require('../database/config')
const { validationResult } = require('express-validator')

module.exports = {

    createAccount: async(req,res) => {
        try {
            //Verifying errors from express-validator
            const errors = validationResult(req)
            if(!errors.isEmpty()) return res.status(400).json(errors)

            const {name, type_program, type_account, balance, email} = req.body

            const result = await sequelize.query(`select id_user from User where email = '${email}';`,{type: sequelize.QueryTypes.SELECT})
            const iduser = result[0].id_user
            const balance_account = Number(balance)

            let id_counter = await sequelize.query('select count(*) from Account', { type: sequelize.QueryTypes.SELECT})
            let count = Object.values(id_counter[0])[0]+1

            await sequelize.query(`insert into Account(id_account,name,type_program,type_account,balance,state,id_user)
                                    values(${count},'${name}','${type_program}','${type_account}','${balance_account}',${true}, ${iduser});`, { type: sequelize.QueryTypes.INSERT });
            res.json({message: 'Account was created successfully'})
        } catch (error) {
            throw new Error(error)
        }
    },
    getAccounts: async(req, res) =>{
        try {
            //Verifying errors from express-validator
            const errors = validationResult(req)
            if(!errors.isEmpty()) return res.status(400).json(errors)

            const email = req.params.email

            const result = await sequelize.query(`select id_user from User where email = '${email}';`,{type: sequelize.QueryTypes.SELECT})
            const iduser = result[0].id_user

            const accounts = await sequelize.query(`select * from Account where id_user = ${iduser} and state = ${true};`,{type: sequelize.QueryTypes.SELECT})

            res.json(accounts)
        } catch (error) {
            throw new Error(error)
        }
    },
    deleteAccount: async(req, res)=>{
        try {
            //Verifying errors from express-validator
            const errors = validationResult(req)
            if(!errors.isEmpty()) return res.status(400).json(errors)

            const account = req.params.account

            await sequelize.query(`update Account set state = ${false} where name = '${account}'`,{type: sequelize.QueryTypes.UPDATE})
            res.json({message: 'Account was deleted successfully'})
        } catch (error) {
            throw new Error(error)
        }
    },
}