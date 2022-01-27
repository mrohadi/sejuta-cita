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

  app.get("/api/test/all", userController.allAccess);

  app.get(
    "/api/test/user",
    [jwt.authJwt.verifyToken],
    userController.userBoard
  );

  app.get(
    "/api/test/admin",
    [jwt.authJwt.verifyToken, jwt.authJwt.isAdmin],
    userController.adminBoard
  );
};

export default userRoute;
