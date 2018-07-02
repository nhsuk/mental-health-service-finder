const chai = require('chai');

const expect = chai.expect;

function htmlWithStatus(res, status) {
  expect(res).to.have.status(status);
  expect(res).to.be.html;
}

module.exports = {
  htmlWithStatus,
};
