const router = require('./routers/index')
const express = require('express'),
    app = express(),
    port = process.env.PORT || 1234,
    cors = require('cors')
    const path = require("path");
    // router = require('./routers')

require('dotenv').config()
app.use(express.json({strict: false}))
app.use(cors())
app.use('/api/v1', router)
app.use(express.static(path.join(__dirname, 'views')));


// app.use('api/v1', router)
app.get('*', (req, res) => {
    return res.status(404).json({
        error: 'endpoint is not registered'
    })
})

app.listen(port, () => {
    console.log(`server is running in port ${port}`)
})