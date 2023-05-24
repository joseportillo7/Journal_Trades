const sequelize = require('../database/config')
const { validationResult } = require('express-validator')
const { validations } = require('../helpers/validations') 

module.exports = {

    createAccount: async(req,res) => {
        try {
            //Verifying errors from express-validator
            const errors = validationResult(req)
            if(!errors.isEmpty()) return res.status(400).json(errors)

            const {name, type_program, type_account, email} = req.body

            const result = await sequelize.query(`select id_user from User where email = '${email}';`,{type: sequelize.QueryTypes.SELECT})
            const iduser = result[0].id_user

            let id_counter = await sequelize.query('select id_account from Account order by id_account desc limit 1', { type: sequelize.QueryTypes.SELECT})
            const count = id_counter[0].id_account + 1

            const { profit_target, available, daily_loss_limit, drawdown, topLimit, stop_type, rules, balance} = validations.typeProgram(type_program)

            await sequelize.query(`insert into Account(id_account,name,type_program,type_account,balance,state,id_user,available,stop_type,drawdown,top_limit,daily_loss_limit,rules,profit_target)
                                    values(${count},'${name}','${type_program}','${type_account}',${balance},${true}, ${iduser},
                                    ${available},'${stop_type}',${drawdown},${topLimit},${daily_loss_limit},${rules},${profit_target});`, { type: sequelize.QueryTypes.INSERT });
            res.json({message: 'Account was created successfully'})
        } catch (error) {
            console.log(error);
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