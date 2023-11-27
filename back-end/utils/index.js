const bcrypt = require('bcrypt')

const cryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(5);

    return bcrypt.hash(password, salt)
}

module.exports = {
    cryptPassword
}