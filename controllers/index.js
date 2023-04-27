const sequelize = require('../database/config')

module.exports.Controllers = {

    getUsers: async(req,res)=>{
        try {
            const users = await sequelize.query('SELECT * FROM User', { type: sequelize.QueryTypes.SELECT });
            res.json(users)
        } catch (error) {
            console.log('An error occur getting users '+ error);
            throw new Error(error)
        }
    },
    getUserById: async(req,res)=>{
        try {
            const iduser = Number(req.params.id)
            const user = await sequelize.query(`select * from User where id_user = ${iduser}`, {type: sequelize.QueryTypes.SELECT})
            res.json(user)
        } catch (error) {
            throw new Error(error)
        }
    },
    CreateUser: async(req,res)=>{
        const {name, email, password} = req.body
        try {
            let id_counter = await sequelize.query('select count(*) from User', { type: sequelize.QueryTypes.SELECT})
            let count = Object.values(id_counter[0])[0]+1
            await sequelize.query(`insert into User(id_user,name,email,password,state) values(${count},'${name}','${email}','${password}', ${true});`, { type: sequelize.QueryTypes.INSERT });
            res.json({message: 'User created successfully'})
        } catch (error) {
            console.log('An error occur creating user ' + error);
            throw new Error(error)
        }
        
    }
}