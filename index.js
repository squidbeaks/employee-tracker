const inquirer = require('inquirer');
const db = require('./db/connection');
const cTable = require('console.table');

const init = () => {
  console.log("woot!!");
  promptUser();
};

const viewDepartments = () => {
  const sql = `SELECT id AS Department_ID, name AS Department FROM departments;;`

  db.query(sql, (err, rows) => {
    console.table(rows);
  })
};

const viewRoles = () => {
  const sql = `SELECT title AS Title, roles.id AS Role_Id, departments.name AS Department_Name, salary AS Salary
  FROM roles
  INNER JOIN departments ON roles.department_id = departments.id;`

  db.query(sql, (err, rows) => {
    console.table(rows);
  })
};

const viewEmployees = () => {
  const sql = `SELECT
              employees.id,
              CONCAT (employees.first_name, ' ', employees.last_name) AS 'Name',
              roles.title AS 'Title',
              departments.name AS 'Department Name',
              roles.salary AS 'Salary',
              CONCAT(manager.first_name, ' ', manager.last_name) AS 'Manager'
              FROM employees
              LEFT JOIN roles on employees.role_id=roles.id
              LEFT JOIN departments on roles.department_id=departments.id
              LEFT JOIN employees manager on manager.id = employees.manager_id;`
  db.query(sql, (err, rows) => {
    console.table(rows);
  });
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
      'Update an employee'
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
