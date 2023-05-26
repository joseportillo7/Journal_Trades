const sequelize = require('./config')

const trigger_to_balance = async(total, idaccount) => {
    try {
        const result = await sequelize.query(`select * from Account where id_account = ${idaccount};`,{type: sequelize.QueryTypes.SELECT})
        
        const current_balance = parseFloat(result[0].balance)
        const current_available = parseFloat(result[0].available)
        const current_top_limit = parseFloat(result[0].top_limit)
        const type_drawdown = result[0].stop_type
        const current_drawdown = parseFloat(result[0].drawdown)

        let new_balance = current_balance
        let new_available = current_available
        let new_drawdown = current_drawdown
        let new_top_limit = current_top_limit
        if(type_drawdown === 'static'){
            new_balance += total
            new_available += total
            if(new_balance > current_top_limit){
                new_top_limit = new_balance
            }
        }else{
            //dynamic
            new_balance += total
            if(new_balance > current_top_limit){
                new_top_limit = new_balance
                new_drawdown += total
            }else{
                new_available += total
            }
        }    

        await sequelize.query(`update Account set balance = ${new_balance}, available = ${new_available}, drawdown = ${new_drawdown}, 
                                top_limit = ${new_top_limit} where id_account = ${idaccount}`,{type: sequelize.QueryTypes.UPDATE})
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