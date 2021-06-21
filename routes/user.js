const { User } = require("../models/index");
const { Op } = require("sequelize");
const { FirebaseScrypt } = require("firebase-scrypt");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const verify = promisify(jwt.verify);
const { Parser } = require("json2csv");
const { writeFile } = require("fs").promises;

const firebaseParameters = {
  memCost: parseInt(process.env.mem_cost),
  rounds: parseInt(process.env.rounds),
  saltSeparator: "Bw==",
  signerKey: process.env.base64_signer_key
};

const scrypt = new FirebaseScrypt(firebaseParameters);

exports.readMany = async (req, res) => {
  let { currentPage, itemsPerPage, searchTerm } = req.query;
  let filters = {};
  if (searchTerm) {
    filters.name = { [Op.like]: "%" + searchTerm + "%" };
  }

  where = {};

  if ("sa" !== req.user.role) {
    where = {
      ...where,
      PlatformId: req.user.PlatformId
    };
  }

  try {
    const found = await User.findAll({
      attributes: { exclude: ["password", "salt"] },
      where,
      limit: itemsPerPage || 100,
      //offset: (currentPage - 1) * itemsPerPage,
      order: [["createdAt", "DESC"]]
    });
    res.json(found);
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.upsert = async (req, res) => {
  try {
    let instance;
    //Checks if the request includes a token parameter in the body.
    if (req.body.token) {
      const { token } = req.body;
      try {
        const tokenData = await verify(token, process.env.SECRET);
        //If role is found update the role on the body object, that will be used for the upsert.
        if (tokenData.hasOwnProperty("role")) {
          const { role } = tokenData;
          req.body.role = role;
        }
      } catch (e) {
        console.log("User role will not updated.");
      }
    }

    if (req.body.id) {
      if (!req.body.password || "" === req.body.password) {
        delete req.body.password;
      } else {
        // hash password
        req.body.password = User.hash(req.body.password);
      }
      await User.update(req.body, {
        where: { id: req.body.id }
      });
      return res.json([req.body, false]);
    } else {
      if (req.body.email) {
        const existing = await User.findOne({
          where: { email: req.body.email }
        });

        if (existing) {
          console.log("An account with that email address already exists");
          return res.status(400).json("An account with that email address already exists");
        }
      }

      if (req.body.password && "" !== req.body.password) {
        //console.log("password is", req.body.password);
        // hash password
        req.body.password = User.hash(req.body.password);
      } else if ("" === req.body.password) {
        delete req.body.password;
      }
      instance = await User.create(req.body);
      return res.json([instance, true]);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

exports.delete = async (req, res) => {
  try {
    const instance = await User.findByPk(req.params.id);
    await instance.destroy();
    res.json();
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

exports.export = async (req, res) => {
  // export to CSV

  where = {};

  if ("sa" !== req.user.role) {
    where = {
      ...where,
      PlatformId: req.user.PlatformId
    };
  }

  const data = await User.findAll({ where });

  const parser = new Parser({
    fields: ["name", "email"]
  });
  const csv = parser.parse(data);
  await writeFile(__dirname + "/.." + `/download.csv`, csv);
  res.download(__dirname + "/.." + `/download.csv`);
};

exports.signin = async (req, res) => {
  try {
    const oneMonth = 1000 * 60 * 60 * 24 * 30;
    const { email: emailAddress, password } = req.body;

    let user = await User.findOne({ where: { email: emailAddress } });

    if (!user) throw new Error("User not found");

    if (user.firebase) {
      const hash = await scrypt.hash(password, user.salt);
      if (hash === user.password) {
        // login successfully, set cookie
        const token = jwt.sign({ id: user.id }, process.env.SECRET, {
          expiresIn: oneMonth
        });
        res.cookie("token", token, {
          signed: true,
          maxAge: oneMonth,
          httpOnly: true
        });
        return res.json(({ id, email, name, role, platform } = user));
      } else {
        throw new Error("Incorrect credentials");
      }
    } else {
      // use basic auth
      if (await User.isCorrectPassword(password, user.password)) {
        const token = jwt.sign({ id: user.id }, process.env.SECRET, {
          expiresIn: oneMonth
        });
        res.cookie("token", token, {
          signed: true,
          maxAge: oneMonth,
          httpOnly: true
        });
        return res.json(({ id, email, name, role } = user));
      } else {
        throw new Error("Incorrect password");
      }
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Incorrect credentials" });
  }
};

exports.status = async (req, res) => {
  try {
    const token = req.signedCookies.token;
    if (!token) throw new Error("No token provided");
    const { id } = await verify(token, process.env.SECRET);
    const user = await User.findByPk(id);
    if (!user) throw new Error("Invalid credentials");
    return res.json({ currentUser: user, isAuthenticated: true });
  } catch (err) {
    res.cookie("token", null, {
      maxAge: 0,
      httpOnly: true
    });
    return res.json({ isAuthenticated: false });
  }
};

exports.signout = (req, res) => {
  // sign out
  res
    .cookie("token", null, {
      maxAge: 0,
      httpOnly: true
    })
    .json();
};

exports.getAdmins = async (req, res) => {
  // TODO: admin of selected platform req.params.PlatformId

  if (!req.query.PlatformId) {
    req.query.PlatformId = 10;
  }
  try {
    const found = await User.findAll({
      attributes: { exclude: ["password", "salt"] },
      where: { role: "admin", PlatformId: req.query.PlatformId },
      order: [["createdAt", "DESC"]]
    });
    res.json(found);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

exports.checkEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const instance = await User.findOne({ where: { email } });
    if (instance) {
      return res.json(true);
    } else {
      return res.json(false);
    }
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.ban = async (req, res) => {
  try {
    if (req.params.id && ("sa" === req.user.role || "admin" === req.user.role)) {
      await User.update(
        { banned: true },
        {
          where: { id: req.params.id }
        }
      );
      return res.json({ success: true });
    }
    return res.json({ success: false });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};
