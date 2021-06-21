const express = require("express");
const passport = require("passport");
const app = express();
require("dotenv").config();
require("./config/passport/config");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");
const logger = require("morgan");
const AWS = require("aws-sdk");
const multer = require("multer");
const fs = require("fs");
const auth = require("./middleware/auth");
const { parse } = require("url");

app.use(logger("dev"));

// config
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(process.env.SECRET));

app.use(passport.initialize());

// routes
const platform = require("./routes/platform");
const user = require("./routes/user");
const content = require("./routes/content");
const collection = require("./routes/collection");
const link = require("./routes/link");
const ad = require("./routes/ad");
const chat = require("./routes/chat");
//const firebaseRoutes = require("./routes/firebase");

app.get("/ping", (req, res) => {
  res.send("pong");
});

// Platforms:
app.get("/platform", auth.isAuthorized, platform.readMany);
app.get("/platform/:slug", platform.get);
app.get("/platform/by-homepage-url/:homepageUrl", platform.getByHomepageURL);
app.post("/platform", platform.upsert);
app.delete("/platform/:id", platform.delete);
//Reset Platform Tokens
app.patch("/platform/tokens/:slug", platform.resetTokens);
app.get("/platform/analytics/:id", platform.getAnalytics);

// Users:
app.get("/user", auth.isAuthorized, user.readMany);
app.post("/user", user.upsert);
app.delete("/user/:id", user.delete);
app.get("/user/export", auth.isAuthorized, user.export);
app.get("/user/admins", user.getAdmins);
app.delete("/user/ban/:id", auth.isAuthorized, user.ban);

app.get("/user/validate/:email", user.checkEmail);
// Auth
app.get("/auth/status", user.status);
app.post("/auth/signin", user.signin);
app.post("/auth/signout", user.signout);

// facebook auth
app.get("/auth/facebook", passport.authenticate("facebook", { session: false }));
app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/auth/success",
    failureRedirect: "/auth/error"
  })
);
// google auth
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false
  })
);
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/auth/success",
    failureRedirect: "/auth/error"
  })
);
// redirect uris
app.get("/auth/success", (req, res) => {
  return res.sendFile(path.join(__dirname + "/close.html"));
  // res.json({ message: "success" });
});
app.get("/auth/error", (req, res) => {
  return res.sendFile(path.join(__dirname + "/close.html"));
  //res.status(401).send("An error has occurred.");
});

// Collection:
app.get("/collection", auth.isAuthorized, collection.readMany);
app.post("/collection", collection.upsert);
app.delete("/collection/:id", collection.delete);
app.get("/collection/:PlatformId", collection.getCollectionByPlatform);

// Content:
app.get("/content", auth.isAuthorized, content.readMany);
app.post("/content", content.upsert);
app.delete("/content/:id", content.delete);

// Ad:
app.get("/ad", auth.isAuthorized, ad.readMany);
app.post("/ad", ad.upsert);
app.delete("/ad/:id", ad.delete);

// Link:
app.get("/link", auth.isAuthorized, link.readMany);
app.post("/link", link.upsert);
app.delete("/link/:id", link.delete);

// Chat
app.get("/chat/:id", chat.readMany);
app.post("/chat", chat.create);
app.delete("/chat/:id/:delete", auth.isAuthorized, chat.delete);

// Firebase utils:
//app.post("/firebase", firebaseRoutes.convert);

// Multer
// set up s3
const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCESS_ID,
  secretAccessKey: process.env.S3_SECRET_KEY
});

app.get("/jw/:partialName", (req, res) => {
  var params = {
    Bucket: process.env.BUCKET_NAME /* required */,
    Prefix: "video" // folder name
  };

  s3.listObjectsV2(params, function (err, data) {
    if (err) {
      console.log(err, err.stack);
    } else {
      const found = (data.Contents || []).find(
        file => file && file.Key.includes(req.params.partialName)
      );
      if (found) {
        res.json({
          url: "https://" + process.env.CLOUDFRONT_URL + "/" + found.Key
        });
      } else {
        res.json({ error: "not found" });
      }
    }
  });
});

const getContentType = filename => {
  const extension = filename.split(".").pop();
  switch (extension) {
    case "svg":
      return "image/svg+xml";
    case "jpg":
      return "image/jpeg";
    case "gif":
      return "image/gif";
    case "png":
      return "image/png";
    case "mp4":
      return "video/mp4";
    default:
      return "application/octet-stream";
  }
};

const upload = multer({ dest: "uploads/", limits: { fileSize: "5000mb" } });

app.post("/upload", upload.array("image", 1), (req, res, next) => {
  if (!req.files[0]) return res.status(400).json({ error: "Please specify a file to upload" });

  s3.upload(
    {
      Bucket: process.env.BUCKET_NAME,
      Key: Date.now().toString() + "-" + req.files[0].originalname,
      Body: fs.createReadStream(req.files[0].path),
      ACL: "public-read",
      ContentType: getContentType(req.files[0].originalname)
    },
    (err, data) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: "An error ocurred" });
      } else {
        console.log("upload success", { latestUploadedFileUrl: data.Key });
        return res.json({ latestUploadedFileUrl: data.Key });
      }
    }
  );
});

// Serve static files and the production build
app.use(express.static(path.join(__dirname, "build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/build/index.html"));
});

app.listen(process.env.PORT || 3001, () => {
  console.log(`Tribe App listening at http://localhost:${process.env.PORT || 3001}`);
});
