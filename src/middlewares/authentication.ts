import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { sendResponse } from "./errorHandler";

interface CustomRequest extends Request {
  user?: string | JwtPayload;
}

const verifyToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies.token;

  if (!token) {
    sendResponse(res, 401, "No token, authorization denied");
    return;
  }

  const verifySecret = process.env.JWT_SECRET || "not defined";
  try {
    const decoded = jwt.verify(token, verifySecret);
    req.user = decoded;
    next();
  } catch (error) {
    sendResponse(res, 500, "Token is not valid");
  }
};

export default verifyToken;
// node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
