import bcrypt from 'bcryptjs'

const hashLogic  = (password) => {
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);
    return hash
}

export default hashLogic