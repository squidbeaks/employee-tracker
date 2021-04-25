const inquirer = require('inquirer');
const cTable = require('console.table');
const figlet = require('figlet');
const { viewDepartments, addDepartment } = require('./lib/Department');
const { viewRoles, addRoles } = require('./lib/Role');
const { viewEmployees, addEmployee, updateEmployeeRole } = require('./lib/Employee');

// figlet('Employee Tracker', function(err, data) {
//   if (err) {
//     console.log('Something went wrong...');
//     console.dir(err);
//     return;
//   }
//   console.log(data);
// });

const init = () => {
  promptUser();
};

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
      'Update an employee role',
      'Exit'
    ]
  })
  .then(response => {
    if (response.userChoices === 'View all departments') {
      viewDepartments();
    }

    if (response.userChoices === 'View all roles') {
      viewRoles();
    }

    if (response.userChoices === 'View all employees') {
      viewEmployees();
    }

    if (response.userChoices === 'Add a department') {
      addDepartment();
    }

    if (response.userChoices === 'Add a role') {
      addRoles();
    }

    if (response.userChoices === 'Add an employee') {
      addEmployee();
    }

    if (response.userChoices === 'Update an employee role') {
      updateEmployeeRole();
    }
    if (response.userChoices === 'Exit') {
      console.log('You exited the Employee Tracker Application');
    }
  })
//  .then(promptUser);
};

init();
