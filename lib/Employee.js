const inquirer = require('inquirer');
const db = require('../db/connection');

const addEmployee = () => {
  const roleChoices = [];
  const employeeChoices = [];

  const roleSql = `SELECT title FROM roles;`;
  const employeeSql = `SELECT CONCAT (employees.first_name, ' ', employees.last_name) AS name FROM employees;`;

  db.query(roleSql, (err, rows) => {
    for (let i = 0; i < rows.length; i++) {
      if (roleChoices.indexOf(rows[i].title) === -1) {
        roleChoices.push(rows[i].title);
      }
    }
  });

  db.query(employeeSql, (err, rows) => {
    for (let i = 0; i < rows.length; i++) {
      if (employeeChoices.indexOf(rows[i].name) === -1) {
        employeeChoices.push(rows[i].name);
      }
    }
  });

  inquirer.prompt([
    {
      type: 'input',
      name: 'firstName',
      message: 'What is the first name of the employee you would like to add?'
    },
    {
      type: 'input',
      name: 'lastName',
      message: 'What is the last name of the employee you would like to add?'
    },
    {
      type: 'list',
      name: 'role',
      message: 'What role is this employee?',
      choices: roleChoices

    },
    {
      type: 'list',
      name: 'manager',
      message: 'Who does this employee report to?',
      choices: employeeChoices
    }
  ])
  .then(responses => {
    console.log(responses);

    const roleIdSql = `SELECT id FROM roles WHERE title = '${responses.role}';`
    let role_id;

    db.query(roleIdSql, (err, rows) => {
      role_id = rows[0].id;

      const mgrName = `${responses.manager}`;
      const mgrNameArr = mgrName.split(' ');
      let employee_id;

      const mgrSql =  `SELECT id FROM employees WHERE first_name = '${mgrNameArr[0]}' AND last_name = '${mgrNameArr[1]}';`;

      db.query(mgrSql, (err, rows) => {
        employee_id = rows[0].id;
        console.log(employee_id);

        const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?);`
        console.log(sql);
        const params = [`${responses.firstName}`, `${responses.lastName}`, role_id, employee_id];
        console.log(params);

        db.query(sql, params, (err, rows) => {
          console.log(rows);
          console.log(`${responses.firstName} ${responses.lastName} successfully added to Employees database!`);
        });
      });
    })
  })
};

const updateEmployeeRole = () => {
  const employeeSql = `SELECT CONCAT (employees.first_name, ' ', employees.last_name) AS name FROM employees;`;
  const roleSql = `SELECT title FROM roles;`;

  db.query(employeeSql, (err, rows) => {
    const employeeChoices = [];

    for (let i = 0; i < rows.length; i++) {
      if (employeeChoices.indexOf(rows[i].name) === -1) {
        employeeChoices.push(rows[i].name);
      }
    }

    db.query(roleSql, (err, rows) => {
      const roleChoices = [];

      for (let i = 0; i < rows.length; i++) {
        if (roleChoices.indexOf(rows[i].title) === -1) {
          roleChoices.push(rows[i].title);
        }
      }

      inquirer.prompt([
        {
          type: 'list',
          name: 'employees',
          message: "Which employee's role would you like to update?",
          choices: employeeChoices
        },
        {
          type: 'list',
          name: 'roles',
          message: 'What would you like to update their role to be?',
          choices: roleChoices
        }
      ])
      .then(responses => {
        console.log(responses);

        const roleIdSql = `SELECT id FROM roles WHERE title = '${responses.roles}';`
        let role_id;

        db.query(roleIdSql, (err, rows) => {
          role_id = rows[0].id;

          const empName = `${responses.employees}`;
          const empNameArr = empName.split(' ');
          let employee_id;

          const empSql =  `SELECT id FROM employees WHERE first_name = '${empNameArr[0]}' AND last_name = '${empNameArr[1]}';`;

          db.query(empSql, (err, rows) => {
            employee_id = rows[0].id;
            console.log(employee_id);

            const sql = `UPDATE employees SET role_id = ? WHERE id = ?;`
            const params = [role_id, employee_id];
            console.log(sql);

            db.query(sql, params, (err, rows) => {
              console.log(rows);
              console.log(`${responses.employees}'s role has been successfully updated!`);
            });
          });
        });
      })
    })
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

module.exports = { addEmployee, updateEmployeeRole, viewEmployees };