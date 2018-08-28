import sqlite3
db = sqlite3.connect('db.sqlite')

db.execute('''CREATE TABLE peoples(
    id integer PRIMARY KEY,
    name text NOT NULL,
    birthday text NOT NULL
);''')

db.commit()
db.close()