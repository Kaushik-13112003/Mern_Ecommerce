const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
  try {
    let hash = await bcrypt.hash(password, 10);
    return hash;
  } catch (err) {
    console.log(err);
  }
};

const normalPassword = async (password, hashedPassword) => {
  try {
    let compare = await bcrypt.compare(password, hashedPassword);
    return compare;
  } catch (err) {
    console.log(err);
  }
};

module.exports = { normalPassword, hashPassword };
