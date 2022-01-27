import authController from "../controllers/auth.controller.js";
import verifySignUp from "../middlewares/verify.sign-up.js";

/**
 * Authentication route
 * @param {} app
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
};

export default authRoute;
