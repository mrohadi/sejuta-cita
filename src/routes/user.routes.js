/**
 * Author: Muhammad Rohadi
 * Email: muhammadrohadi03@gmail.com
 * Purpose: Sejuta Cita Backend Engineer Assessment
 * Description: This file is intented for all of Users resources routing request
 */

import userController from "../controllers/user.controller.js";
import jwt from "../middlewares/index.js";

/**
 * Defines all of user rousources routing
 * @param {} app Instance of express function
 */
const userRoute = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );

    next();
  });

  app.get(
    "/api/users",
    [jwt.authJwt.verifyToken, jwt.authJwt.isAdmin],
    userController.getAllUsers
  );

  app.get(
    "/api/user/:userId",
    [jwt.authJwt.verifyToken],
    userController.getUserById
  );

  app.put(
    "/api/user/:userId",
    [jwt.authJwt.verifyToken, jwt.authJwt.isAdminOrUser],
    userController.updateUser
  );

  app.delete(
    "/api/user/:userId",
    [jwt.authJwt.verifyToken, jwt.authJwt.isAdminOrUser],
    userController.deleteUser
  );
};

export default userRoute;
