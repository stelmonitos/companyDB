const Employee = require("../employees.model");
const Department = require("../department.model");
const expect = require("chai").expect;
const mongoose = require("mongoose");

describe("Employee", () => {
  before(async () => {
    try {
      await mongoose.connect("mongodb://localhost:27017/companyDBtest", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    } catch (err) {
      console.error(err);
    }
  });
  //READ
  describe("Reading data", () => {
    after(async () => {
      await Employee.deleteMany();
    });
    before(async () => {
      const testEmployee = new Employee({
        firstName: "Jakub",
        lastName: "Stelmasiak",
        department: "IT",
      });
      await testEmployee.save();

      const testEmployee2 = new Employee({
        firstName: "Patryk",
        lastName: "Tokarz",
        department: "IT",
      });
      await testEmployee2.save();
    });
    it('should return all the data with "find" method', async () => {
      const employees = await Employee.find();
      const expectedLength = 2;
      expect(employees.length).to.be.equal(expectedLength);
    });
    it("should return proper document by various params with findOne method", async () => {
      const employee = await Employee.findOne({ firstName: "Jakub" });
      expect(employee.firstName).to.be.equal("Jakub");
    });
  });
  //CREATE
  describe("Creating data", () => {
    after(async () => {
      await Employee.deleteMany();
    });
    it("should insert new document with insertOne method", async () => {
      const employee = new Employee({
        firstName: "Misia",
        lastName: "Michalska",
        department: "IT",
      });
      await employee.save();
      expect(employee.isNew).to.be.false;
    });
  });
  //UPDATE
  describe("Updating data", () => {
    beforeEach(async () => {
      const testEmployee = new Employee({
        firstName: "Jakub",
        lastName: "Stelmasiak",
        department: "IT",
      });
      await testEmployee.save();

      const testEmployee2 = new Employee({
        firstName: "Patryk",
        lastName: "Tokarz",
        department: "IT",
      });
      await testEmployee2.save();
    });
    it("should properly update one document with updateOne method", async () => {
      await Employee.updateOne(
        { firstName: "Patryk", lastName: "Tokarz" },
        { $set: { firstName: "Michalina", lastName: "Stelmasiak" } }
      );
      const updatedEmployee = await Employee.findOne({
        firstName: "Michalina",
      });
      expect(updatedEmployee).to.not.be.null;
    });
    it("should properly update one document with save method", async () => {
      const employee = await Employee.findOne({ firstName: "Patryk" });
      employee.firstName = "Krzysiek";
      await employee.save();

      const expectedEmployee = await Employee.findOne({
        firstName: "Krzysiek",
      });
      expect(expectedEmployee).to.not.be.null;
    });
    it("should properly update multiple documents with updateMany method", async () => {
      await Employee.updateMany({}, { $set: { firstName: "Updated" } });
      const employee = await Employee.find({ firstName: "Updated" });
      expect(employee.length).to.be.equal(2);
    });
    afterEach(async () => {
      await Employee.deleteMany();
    });
  });
  //DELETE
  describe("Deleting data", () => {
    beforeEach(async () => {
      const testEmployee = new Employee({
        firstName: "Jakub",
        lastName: "Stelmasiak",
        department: "IT",
      });
      await testEmployee.save();

      const testEmployee2 = new Employee({
        firstName: "Patryk",
        lastName: "Tokarz",
        department: "IT",
      });
      await testEmployee2.save();
    });
    it("should properly remove one document with deleteOne method", async () => {
      await Employee.deleteOne({ firstName: "Patryk" });
      const deletedEmployee = await Employee.findOne({ firstName: "Patryk" });
      expect(deletedEmployee).to.be.null;
    });
    it("should properly remove multiple documents with deleteMany method", async () => {
      await Employee.deleteMany({});
      const employees = await Employee.find();
      expect(employees.length).to.be.equal(0);
    });
    afterEach(async () => {
      await Employee.deleteMany();
    });
  });
  //Populate method
  describe("Populate department", () => {
    before(async () => {
      // Przygotowanie środowiska testowego: czyszczenie kolekcji, dodawanie przykładowych danych
      await Employee.deleteMany();
      // Załóżmy, że mamy już utworzone i zapisane obiekty department w bazie danych
      const itDepartment = new Department({ name: 'Human Resources' });
      await itDepartment.save();
      const marketingDepartment = new Department({ name: 'Marketing' });
      await marketingDepartment.save();
  
      const testEmployee1 = new Employee({
        firstName: "Jakub",
        lastName: "Stelmasiak",
        department: itDepartment._id,
      });
      await testEmployee1.save();
  
      const testEmployee2 = new Employee({
        firstName: "Patryk",
        lastName: "Tokarz",
        department: marketingDepartment._id,
      });
      await testEmployee2.save();
    });
  
    it("should return documents with populated 'department' field", async () => {
      const employees = await Employee.find().populate('department');
      expect(employees.length).to.be.greaterThan(0);
      employees.forEach(employee => {
        expect(employee.department).to.have.property('name');
        expect(['Human Resources', 'Marketing']).to.include(employee.department.name);
      });
    });
  
    after(async () => {
      // Czyszczenie kolekcji po zakończeniu testów
      await Employee.deleteMany();
      await Department.deleteMany();
    });
  });
});
