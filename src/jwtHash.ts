exports = {
    jwt: {
        password: process.env.JWT_SECRET,
        options: {
            expiresIn: process.env.JWT_EXPIRES_IN,
        },
    },
};