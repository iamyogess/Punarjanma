import JWT from "jsonwebtoken";

export const generateAccessToken = (user) => {
  return JWT.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
};

export const generateRefreshToken = (user) => {
  return JWT.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};
