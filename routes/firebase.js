const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");
const { users: firebaseUsers } = require("../users.json");
const { User } = require("../models/index");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://tribe-social-network.firebaseio.com"
});

const db = admin.firestore();
// to get the users:
// $ firebase auth:export users --format=JSON --project=tribe-social-network
// copy over the file to ./users.json, then, run convert to export them into mysql

exports.convert = async (req, res) => {
  // import firebase data into mysql
  const snapshot = await db.collection("users").get();

  snapshot.forEach(async doc => {
    const firebaseUser = firebaseUsers.find(u => u.email === doc.data().email);

    if (!firebaseUser) return;

    const existingUser = await User.findOne({
      where: { email: doc.data().email }
    });
    if (existingUser) return;

    firebaseUser.name =
      firebaseUser.displayName ||
      (firebaseUser.providerUserInfo && firebaseUser.providerUserInfo.displayName);
    firebaseUser.password = firebaseUser.passwordHash;
    firebaseUser.providerId = firebaseUser.providerUserInfo.providerId;
    firebaseUser.providerRawId = firebaseUser.providerUserInfo.rawId;
    firebaseUser.providerEmail = firebaseUser.providerUserInfo.email;
    firebaseUser.providerPhotoUrl = firebaseUser.providerUserInfo.photoUrl;

    firebaseUser.role = "superAdmin" === doc.data().role ? "sa" : doc.data().role;
    firebaseUser.platform = doc.data().platform;

    let date = new Date(parseInt(firebaseUser.createdAt));
    if (isNaN(date.getTime())) {
      // date is not valid
      date = new Date();
    }

    firebaseUser.createdAt = date;
    firebaseUser.firebase = true;

    await User.create(firebaseUser);
  });

  res.json({ message: "ok" });
};
