//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Book = require('../models/Book');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();


chai.use(chaiHttp);
//Our parent block
describe('Books', () => {
    beforeEach((done) => { //Before each test we empty the database
        Book.deleteMany({}, (err) => {
           done();
        });
    });
/*
  * Test the /GET route
  */
  describe('/GET book', () => {
      it('it should GET all the books', (done) => {
        chai.request(server)
            .get('/books')
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('array');
                  res.body.length.should.be.eql(0);
              done();
            });
      });

      it('it should POST a book ', (done) => {
        let book = {
            title: "The Lord of the Rings",
            author: "J.R.R. Tolkien",
            year: 1954,
            pages: 1170
        }
      chai.request(server)
          .post('/books')
          .send(book)
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Book successfully added!');
                res.body.book.should.have.property('title');
                res.body.book.should.have.property('author');
                res.body.book.should.have.property('pages');
                res.body.book.should.have.property('year');
            done();
          });
    });
  });

});

  /*
  * Test the /POST route
  */
  describe('/POST book', () => {
    it('it should not POST a book without pages field', (done) => {
        let book = {
            title: "The Lord of the Rings",
            author: "J.R.R. Tolkien",
            year: 1954
        }
      chai.request(server)
          .post('/books')
          .send(book)
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                res.body.errors.should.have.property('pages');
                res.body.errors.pages.should.have.property('kind').eql('required');
            done();
          });
    });

    /*
  * Test the /GET/:id route
  */
  describe('/GET/:id book', () => {
    it('it should GET a book by the given id', (done) => {
        let book = new Book({ title: "The Lord of the Rings", author: "J.R.R. Tolkien", year: 1954, pages: 1170 });
        book.save((err, book) => {
            chai.request(server)
          .get('/books/' + book.id)
          .send(book)
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('title');
                res.body.should.have.property('author');
                res.body.should.have.property('pages');
                res.body.should.have.property('year');
                res.body.should.have.property('_id').eql(book.id);
            done();
          });
        });

    });
});

/*
  * Test the /PUT/:id route
  */
describe('/PUT/:id book', () => {
    it('it should UPDATE a book given the id', (done) => {
        let book = new Book({title: "The Chronicles of Narnia", author: "C.S. Lewis", year: 1948, pages: 778})
        book.save((err, book) => {
              chai.request(server)
              .put('/books/' + book.id)
              .send({title: "The Chronicles of Narnia", author: "C.S. Lewis", year: 1950, pages: 778})
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Book updated!');
                    res.body.book.should.have.property('year').eql(1950);
                done();
              });
        });
    });
});

/*
  * Test the /DELETE/:id route
  */
describe('/DELETE/:id book', () => {
    it('it should DELETE a book given the id', (done) => {
        let book = new Book({title: "The Chronicles of Narnia", author: "C.S. Lewis", year: 1948, pages: 778})
        book.save((err, book) => {
              chai.request(server)
              .delete('/books/' + book.id)
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Book successfully deleted!');
                    res.body.result.should.have.property('ok').eql(1);
                    res.body.result.should.have.property('n').eql(1);
                done();
              });
        });
    });
});

});

// TAMBAHAN
// berikut kode untuk testing upload file:

// contoh untuk POST tanpa upload file:
// it(‘should signup a user’,
//     async () => {
//       const response = await chai.request(app)
//         .post(signupUrl)
//         .send({
//           firstName: 'franklin',
//           lastName: 'Isaiah',
//           phoneNumber: '123345756',
//           age: '11',
//           gender: 'male',
//           state: 'lagos',
//           country: 'Nigeria',
//           email: 'login@user.com',
//           password: 'password',
//         });
//       expect(response.body).to.be.an('object');
//       expect(response.body.status).to.equal(201);
//       expect(response.body.data).to.have.property('id');
//       expect(response.body.data).to.have.property('email');
//       expect(response.body.data).to.have.property('firstName');
//       expect(response.body.data).to.have.property('lastName');
//       expect(response.body.data).to.have.property('phoneNumber');
//       expect(response.body.data).to.have.property('age');
//       expect(response.body.data).to.have.property('gender');
//       expect(response.body.data).to.have.property('state');
//       expect(response.body.data).to.have.property('country');
//     },
//   );

// CONTOH KODE UNTUK UPLOAD FILE:
// import fs
// import fs from 'fs';
// it(‘should signup a user’,
//   async () => {
//     const response = await chai.request(app)
//       .post(signupUrl)
//       .set('Content-Type', 'application/x-www-form-urlencoded')
//       .field('firstName', 'franklin')
//       .field('lastName', 'Isaiah')
//       .field('phoneNumber', '123345756')
//       .field('age', '11')
//       .field('gender', 'male')
//       .field('state', 'lagos')
//       .field('country', 'Nigeria')
//       .field('email', 'login@user.com')
//       .field('password', 'password')
//       .attach('avatar',
//         fs.readFileSync('/home/ghostcoder/Downloads/preview.png'),
//         'preview.png');
//     expect(response.body).to.be.an('object');
//     expect(response.body.status).to.equal(201);
//     expect(response.body.data).to.have.property('id');
//     expect(response.body.data).to.have.property('email');
//     expect(response.body.data).to.have.property('firstName');
//     expect(response.body.data).to.have.property('lastName');
//     expect(response.body.data).to.have.property('phoneNumber');
//     expect(response.body.data).to.have.property('age');
//     expect(response.body.data).to.have.property('gender');
//     expect(response.body.data).to.have.property('state');
//     expect(response.body.data).to.have.property('country');
//   },
// );
// sumber: https://medium.com/@cavdy/write-a-mocha-test-for-file-upload-and-input-field-d8fc6c9fcfa