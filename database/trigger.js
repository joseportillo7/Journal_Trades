const sequelize = require('./config')

const trigger_to_balance = async(total, idaccount) => {
    try {
        const result = await sequelize.query(`select balance from Account where id_account = ${idaccount};`,{type: sequelize.QueryTypes.SELECT})
        
        const current_balance = parseFloat(result[0].balance)

        const new_balance = current_balance + total
        await sequelize.query(`update Account set balance = ${new_balance} where id_account = ${idaccount}`,{type: sequelize.QueryTypes.UPDATE})
    } catch (error) {
        throw new Error(error)
    }
}

const trigger_from_upload = async(obj) =>{
    try {
        for(const element of obj){
            const total = element.profit - element.comision
            await trigger_to_balance(total, element.id_account)
        }
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = {
    trigger_to_balance,
    trigger_from_upload,
}