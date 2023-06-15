const sequelize = require('./config')

const trigger_to_balance = async(total, idaccount) => {
    try {
        const result = await sequelize.query(`select * from Account where id_account = ${idaccount};`,{type: sequelize.QueryTypes.SELECT})
        
        const current_balance = parseFloat(result[0].balance)
        const current_available = parseFloat(result[0].available)
        const current_top_limit = parseFloat(result[0].top_limit)
        const type_drawdown = result[0].stop_type
        const current_drawdown = parseFloat(result[0].drawdown)
        
        if(type_drawdown === 'static'){
            [balance, available, drawdown, top_limit] = update_balance_static(total,current_balance,current_available,current_drawdown,current_top_limit)
            
        }else{
            [balance, available, drawdown, top_limit]  = update_balance_dynamic(total,current_balance,current_available,current_drawdown,current_top_limit)
        }         

        await sequelize.query(`update Account set balance = ${balance}, available = ${available}, drawdown = ${drawdown}, 
                                 top_limit = ${top_limit} where id_account = ${idaccount}`,{type: sequelize.QueryTypes.UPDATE})
    } catch (error) {
        throw new Error(error)
    }
}

const update_balance_dynamic = (total,current_balance,current_available,current_drawdown,current_top_limit) => { 
    
    let new_balance = current_balance + total
    let new_available = current_available
    let new_drawdown = current_drawdown
    let new_top_limit = current_top_limit

    if(current_top_limit > new_balance){
        new_available = new_balance - current_drawdown

        return [new_balance, new_available, current_drawdown, current_top_limit]
    }else{
        new_top_limit += total
        new_drawdown += new_balance - current_top_limit
        new_available = new_balance - new_drawdown

        return [new_balance, new_available, new_drawdown, new_top_limit]
    }
}

const update_balance_static = (total,current_balance,current_available,current_drawdown,current_top_limit)=>{

    let new_balance = current_balance + total
    let new_available = current_available
    let new_drawdown = current_drawdown
    let new_top_limit = current_top_limit

    if(current_top_limit > new_balance){
        new_available = new_balance - current_drawdown

        return [new_balance, new_available, current_drawdown, current_top_limit]
    }else{
        new_top_limit += total
        new_available = new_balance - new_drawdown

        return [new_balance, new_available, new_drawdown, new_top_limit]
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