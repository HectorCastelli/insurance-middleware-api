const chai = require('chai');

const { expect } = chai;
const { describe, it } = require('mocha');

const Pagination = require('../../../src/middleware/pagination');

const objBody = {
  a: 'b',
};
const arrayBody = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

describe('Pagination Middleware', () => {
  it('Does not modify the body when the body is not an array', (done) => {
    const pagination = Pagination(objBody, { query: {} }, {});
    expect(pagination).to.be.eql(objBody);
    done();
  });
  it('Limits the array to 10 elements by default and adds a nextPage token if necessary', (done) => {
    const pagination = Pagination(arrayBody, { query: {} }, {});
    expect(pagination).to.not.be.eql(arrayBody);
    expect(pagination.items).to.have.lengthOf(10);
    done();
  });
  it('Limits the array to n elements when the limit query parameters is present', (done) => {
    const pagination = Pagination(arrayBody, { query: { limit: 2 } }, {});
    expect(pagination).to.not.be.eql(arrayBody);
    expect(pagination.items).to.have.lengthOf(2);
    expect(pagination).to.be.eql({ items: [1, 2], nextPage: 1 });
    done();
  });
  it('Properly crops each page', (done) => {
    const pagination = Pagination(arrayBody, { query: { limit: 2, page: 1 } }, {});
    expect(pagination).to.not.be.eql(arrayBody);
    expect(pagination.items).to.have.lengthOf(2);
    expect(pagination).to.be.eql({ items: [3, 4], nextPage: 2 });
    done();
  });
});
