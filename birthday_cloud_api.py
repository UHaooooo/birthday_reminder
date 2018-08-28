import sqlite3
from flask import Flask, jsonify, request, abort
from argparse import ArgumentParser

DB = 'birthday_cloud.sqlite'


def get_birthday_row_as_dict(row):
	row_dict = {
		'name': row[1],
		'birthday': row[2]
	}

	return row_dict

def get_user_row_as_dict(row):
	row_dict = {
		'id': row[0],
		'backupCode': row[1]
	}

	return row_dict


app = Flask(__name__)


@app.route('/api/user/<string:backupCode>', methods=['GET'])
def getUser(backupCode):
	db = sqlite3.connect(DB)
	cursor = db.cursor()
	cursor.execute('SELECT * FROM users WHERE backupCode=?', (str(backupCode),))
	row = cursor.fetchone()
	db.close()

	response = {
		'id': '',
	}

	if row:
		row_as_dict = get_user_row_as_dict(row)
		return jsonify(row_as_dict), 200
	else:
		return jsonify(response), 200


@app.route('/api/addUser', methods=['POST'])
def addUser():
	if not request.json:
		abort(404)

	new_user = (
		request.json['backupCode'],
	)

	db = sqlite3.connect(DB)
	cursor = db.cursor()

	cursor.execute('''
		INSERT INTO users(backupCode)
		VALUES(?)
	''', new_user)

	new_user_id = cursor.lastrowid

	db.commit()

	response = {
		'id': new_user_id,
		'affected': db.total_changes,
	}

	db.close()

	return jsonify(response), 201


@app.route('/api/add-birthday-record', methods=['POST'])
def addBirthdayRecord():
	if not request.json:
		abort(404)

	new_record = (
		request.json['name'],
		request.json['birthday'],
		request.json['user_id_fk'],
	)

	db = sqlite3.connect(DB)
	cursor = db.cursor()

	cursor.execute('''
		INSERT INTO birthday_record(name,birthday,user_id_fk)
		VALUES(?,?,?)
	''', new_record)

	db.commit()

	response = {
		'affected': db.total_changes,
	}

	db.close()

	return jsonify(response), 201


@app.route('/api/delete-all-birthday-record/<int:user_id_fk>', methods=['DELETE'])
def deleteBirthdayRecord(user_id_fk):
	if not request.json:
		abort(404)

	if 'user_id_fk' not in request.json:
		abort(400)

	if int(request.json['user_id_fk']) != user_id_fk:
		abort(400)

	db = sqlite3.connect(DB)
	cursor = db.cursor()

	cursor.execute(
		'DELETE FROM birthday_record WHERE user_id_fk=?', (str(user_id_fk),))

	db.commit()

	response = {
		'affected': db.total_changes,
	}

	db.close()

	return jsonify(response), 201


@app.route('/api/select-all-birthday-record/<int:user_id_fk>', methods=['GET'])
def selectBirthdayRecord(user_id_fk):
	db = sqlite3.connect(DB)
	cursor = db.cursor()

	cursor.execute(
		'SELECT * FROM birthday_record WHERE user_id_fk=?', (str(user_id_fk),))
	rows = cursor.fetchall()

	print(rows)

	db.close()

	rows_as_dict = []
	for row in rows:
		row_as_dict = get_birthday_row_as_dict(row)
		rows_as_dict.append(row_as_dict)

	return jsonify(rows_as_dict), 200


if __name__ == '__main__':
	parser = ArgumentParser()
	parser.add_argument('-p', '--port', default=5000,
						type=int, help='port to listen on')
	args = parser.parse_args()
	port = args.port

	app.run(host='0.0.0.0', port=port)
