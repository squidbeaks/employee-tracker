const inquirer = require('inquirer');
const db = require('../db/connection');

const viewRoles = () => {
  const sql = `SELECT
                title AS Title,
                roles.id AS Role_Id,
                departments.name AS Department_Name,
                salary AS Salary
                FROM roles
                LEFT JOIN departments ON roles.department_id = departments.id;`

  db.query(sql, (err, rows) => {
    console.table(rows);
  });
};

const addRoles = () => {
  const departmentSql = `SELECT
              departments.name
              FROM roles
              LEFT JOIN departments ON roles.department_id = departments.id;`;

  const choices = [];

  db.query(departmentSql, (err, rows) => {
    for (let i = 0; i < rows.length; i++) {
      if (choices.indexOf(rows[i].name) === -1) {
        choices.push(rows[i].name);
      }
    }
  });

  inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'What is the title of the role you would like to add?'
    },
    {
      type: 'number',
      name: 'salary',
      message: 'How much is the salary for this role?'
    },
    {
      type: 'list',
      name: 'department',
      message: 'What department does this role belong to?',
      choices: choices
    }
  ])
  .then(responses => {
    const departmentIdSql = `SELECT id FROM departments WHERE name = '${responses.department}';`
    let department_id;

    db.query(departmentIdSql, (err, rows) => {
      department_id = rows[0].id;

      const sql = `INSERT INTO roles (title, salary, department_id) VALUES (?,?,?);`
      const params = [`${responses.title}`, responses.salary, department_id];

      db.query(sql, params, (err, rows) => {
        console.log(rows);
        console.log(`${responses.title} successfully added to Roles database!`);
      })
    });
  });
};

module.exports = { viewRoles, addRoles };