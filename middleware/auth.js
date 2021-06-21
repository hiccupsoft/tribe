const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const verify = promisify(jwt.verify);
const { User } = require("../models/index");

module.exports.isAuthorized = async (req, res, next) => {
  try {
    const token = req.signedCookies.token;
    if (!token) throw new Error("No token provided");
    const { id } = await verify(token, process.env.SECRET);
    const user = await User.findByPk(id);
    if (!user) throw new Error("Invalid credentials");
    //console.log(user.get({ plain: true }));
    if ("sa" !== user.role && "admin" !== user.role) throw new Error("Insufficient role");
    req.user = user;
    return next();
  } catch (err) {
    err.status = 400;
    return next(err);
  }
};
