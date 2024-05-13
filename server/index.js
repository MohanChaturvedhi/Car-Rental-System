const express = require("express");
const db = require("./db/index.js");
const cors = require("cors");
const adminRoutes = require("./routes/adminRoutes.js");
const authRoutes = require("./routes/authRoutes.js");
const carRoutes = require("./routes/carRoutes.js");
const app = express();

const startApp = async () =>  {
    await db.connect();
    app.listen(3000);
}
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use("/admin", adminRoutes);
app.use("/auth", authRoutes);
app.use("/cars", carRoutes);
startApp();