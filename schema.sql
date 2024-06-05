
CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(45) NOT NULL,
  UNIQUE (id)
);

 INSERT INTO roles (id, name) VALUES (1, 'User');
 INSERT INTO roles (id, name) VALUES (2, 'Admin');

CREATE TABLE IF NOT EXISTS users (
  id SERIAL NOT NULL,
  first_name VARCHAR(45),
  last_name VARCHAR(45),
  email VARCHAR(90) UNIQUE NOT NULL,
  phone VARCHAR(45),
  password VARCHAR(255) NOT NULL,
  token VARCHAR(255) UNIQUE,
  roles_id INT DEFAULT 1,
  PRIMARY KEY (id),
  CONSTRAINT fk_users_roles1 FOREIGN KEY (roles_id)
    REFERENCES roles (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);


CREATE TABLE IF NOT EXISTS authors (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(45) NOT NULL,
  middle_name VARCHAR(45),
  last_name VARCHAR(45) NOT NULL,
  UNIQUE (id)
);

CREATE TABLE IF NOT EXISTS books (
  id SERIAL NOT NULL,
  name VARCHAR(45),
  authors_id INT NOT NULL,
  cover_image BYTEA,
  PRIMARY KEY (id, authors_id),
  UNIQUE (id),
  CONSTRAINT fk_books_authors1 FOREIGN KEY (authors_id)
    REFERENCES authors (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

CREATE TABLE IF NOT EXISTS stock (
  books_id INT NOT NULL,
  price FLOAT NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  PRIMARY KEY (books_id),
  UNIQUE (books_id),
  CONSTRAINT fk_stock_books1 FOREIGN KEY (books_id)
    REFERENCES books (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

CREATE TABLE IF NOT EXISTS Orders (
  id SERIAL PRIMARY KEY,
  token VARCHAR(255) NOT NULL,
  time TIMESTAMP(5) NOT NULL
);

CREATE TABLE IF NOT EXISTS Order_details (
  order_id INT NOT NULL,
  book_id INT NOT NULL,
  quantity INT NOT NULL,
  FOREIGN KEY (order_id) REFERENCES Orders(id) ON DELETE CASCADE
);
