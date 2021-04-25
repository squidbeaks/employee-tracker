const inquirer = require('inquirer');
const db = require('./db/connection');
const cTable = require('console.table');

const init = () => {
  promptUser();
};

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

const updateEmployee = () => {
  const employeeSql = `SELECT CONCAT (employees.first_name, ' ', employees.last_name) AS name FROM employees;`;

  db.query(employeeSql, (err, rows) => {
    const employeeChoices = [];

    for (let i = 0; i < rows.length; i++) {
      if (employeeChoices.indexOf(rows[i].name) === -1) {
        employeeChoices.push(rows[i].name);
      }
    }

    inquirer.prompt([
      {
        type: 'list',
        name: 'employees',
        message: 'Who does this employee report to?',
        choices: []
      },
      {
        type: 'input',
        name: 'firstName',
        message: 'What is the first name of the employee you would like to add?'
      },
      {
        type: 'input',
        name: 'lastName',
        message: 'What is the last name of the employee you would like to add?'
      }
    ])
    .then(responses => {
      console.log(responses);
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
      addDepartment();
    }

    if (response.userChoices === 'Add a role') {
      addRoles();
    }

    if (response.userChoices === 'Add an employee') {
      addEmployee();
    }

    if (response.userChoices === 'Update an employee') {
      updateEmployee();
    }
  });
};

init();
