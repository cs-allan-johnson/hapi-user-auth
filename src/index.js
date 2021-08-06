const hapi = require('@hapi/hapi');
const jwt = require('jsonwebtoken')
const app = hapi;

const init = async () => {

    const server = app.server({
        port: 3000,
        host: 'localhost'
    })

    server.route({
        method: 'GET',
        path: '/',
        handler: (req, res) => {
            const obj = {
                message: "route is ready!"
            }
            return obj
        }
    })

    server.route({
        method: 'GET',
        path: '/users',
        handler: (req, res) => {
            try {
                const allUsers = [
                    { id: 1, name: "Allan" },
                    { id: 2, name: "Ana" },
                    { id: 3, name: "Everaldo" }
                ]
                const secret = 'nossaSECRETA'
                const token = req.headers.authorization
                const decode = jwt.verify(token, secret)
                if (decode) {
                    return allUsers
                }
            } catch (err) {
                throw boom.badRequest(err)
            }
        }
    })

    server.route({
        method: 'POST',
        path: '/login',
        handler: (req, res) => {
            if (req.payload.user === 'username' && req.payload.pwd === '1234') {
                const id = 1
                const secret = 'nossaSECRETA'
                const token = jwt.sign({ id }, secret, {
                    expiresIn: 3000,
                    algorithm: 'HS256',
                })
                return { token }
            }
            return res.response().code(401)
        }
    })


    await server.start();
    console.log('server runnig on', server.info.uri)
}

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1)
})


init();
