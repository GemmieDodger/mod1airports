const express = require('express')
const app = express()
const swaggerUi = require('swagger-ui-express')
const airports = require('./airports.json')
const YAML = require('js-yaml')
const fs = require('fs')
const docs = YAML.load(fs.readFileSync('./airports-config.yaml').toString())
const swaggerDocs = require('swagger-jsdoc')({
    swaggerDefinition: docs,
    apis: ['./server.js', './Airport.js']
})
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//patch a single airport


//get all airports
/**
 * @swagger 
 * 
*  /airports:
*    get:
*      summary: Returns a list of all the airports
*      responses:
*        200:
*          description: an array of JSON objects that represent each airport
*          content:
*            application/json:
*              schema:
*                $ref: './Airport.js'
*/
app.get('/airports', (req, res) => {
    if(req.query.page) {
        const {page = 1, pageSize = 100} = req.query
        const begin = (page*100)-100
        const end = begin+99
        res.send(airports.slice(begin, end))
    } else {
        res.send(airports)
    }
})

//get a single airport
/**
 * @swagger 
 * 
*  /airports:
*    get:
*      summary: Returns a chosen airport
*      responses:
*        200:
*          description: aJSON object  for an airport
*          content:
*            application/json:
*              schema:
*                $ref: './Airport.js'
*/

app.get('/airports/:icao', (req, res) => {
    const { icao } = req.params
    var airport = {}
    var exists = 0
      for(let i = 0; i < airports.length; i++) {
          if(airports[i].icao === icao) {
              airport = airports[i];
              exists = 1
              break
          } 
      }
      if(exists !== 1) {
          res.sendStatus(404) 
      } else {
        res.send(airport)
      }
  

})

//create a single airport
/**
 * @swagger 
*  /airports:
*    post:
*      summary: Create a new airport
*      requestBody:
*        required: true
*        content:
*          application/json:
*            schema:
*              $ref: './Airport.js'
*      responses:
*        201:
*          description: Created
*        415: 
*          description: Unsupported Media Type
*          content: 
*            'application/json': {}
*        400:
*          description: Bad request
*          content: 
*            'application/json': {}
*        418:
*          description: I'm a teapot
*          content: 
*            'application/json': {}
*        500: 
*          description: Internal server Error
*          content:
*            'application/json': {}
*        401: 
*          description: Unauthorized
*          content:
*            'application/json': {}
*/
app.post('/airports', (req, res) => {
    airports.push(res.json(req.body))
    // res.json(req.body)
})

//"icao":"00AK"

/**
 * @swagger 
*  /airports/:icao:
*    delete:
*      summary: Deletes airport with this name
*      description: |
*        delete airport
*      responses:
*        200:
*          description: deleted airport
*        204:
*          description: no content
*        404:
*          description: page not found
*/
app.delete('/airports/:icao', (req, res) => {
  const { icao } = req.params;
  var exists = 0
    for(let i = 0; i < airports.length; i++) {
        if(airports[i].icao === icao) {
            airports.splice(i, 1);
            exists = 1
            break
        } 
    }
    if(exists !== 1) {
        res.sendStatus(404) 
    } else {
        res.json({ deleted: icao });
    }
});

/**
 * @swagger 
*  /airports/:icao:
*    put:
*      summary: Update an airport
*      requestBody:
*        required: true
*        content:
*          application/json:
*            schema:
*              $ref: './Airport.js'
*      responses:
*        201:
*          description: Updated
*        202:
*          description: Accepted
*        400:
*          description: Bad request
*          content: 
*            'application/json': {}
*        418:
*          description: I'm a teapot
*          content: 
*            'application/json': {}
*        500: 
*          description: Internal server Error
*          content:
*            'application/json': {}
*        401: 
*          description: Unauthorized
*          content:
*            'application/json': {}
*/

app.put('/airports/:icao', (req, res) => {
    const { icao } = req.params;
    var index = ''
    var updates = req.body
    for(let i = 0; i < airports.length; i++) {
        if(airports[i].icao === icao) {
            index = i
            break
        } 
    }
    const airport = airports[index]
    console.log(updates)
    for(let j in updates) {
        console.log(j)
        if(airport.hasOwnProperty(j)) {
            airport[j] = updates[j]
        }
    }
    if(index === '') {
        res.sendStatus(404) 
    } else {
        console.log(airport)
        res.send(airport);
    }
  });

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, {explorer: true}))

module.exports = app