const db = require('../db/connection');
const inquirer = require('inquirer');

const viewDepartments = () => {
  const sql = `SELECT id AS Department_ID, name AS Department FROM departments;`;

  db.query(sql, (err, rows) => {
    console.table(rows);
  })
};

const addDepartment = () => {
  inquirer.prompt({
    type: 'input',
    name: 'departmentName',
    message: 'What is the name of the department you would like to add?'
  })
  .then(response => {
    const sql = `INSERT INTO departments (name) VALUES (?);`
    const params = response.departmentName;

    db.query(sql, params, (err, result) => {
      console.log(`${params} successfully added to list of departments!`);
    });
  });
};

module.exports = { viewDepartments, addDepartment };