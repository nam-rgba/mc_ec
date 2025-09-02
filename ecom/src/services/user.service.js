const userRepo= require('../repository/user.repository')


const findOneUserByEmail = async (email, select) =>{
    const userFound = await userRepo.findOne({email: email}, select)
    return userFound
}

const createNewUser = async (data) =>{
    return await userRepo.create(data)
}


module.exports = {findOneUserByEmail, createNewUser}