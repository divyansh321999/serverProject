import jwt from 'jsonwebtoken'

const createToken = (id) => {
    const token = jwt.sign({id}, process.env.PRIVATE_KEY)
    return token
}

export default createToken