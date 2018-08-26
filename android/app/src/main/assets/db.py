import sqlite3
db = sqlite3.connect('db.sqlite')

db.execute('''CREATE TABLE peoples(
    id integer PRIMARY KEY,
    name text NOT NULL,
    birthday text NOT NULL
);''')

cursor = db.cursor()

cursor.execute('''INSERT INTO peoples(name,birthday) VALUES("Lim Yu Hao","1997-08-14");''')
cursor.execute('''INSERT INTO peoples(name,birthday) VALUES("Lee Mei Jie","1997-07-10");''')
cursor.execute('''INSERT INTO peoples(name,birthday) VALUES("Lim Yu Hao","1997-08-14");''')
cursor.execute('''INSERT INTO peoples(name,birthday) VALUES("Lee Mei Jie","1997-07-10");''')

db.commit()
db.close()