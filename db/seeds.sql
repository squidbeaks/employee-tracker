INSERT INTO departments (name)
VALUES
    ('Engineering'),
    ('Product'),
    ('User Experience'),
    ('Sales'),
    ('Marketing');

INSERT INTO roles (title, salary, department_id)
VALUES
    ('Engineer', '95000', 1),
    ('Engineering Manager', '200000', 1),
    ('Marketing Specialist', '75000', 5),
    ('Sales DR', '45000', 4),
    ('UX Designer', '85000', 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
    ('Leah', 'Russell', 1, 1),
    ('Jane', 'Smith', 2, 1),
    ('Jill', 'Ross', 3, 1),
    ('Joe', 'Anderson', 4, 1),
    ('Bill', 'Tash', 5, 1);
