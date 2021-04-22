INSERT INTO departments (name)
VALUES
    ('Engineering'),
    ('Product'),
    ('User Experience'),
    ('Sales'),
    ('Marketing');

INSERT INTO roles (first_name, last_name, role_id, manager_id)
VALUES
    ('Engineer 1', 'Russell', 2, 1),
    ('Engineering Manager', 'Smith', 1, 1),
    ('Marketing Specialist 1', 'Ross', 3, 1),
    ('Sales Development Representative 1', 'Anderson', 4, 1),
    ('Engineer 1', 'Tash', 5, 1);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
    ('Leah', 'Russell', 2, 1),
    ('Jane', 'Smith', 1, 1),
    ('Jill', 'Ross', 3, 1),
    ('Joe', 'Anderson', 4, 1),
    ('Bill', 'Tash', 5, 1);
    