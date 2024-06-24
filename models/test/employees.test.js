const Employee = require('../employees.model');
const expect = require('chai').expect;
const mongoose = require('mongoose');

describe('Employee', () => {

    it('should throw an error if no arg', () => {
        const emp = new Employee({})

        emp.validateSync(err => {
            expect(err.errors.name).to.exist
        })
    });
    it('should throw an error if arg is not a string', () => {
        const cases = [{}, []];
        for (let arg of cases) {
            const emp = new Employee({ firstName: arg, lastName: arg, department: arg });
            const errors = emp.validateSync();
            expect(errors).to.exist;
        };
    });
    it('should not throw an error if arguments are okay', () => {
        const emp = new Employee({ firstName: 'Cibst', lastName: 'Eno', department: 'Human Resources' });
        const errors = emp.validateSync();
        expect(errors).to.not.exist;
    });
    after(() => {
        mongoose.models = {};
    });
})