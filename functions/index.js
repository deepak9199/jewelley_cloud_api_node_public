const functions = require("firebase-functions");
const admin = require("firebase-admin");
const serviceAccount = require("./permission.json");
const express = require("express");
const cors = require("cors");

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
const db = admin.firestore();

app.use(cors({origin: true}));
app.use(express.json()); // Middleware to parse JSON request bodies

// Basic route
app.get("/", (req, res) => {
  return res.status(200).send("Hello Bc Jewellers");
});

// Home route for fetching data from Firestore
app.get("/home", async (req, res) => {
  try {
    const productSnapshot = await db.collection("product").get();
    const productResponse = productSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const bannerSnapshot = await db.collection("banner").get();
    const bannerResponse = bannerSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const categorySnapshot = await db.collection("category").get();
    const categoryResponse = categorySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const subcategorySnapshot = await db.collection("sub-category").get();
    const subcategoryResponse = subcategorySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const responseData = {
      products: productResponse,
      banner: bannerResponse,
      category: categoryResponse,
      subcategory: subcategoryResponse,
    };

    return res.status(200).send(responseData);
  } catch (error) {
    console.error("Error fetching data from Firestore:", error);
    return res.status(500).send({error: "Internal Server Error"});
  }
});

// Export the Express app as a Firebase Function
exports.app = functions.https.onRequest(app);
