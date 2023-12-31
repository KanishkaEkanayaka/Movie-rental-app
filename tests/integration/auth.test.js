const request = require('supertest');
const { User } = require('../../models/user');
const { Genre } = require('../../models/genre');
let server;

describe('auth middleware',()=>{
    beforeEach(()=>{
        server = require('../../index');
    });
    afterEach(async()=>{
        await server.close();
        await Genre.deleteMany({});
    });

    //set things need for the happy path and then change them in the error paths tests
    let token;

    beforeEach(()=>{
        token = new User().generateAuthToken();
    })

    const exec = ()=>{
        return request(server)
        .post('/api/genres')
        .set('x-auth-token',token)
        .send({name:'genre1'});
    }

    it('should return 401 if no token is provided',async()=>{
        token = '';
        const res = await exec();
        expect(res.status).toBe(401);
    });

    it('should return 400 if token is invalid',async()=>{
        token = 'invalid-token';
        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return 200 if token is valid',async()=>{
        const res = await exec();
        expect(res.status).toBe(200);
    });
});