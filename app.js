const express = require("express");
const { auth, requiresAuth } = require("express-openid-connect");
const app = express();
const routes = require("./src/routes");

require("dotenv").config();

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: process.env.AUTH0_BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
};

app.use(express.json());
app.use(auth(config));

app.get("/", (req, res) => {
  res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
});

app.use("/api", requiresAuth(), routes);

const port = 3000;
app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
