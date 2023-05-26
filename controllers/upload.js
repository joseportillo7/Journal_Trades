const sequelize = require('../database/config')
const {validationResult} = require('express-validator')
const path = require('path')
const readCSV = require('../database/upload')
const { trigger_from_upload } = require('../database/trigger')

module.exports = {
    uploadData: async(req,res) => {

        try {
            //Verifying errors from express-validator
            const errors = validationResult(req)
            if(!errors.isEmpty()) return res.status(400).json(errors)

            const { archivo } = req.files;

            const uploadPath = path.join(__dirname, '../uploads', 'FILE.csv')
            archivo.mv(uploadPath, function(err) {
                if (err) {
                return res.status(500).send(err);
                }
                //res.send('File uploaded to ' + uploadPath);
            });

            //Read csv File from next path
            const filepath = path.join(__dirname, '../uploads/FILE.csv')
            const arr = await readCSV(filepath)

            //variables to update account table
            let comision = 0
            let trigger_obj = []
            let accounts = []
            
            for(const element of arr){
                const instrument = element['Instrument'].split(' ')[0]
                const account_aux = element['Account']
                const market_pos = element['Market pos.'] //or entry
                const entry_time = element['Entry time']
                const exit_time = element['Exit time']
                const exit_name = element['Exit name'] || 'External'
                const profit_aux = element['Profit']
                const qty = parseFloat(element['Qty'])

                if(instrument === 'NQ'){
                    comision = 5
                }else if(instrument === 'MNQ'){
                    comision = 1 * qty
                }
                
                //delimiting the string account
                const account = account_aux.split('!')

                //insert into arrays
                const result_exist = accounts.some(item => item.account === account[0])
                if(!result_exist){
                    const result = await sequelize.query(`select id_account from Account where name = '${account[0]}';`,{type: sequelize.QueryTypes.SELECT})
                    if(!result.length > 0){
                        return res.status(400).json({message: `The Account '${account[0]}' doesn't exist into the database`})
                    }
                    accounts.push({ account: account[0], id: result[0].id_account})
                }
                
                let account_id = 0
                for(const item of accounts){
                    if(item.account === account[0]){
                        account_id = item.id
                    }
                }

                let profit = 0
                if(profit_aux.includes('(')){
                    const aux = profit_aux.split('(')[1].split('$')[1]
                    profit = parseFloat(aux.slice(0, aux.length -1)) * (-1)
                }else{
                    profit = parseFloat(profit_aux.split('$')[1])
                }

                // get number of the last operation
                let id_counter = await sequelize.query('select count(*) as count from Operation', { type: sequelize.QueryTypes.SELECT})
                let count = id_counter[0].count + 1

                //insert into database
                await sequelize.query(`insert into Operation(id_operation, entry_time, exit_time, entry, exit_name, profit, id_account)
                                    values(${count},'${entry_time}','${exit_time}','${market_pos}','${exit_name}',${profit}, ${account_id});`,{ type: sequelize.QueryTypes.INSERT });
                
                //insert into trigger_obj
                if(trigger_obj.length == 0){
                    //is empty, so...
                    trigger_obj.push({ id_account: account_id, profit: profit, comision: comision})
                }else{
                    const result = trigger_obj.some(account => account.id_account === account_id)
                    if(!result){
                        trigger_obj.push({ id_account: account_id, profit: profit, comision: comision})
                    }else{
                        trigger_obj.forEach(obj => {
                            if(obj.id_account === account_id){
                                obj.profit += profit
                                obj.comision += comision
                            }
                        })
                    }
                }
            }
       
            console.log(trigger_obj);
            //call to trigger to update balance
            await trigger_from_upload(trigger_obj)

            res.json({message: 'Operations were inserted successfully'})
        } catch (error) {
            throw new Error(error)
        }
    }
}
