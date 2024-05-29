import jwt from "jsonwebtoken";

const generateToken = (res, user) => {
  const payload = {
    email: user.email,
    role: user.role,
  };
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "10d",
  });

  // set Jwt as HTTP-Only cookie
  const options = {
    expires: new Date(Date.now() + 3*24*60*60*1000),
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  };

  res.cookie("accessToken", accessToken, options);

  return { accessToken };
};

export default generateToken;
