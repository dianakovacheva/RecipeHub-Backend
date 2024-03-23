const env = process.env.NODE_ENV || "development";

const config = {
  development: {
    port: process.env.BE_PORT || 3000,
    dbURL: "mongodb://localhost:27017/recipeHub",
    origin: [
      "http://localhost:5555",
      "http://localhost:4200",
      "https://recipehub-20652.web.app",
      "https://recipehub-20652.firebaseapp.com",
    ],
  },
  production: {
    port: process.env.BE_PORT || 3000,
    dbURL: process.env.DB_URL_CREDENTIALS,
    origin: [
      "http://localhost:5555",
      "http://localhost:4200",
      "https://recipehub-20652.web.app",
      "https://recipehub-20652.firebaseapp.com",
    ],
  },
};

module.exports = config[env];
