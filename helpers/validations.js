const sequelize = require('../database/config')

const existUser = async(id) => {
    try {
        const id_user = Number(id)
        const user = await sequelize.query(`select * from User where id_user = ${id_user};`,{type: sequelize.QueryTypes.SELECT})
        if(!user.length > 0 || user[0].state === 0) return `The user with ID: ${id} doesn't exist into the database`

        return user
    } catch (error) {
        throw new Error(error)
    }
}

const existEmail = async(email,{req}) => {
    try {
        const iduser = req.params.id
        const user = await sequelize.query(`select * from User where email = '${email}'`,{type: sequelize.QueryTypes.SELECT})
        if(user.length > 0){
            if(user[0].id_user !== Number(iduser)){
                throw new Error(`The user with the email '${email}' already exist`)
            }
        } 
    } catch (error) {
        throw new Error(error)
    }
}

module.exports.validations = {
    existUser,
    existEmail
}