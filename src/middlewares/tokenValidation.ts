import jwt from "jsonwebtoken";

const verifyToken = (req: any, res: any, next: any): any => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const toVerify = process.env.JWT_SECRET || "not defined";
  try {
    const decoded = jwt.verify(token, toVerify);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(500).json({ message: "Token is not valid" });
  }
};

export default verifyToken;
// node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
