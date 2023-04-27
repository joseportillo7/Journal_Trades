const sequelize = require('../database/config')

module.exports.Controllers = {

    getUsers: async(req,res)=>{
        try {
            const users = await sequelize.query(`select * from User where state = ${true} `, { type: sequelize.QueryTypes.SELECT });
            res.json(users)
        } catch (error) {
            console.log('An error occur getting users '+ error);
            throw new Error(error)
        }
    },
    getUserById: async(req,res)=>{
        try {
            const iduser = Number(req.params.id)
            const user = await sequelize.query(`select * from User where id_user = ${iduser} and state = ${true}`, {type: sequelize.QueryTypes.SELECT})
            if(!user.length > 0) return res.json({message: `User with id: ${iduser} doesn't exist into the database`})

            res.json(user)
        } catch (error) {
            throw new Error(error)
        }
    },
    createUser: async(req,res)=>{
        const {name, email, password} = req.body
        try {
            let id_counter = await sequelize.query('select count(*) from User', { type: sequelize.QueryTypes.SELECT})
            let count = Object.values(id_counter[0])[0]+1
            await sequelize.query(`insert into User(id_user,name,email,password,state) 
                                    values(${count},'${name}','${email}','${password}', ${true});`, { type: sequelize.QueryTypes.INSERT });
            res.json({message: 'User was created successfully'})
        } catch (error) {
            console.log('An error occur creating user ' + error);
            throw new Error(error)
        }
        
    },
    updateUserById: async(req,res)=>{
        const {name, email, password} = req.body
        const id_user = Number(req.params.id)
        
        try {
            const user = await sequelize.query(`select * from User where id_user = ${id_user}`,{type: sequelize.QueryTypes.SELECT})
            if(!user.length > 0) return res.json({message: `The user with id ${id_user} doesn't exist into the database`})

            await sequelize.query(`update User set name = '${name}', email = '${email}', password = '${password}'
                                    where id_user = ${id_user};`,{type: sequelize.QueryTypes.UPDATE})
            res.json({message: 'User was updated successfully'})
        } catch (error) {
            throw new Error(error)
        }
    },
    deleteUserById: async(req,res) => {
        try {
            const id_user = Number(req.params.id)
            const user = await sequelize.query(`select id_user from User where id_user = ${id_user};`,{type: sequelize.QueryTypes.SELECT})
            if(!user.length > 0) return res.json({message: `The user with id ${id_user} doesn't exist into the database`})

            await sequelize.query(`update User set state = ${false} 
                                    where id_user = ${id_user};`,{type: sequelize.QueryTypes.UPDATE})
            res.json({message: `User with id: ${id_user} was deleted`})
        } catch (error) {
            throw new Error(error)
        }
    }

}