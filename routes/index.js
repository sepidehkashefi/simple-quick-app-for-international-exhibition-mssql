module.exports = (app) => {
    const user = require('./user.routes')(app)
    const represent= require('./represent.routes')(app)
    const company= require('./company.routes')(app)
    const mobile= require('./mobile.routes')(app)
    const States = require('./states.routes')(app)
    const agent = require('./agent.routes')(app)
}