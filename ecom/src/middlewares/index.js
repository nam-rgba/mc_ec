const { method } = require('lodash')
const Logger = require('../log/log.service')

const pushToLogServer = async (req, res, next) => {
    try {

        res.on('finish', () => {
            const method = req.method
            const start = Date.now()
            const code = res.statusCode
            const host = `${req.get('host')}${req.originalUrl}`;
            const content = req.body
            Logger.sendFormatCode({ method, start, code, host, content })
        })


        return next()
    } catch (error) {
        next(error)
    }
}

module.exports = {
    pushToLogServer
}

