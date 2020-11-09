const express = require("express");
const connectDb = require("./config/db");
const path = require("path");
const app = express();
app.use(express.json({ extended: false }));
connectDb();
const newLocal = "/api/user";
app.use(newLocal, require("./routes/apis/user"));
app.use("/api/auth", require("./routes/apis/auth"));
app.use("/api/post", require("./routes/apis/post"));
app.use("/api/profile", require("./routes/apis/profile"));

if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
//port
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log("Server started on port 5001"));
