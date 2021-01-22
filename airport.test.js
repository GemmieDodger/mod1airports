const app = require('./server')
const request = require('supertest')


describe("connect to airport server", () => {
    test("get all airports", (done) => {
        request(app)
        .get('/airports')
        .expect(200)
        .expect(response => {
            expect(response.body.length).toBeGreaterThan(2800)
        })
        .end(done)
    })
    test("can you paginate", (done) => {
        request(app)
        .get('/airports?page=2')
        .expect(200)
        .expect(response => {
            expect(response.body.length).toBe(99)
        })
        .end(done)
    })

    test("can you read a single airport", (done) => {
        request(app)
        .get('/airports/00AK')
        .expect(200)
        .end(done)
    })
    test("can you update", (done) => {
        //"icao":"00AK"
        request(app)
        .put('/airports/00AK')
        .send({name : 'Gemma'})
        .set('Accept', 'application/json')
        .expect(200)
        .expect(res => {
            expect(res.body.name).toBe('Gemma')
        })
        .end(done)
    })
    test("can you delete", (done) => {
        //"icao":"00AK"
        request(app)
        .delete('/airports/00AK')
        .expect(200)
        .end(() => {
          request(app)
            .delete('/airports/00AK')
            .expect(404)
            .end(done)
        })
    })

        //https://www.npmjs.com/package/supertest
     it('responds with create json', function(done) {
        request(app)
            .post('/airports')
            .send({icao : 'hello'})
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(done)
            
        })

})
