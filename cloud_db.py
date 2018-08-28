import sqlite3
db = sqlite3.connect('birthday_cloud.sqlite')

db.execute('DROP TABLE IF EXISTS users')
db.execute('DROP TABLE IF EXISTS birthday_record')

db.execute('''CREATE TABLE users(
    user_id integer PRIMARY KEY,
    backupCode text NOT NULL
)''')

db.execute('''CREATE TABLE birthday_record(
    birthday_record_id integer PRIMARY KEY,
    name text NOT NULL,
	birthday text NOT NULL,
	user_id_fk integer NOT NULL
)''')

db.commit()
db.close()
