const inquirer = require('inquirer');
const cTable = require('console.table');
const figlet = require('figlet');
const db = require('./db/connection');

const promptUser = () => {
  return inquirer.prompt([
    {
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
        'Update an employee manager',
        'View employees by manager',
        'Exit'
      ]
    }
  ])
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

    if (response.userChoices === 'Update an employee manager') {
      updateEmployeeMgr();
    }

    if (response.userChoices === 'View employees by manager') {
      viewEmployeesByMgr();
    }

    if (response.userChoices === 'Exit') {
      console.log('You exited the Employee Tracker Application');
      process.exit(1);
    }
  })
};

const viewDepartments = () => {
  const sql = `SELECT id AS Department_ID, name AS Department FROM departments;`;

  db.query(sql, (err, rows) => {
    if(err) {
      console.log(err);
      return;
    }
    console.table(rows);
    promptUser();
  });
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
      promptUser();
    });
  })
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
    promptUser();
  });
};

const addRoles = () => {
  const departmentSql = `SELECT name FROM departments;`;

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
        promptUser();
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
          promptUser();
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
              promptUser();
            });
          });
        });
      })
    })
  })
};

const updateEmployeeMgr = () => {
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
        name: 'employee',
        message: "Which employee's manager would you like to update?",
        choices: employeeChoices
      },
      {
        type: 'list',
        name: 'manager',
        message: 'Who is their new manager?',
        choices: employeeChoices
      }
    ])
    .then(responses => {
      console.log(responses);

      const empName = `${responses.employee}`;
      const empNameArr = empName.split(' ');
      let employee_id;

      const empSql =  `SELECT id FROM employees WHERE first_name = '${empNameArr[0]}' AND last_name = '${empNameArr[1]}';`;

      db.query(empSql, (err, rows) => {
        employee_id = rows[0].id;
        console.log(employee_id);

        const mgrName = `${responses.manager}`;
        const mgrNameArr = mgrName.split(' ');
        let manager_id;

        const mgrSql = `SELECT id FROM employees WHERE first_name = '${mgrNameArr[0]}' AND last_name = '${mgrNameArr[1]}';`;

        db.query(mgrSql, (err, rows) => {
          manager_id = rows[0].id;
          console.log(manager_id);

          const sql = `UPDATE employees SET manager_id = ? WHERE id = ?;`
          const params = [manager_id, employee_id];

          db.query(sql, params, (err, rows) => {
            console.log(rows);
            console.log(`${responses.employee}'s manager has been successfully updated!`);
            promptUser();
          })
        })
      });
    });
  });
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
    promptUser();
  });
};

const viewEmployeesByMgr = () => {
  const mgrSql = `SELECT
                    CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name
                    FROM employees
                    LEFT JOIN roles on employees.role_id=roles.id
                    LEFT JOIN employees manager on manager.id = employees.manager_id;`;

  db.query(mgrSql, (err, rows) => {
    const managerChoices = [];

    for (let i = 0; i < rows.length; i++) {
      if (managerChoices.indexOf(rows[i].manager_name) === -1) {
        managerChoices.push(rows[i].manager_name);
      }
    }

    inquirer.prompt([
      {
        type: 'list',
        name: 'manager',
        message: "Which manager's team would you like to view?",
        choices: managerChoices
      }
    ])
    .then(response => {
      console.log(response);

      const mgrName = `${response.manager}`;
      const mgrNameArr = mgrName.split(' ');
      let manager_id;

      const mgrSql =  `SELECT id FROM employees WHERE first_name = '${mgrNameArr[0]}' AND last_name = '${mgrNameArr[1]}';`;

      db.query(mgrSql, (err, rows) => {
        manager_id = rows[0].id;
        console.log(manager_id);

        const teamSql = `SELECT CONCAT(employees.first_name, ' ', employees.last_name) AS 'Employee(s)' FROM employees WHERE manager_id = ${manager_id};`;

        db.query(teamSql, (err, rows) => {
          console.table(rows);
          promptUser();
        });
      })
    })
  })
};

const init = () => {  
  figlet('Employee Tracker', function(err, data) {
    if (err) {
      console.log('Something went wrong...');
      console.dir(err);
      return;
    }
    console.log(data);
    promptUser();
  });
};

init();
