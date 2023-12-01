require("dotenv").config();
const express = require("express");

const app = express();
const port = process.env.PORT || 1234;
const cors = require("cors");
const router = require("./routers");

app.use(express.json({ strict: false }));
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/api/v1", router);
app.get("*", (req, res) => res.status(404).json({
  error: "endpoint is not registereds",
}));

app.listen(port, () => {
  console.log(`server is running in port ${port}`);
});
