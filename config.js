module.exports = {
  databaseURL: "mongodb://mongo:27017/chat",
  application: {
    cors: {
      server: [
        {
          origin: "*",
          credentials: false,
        },
      ],
    },
  },
};
