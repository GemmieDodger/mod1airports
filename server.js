const express = require('express')
const app = express()
const swaggerUi = require('swagger-ui-express')
const airports = require('./airports.json')
const YAML = require('yamljs')
const docs = YAML.load('./airports-config.yaml')
const swaggerDocs = require('swagger-jsdoc')({
    swaggerDefinition: docs,
    apis: ['./server.js', './Airport.js']
})

/**
 * @swagger 
 * 
*  /airports:
*    get:
*    summary: Returns a list of all the airports
*    responses:
*        200:
*        description: an array of JSON objects that represent each airport
*        content:
*            application/json:
*            schema:
*                $ref: './Airport.js'
*/
app.get('/airports', (req, res) => {
    res.send(airports)
})

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, {explorer: true}))

app.listen(3000, () => console.log("Airport API ready. Documents at http://localhost:3000/api-docs"))
