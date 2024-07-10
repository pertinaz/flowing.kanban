import { Request, Response } from "express";

const errorHandler = (err: any, _req: Request, res: Response) => {
  console.error(err.stack); // show error stack trace in console

  // status code and error message handling
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    error: {
      message: err.message,
      stack:
        process.env.NODE_ENV === "production"
          ? "Error details are hidden"
          : err.stack,
    },
  });
};

// error type
export interface CustomError extends Error {
  code?: number;
  details: string;
}

export const sendResponse = (
  res: Response,
  status: number,
  message: string,
  data: any = null
) => {
  res.status(status).json({ message, data });
};

export default errorHandler;
