
const findAllUsers = async () => {
    const users = await userModel.find({});
    return users;
};
