const inquirer = require('inquirer');
const db = require('./db/connection');
const cTable = require('console.table');

const init = () => {
  console.log("woot!!");
  promptUser();
};

const viewDepartments = () => {
  const sql = `SELECT id AS ID, name AS Department FROM departments;;`

  db.query(sql, (err, rows) => {
    console.table(rows);
  })
};

const viewRoles = () => {
  const sql = ``
}

const promptUser = () => {
  inquirer.prompt({
    type: 'list',
    name: 'userChoices',
    message: 'What would you like to do?',
    choices: [
      'View all departments',
      'View all roles',
      'View all employees',
      'Add a department',
      'Add a role',
      'Add an employee',
      'Update an employee'
    ]
  })
  .then(response => {
    if (response.userChoices === 'View all departments') {
      viewDepartments();
    }

    if (response.userChoices === 'View all roles') {
      console.log('View all roles');
    }

    if (response.userChoices === 'View all employees') {
      console.log('View all employees');
    }

    if (response.userChoices === 'Add a department') {
      console.log('Add a department');
    }

    if (response.userChoices === 'Add a role') {
      console.log('Add a role');
    }

    if (response.userChoices === 'Add an employee') {
      console.log('Add an employee');
    }

    if (response.userChoices === 'Update an employee') {
      console.log('Update an employee');
    }
  });
};

init();
