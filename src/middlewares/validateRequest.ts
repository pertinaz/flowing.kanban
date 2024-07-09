import { validationResult } from "express-validator";

const validateRequest = (req: any, res: any, next: any) => {
  const errors = validationResult(req);

  // return status code 400 and the errors
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export default validateRequest;