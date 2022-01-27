const allAccess = (req, res) => {
  res.status(200).send("Public content");
};

const userBoard = (req, res) => {
  res.status(200).send("User content");
};

const adminBoard = (req, res) => {
  res.status(200).send("Admin content");
};

export default {
  allAccess,
  userBoard,
  adminBoard,
};
