const express = require("express");
const { db, collection } = require("./src/firebaseConfig.js");
require("dotenv").config();

const app = express();
const PORT = 5000;

app.use(express.json());

app.use("/api/auth", require("./src/routes/authRoutes"));

app.use("/api/child", require("./src/routes/childRoutes"));
app.use("/api/activity", require("./src/routes/actvitiesRoutes.js"));
app.use("/api/test", require("./src/routes/testRoutes.js"));


app.listen(PORT, () => {
  console.log(`Port is running on port ${PORT}`);
});
