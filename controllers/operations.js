const sequelize = require('../database/config')
const { validationResult } = require('express-validator')
const { trigger_to_balance } = require('../database/trigger')

module.exports = {
    insertOperation: async(req,res)=>{
        try {
            //Verifying errors from express-validator
            const errors = validationResult(req)
            if(!errors.isEmpty()) return res.status(400).json(errors)

            const { instrument, entry_time, exit_time, entry, exit_name, profit, account_name} = req.body

            if(instrument === 'NQ'){
                comision = 5
            }else if(instrument === 'MNQ'){
                comision = 1
            }

            const result = await sequelize.query(`select id_account from Account where name = '${account_name}';`,{type: sequelize.QueryTypes.SELECT})
            const idaccount = result[0].id_account

            const profit_account = parseFloat(profit) - comision

            let id_counter = await sequelize.query('select count(*) as count from Operation', { type: sequelize.QueryTypes.SELECT})
            let count = id_counter[0].count +1

            await sequelize.query(`insert into Operation(id_operation, entry_time, exit_time, entry, exit_name, profit, id_account)
                                    values(${count},'${entry_time}','${exit_time}','${entry}','${exit_name}',${profit_account}, ${idaccount});`,{ type: sequelize.QueryTypes.INSERT });
            
            await trigger_to_balance(profit_account, idaccount)
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
    },

    deleteOperation: async(req,res)=>{
        try {
            //Verifying erros from express-validator
            const errors = validationResult(req)
            if(!errors.isEmpty()) return res.status(400).json(errors)

            const idoperation = Number(req.params.id)
            await sequelize.query(`delete from Operation where id_operation = ${idoperation}`,{type: sequelize.QueryTypes.DELETE})

            res.json({message: 'The operation was deleted successfully'})
        } catch (error) {
            throw new Error(error)
        }
    },
}