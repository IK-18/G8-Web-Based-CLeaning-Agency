const bcrypt = require("bcryptjs");

module.exports.hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);

    return hash;
  } catch (err) {
    throw err;
  }
};

module.exports.comparePasswordWithHash = async (password, pHash) => {
  try {
    return await bcrypt.compare(password, pHash);
  } catch (err) {
    throw err;
  }
};
