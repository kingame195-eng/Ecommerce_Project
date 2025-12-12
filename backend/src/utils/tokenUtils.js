import crypto from "crypto";

//Generate random token (32 characters)
export const generateToken = () => { 
    return crypto.randomBytes(16).toString("hex");
 }

 //Calculate token expiry (15 minutes from now)
 export const getTokenExpiry = (minutesFromNow = 15) => {
  const now = new Date();
  return new Date(now.getTime() + minutesFromNow * 60000);
};

//Check if token has expired
export const isTokenExpired = (expiresAt) => {
  return new Date() > new Date(expiresAt);
};