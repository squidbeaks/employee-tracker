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
    ('Engineering Manager', '200000', 2),
    ('Marketing Specialist', '75000', 3),
    ('Sales DR', '45000', 4),
    ('UX Designer', '85000', 5);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
    ('Leah', 'Russell', 2, 1),
    ('Jane', 'Smith', 1, 1),
    ('Jill', 'Ross', 3, 1),
    ('Joe', 'Anderson', 4, 1),
    ('Bill', 'Tash', 5, 1);
    