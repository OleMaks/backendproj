const jwt = require('jsonwebtoken');

const login = async(req, res) => {
    const { username, password } = req.body;

    if (username === 'team_lead' && password === 'admin123') {
        const userPayload = { id: 1, username: 'team_lead' };

        const token = jwt.sign(
            userPayload,
            process.env.JWT_SECRET || 'super_secret_key', { expiresIn: '2h' }
        );

        return res.status(200).send(token);
    }

    return res.status(401).send('Невірний логін або пароль.');
};

module.exports = { login };