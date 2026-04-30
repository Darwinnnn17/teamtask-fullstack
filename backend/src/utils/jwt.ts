import jwt, { SignOptions } from "jsonwebtoken";

type JwtPayload = {
  userId: string;
  role: "ADMIN" | "MEMBER";
};

export const generateToken = (payload: JwtPayload) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  const options: SignOptions = {
    expiresIn: "7d",
  };

  return jwt.sign(payload, secret, options);
};

export const verifyToken = (token: string) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.verify(token, secret) as JwtPayload;
};