import { Request, Response, NextFunction } from "express";
import { validationResult, ValidationChain } from "express-validator";

// Middleware function to validate incoming requests
const validateRequest = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ errors: errors.array() });
  };
};

export default validateRequest;
