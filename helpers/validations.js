const sequelize = require('../database/config')


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

module.exports.validations = {
    isValidIdUser,
    existUser,
    existEmail
}