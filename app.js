const express = require("express");
const app = express();
const port = 3000;
const routes = require("./src/routes");

app.use(express.json());
app.use("/", routes);

app.get("/", (req, res) => {
  res.send("Its connected");
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
