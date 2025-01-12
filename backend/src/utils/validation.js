import { body, param } from "express-validator";
import { validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError.js";

export const mongoIdPathVariableValidator = (idName) => {
  return [
    param(idName).notEmpty().isMongoId().withMessage(`Invalid ${idName}`),
  ];
};

export const mongoIdRequestBodyValidator = (idName) => {
  return [body(idName).notEmpty().isMongoId().withMessage(`Invalid ${idName}`)];
};

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 *
 * @description This is the validate middleware responsible to centralize the error checking done by the `express-validator` `ValidationChains`.
 * This checks if the request validation has errors.
 * If yes then it structures them and throws an {@link ApiError} which forwards the error to the {@link } middleware which throws a uniform response at a single place
 *
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.path]: err.msg }));

  // 422: Unprocessable Entity
  throw new ApiError(422, "Received data is not valid", extractedErrors);
};