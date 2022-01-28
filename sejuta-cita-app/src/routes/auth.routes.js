/**
 * Author: Muhammad Rohadi
 * Email: muhammadrohadi03@gmail.com
 * Purpose: Sejuta Cita Backend Engineer Assessment
 * Description: This file is intented for all of Authentication related route request
 */

import authController from "../controllers/auth.controller.js";
import verifySignUp from "../middlewares/verify.sign-up.js";

/**
 * Defines Authentication route
 * @param {} app An instance of express function
 * @name POST: /api/auth/signup
 * @name POST: /api/auth/signin
 */
const authRoute = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );

    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,
    ],
    authController.signUpController
  );

  app.post("/api/auth/signin", authController.signInController);

  app.post("/api/auth/refresh-token", authController.refreshToken);
};

export default authRoute;
