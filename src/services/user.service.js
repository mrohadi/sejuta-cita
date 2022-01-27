import userModel from "../models/user.model";

export default async function userService() {
  return {
    getUsersAsync: () => await userModel.find(),
    getUserAsync: (id) => await userModel.findById(id),
    addUserAsync: (data) => await new userModel(data).save(),
  };
}
