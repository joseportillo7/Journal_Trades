const sequelize = require('../database/config')
const path = require('path')


const isValidIdUser = (id) =>{
    const id_user = Number(id)
    if(isNaN(id_user)) throw new Error('The id_user should be type Number')
    return true
}

const existUser = async(id) => {
    const id_user = Number(id)
    const user = await sequelize.query(`select * from User where id_user = ${id_user};`,{type: sequelize.QueryTypes.SELECT})
    if(!user.length > 0 || user[0].state === 0){
        throw new Error(`The user with ID: ${id_user} doesn't exist into the database`)
    }
   return user
}

const existEmail = async(email,{req}) => {
    const iduser = req.params.id
    const user = await sequelize.query(`select * from User where email = '${email}'`,{type: sequelize.QueryTypes.SELECT})
    if(user.length > 0){
        if(user[0].id_user !== Number(iduser)){
            throw new Error(`The user with the email '${email}' already exist`)
        }
    }
}

const validateEmail = async(email) =>{
    const user = await sequelize.query(`select * from User where email = '${email}'`,{type: sequelize.QueryTypes.SELECT})
    if(!user.length > 0){
        throw new Error(`The email '${email}' doesn't exist into the database`)
    }
    return user
}

const existAccount = async(account_name) =>{
    const account = await sequelize.query(`select * from Account where name = '${account_name}';`,{type: sequelize.QueryTypes.SELECT})
    if(account.length > 0){
        throw new Error(`The Account '${account_name}' already exist`)
    }
}

const validateAccount = async(account, {req}) =>{
    const account_result = await sequelize.query(`select * from Account where name = '${account}' and state = ${true};`,{type: sequelize.QueryTypes.SELECT})
    if(!account_result.length > 0){
        throw new Error(`The Account '${account_name}' doesn't exist into the database`)
    }else{
        return req.account = account_result
    }
}

const validExtension = (value, { req }) => {

    if(!req.files){
        throw new Error(`Select a file please`);
    }

    const archivo = req.files.archivo;

    if (path.extname(archivo.name) !== '.csv') {
      throw new Error('The file must be CSV type');
    }

    return true;
}

const typeProgram = (program) =>{
    switch (program) {
        case '100k':
            return {
                profit_target: 6000.00,
                available: 3000.00,
                daily_loss_limit: 2200.00,
                drawdown: 97000.00,
                topLimit: 100000.00,
                stop_type: 'dinamic',
                rules: 0, //0 - nothing, 1 - daily loss limit, 2 - drawdown, 3 - both
                balance: 100000.00
            }
        case '150k':
            return {
                profit_target: 5000.00,
                available: 5000.00,
                daily_loss_limit: 2500.00,
                drawdown: 145000.00,
                topLimit: 150000.00,
                stop_type: 'static',
                rules: 0, //0 - nothing, 1 - daily loss limit, 2 - drawdown, 3 - both
                balance: 150000.00
            }
        case '200k':
            return {
                profit_target: 10000.00,
                available: 5000.00,
                daily_loss_limit: 4000.00,
                drawdown: 195000.00,
                topLimit: 200000.00,
                stop_type: 'dinamic',
                rules: 0, //0 - nothing, 1 - daily loss limit, 2 - drawdown, 3 - both
                balance: 200000.00
            }
        case '50k':
            return {
                profit_target: 2500.00,
                available: 2000.00,
                daily_loss_limit: 1100.00,
                drawdown: 48000.00,
                topLimit: 50000.00,
                stop_type: 'dinamic',
                rules: 0, //0 - nothing, 1 - daily loss limit, 2 - drawdown, 3 - both
                balance: 50000.00
            }
        case '25k':
            return {
                profit_target: 2500.00,
                available: 2000.00,
                daily_loss_limit: 1000.00,
                drawdown: 23000.00,
                topLimit: 25000.00,
                stop_type: 'static',
                rules: 0, //0 - nothing, 1 - daily loss limit, 2 - drawdown, 3 - both
                balance: 25000.00
            }
        case '9k':
            return {
                profit_target: 900.00,
                available: 800.00,
                daily_loss_limit: 350.00,
                drawdown: 8200.00,
                topLimit: 9000.00,
                stop_type: 'dinamic',
                rules: 0, //0 - nothing, 1 - daily loss limit, 2 - drawdown, 3 - both
                balance: 9000.00
            }
        default:
            break;
    }
}


module.exports.validations = {
    isValidIdUser,
    existUser,
    existEmail,
    validateEmail,
    existAccount,
    validateAccount,
    validExtension,
    typeProgram
}