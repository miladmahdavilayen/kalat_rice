from flask import Flask, request, jsonify, render_template, send_from_directory, flash, session
from database import Database, export_db, get_current_time
import os
import time
from loguru import logger
import json
import ast


from helper import *

app = Flask(__name__, static_folder='./build/static', template_folder='./build')

app.secret_key = 'testkey'


def create_db():
    db = Database('users.db')
    return db


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/submit-form', methods=['POST'])
def submit_form():
    data = request.json
    ename, _ = name_to_fing(data['fullName'])
    logger.info(f"{ename}'s attempting to submit and order: {data}. Sending them the RandomCode. ")
    # send verification code to customer
    random_code = data['randNumber']
    phone = data['phoneNumber']
    send_verif_code(phone, random_code)
   
        
    return jsonify({'message': 'Form data inserted successfully!'})



@app.route('/get-verif-status', methods=['POST'])
def verif_status():
    data = request.json
    if data:
        name = data['name']
        en_name, f_name = name_to_fing(name)
        phone = data['phone']
        phone_verified = "Yes"
        email = data['email']
        email_correct = True if len(email.split("@")) == 2 else False
        address = data['address'].replace("\n", " ")
        amount = data['amount']
        order = {
            # 'id_': 1,
            'order_id': None,
            'amount': amount,
            'delivery_type': None,
            'order_date_time': get_current_time()
            }
        
        order_json = str([order])
        
        
        # load user and order to database
        db = create_db()
        if not db.name_exists(name):
            db.insert(name, en_name, f_name, email if email_correct else 'no correct email', phone, address, order_json, phone_verified)
            logger.info(f"Order of {amount} for the NEW customer {en_name} was added.")
        else:
            
            logger.info(f"customer {en_name} info already in system")
            previous_orders = db.fetch_col_for_name(name, 'orders')
            db_string = previous_orders[0][0]
            updated_orders = f"{db_string[:-1]}, {str(order)}]"
            db.update_order(name, updated_orders)
            logger.info(f"Order of {amount} for the EXISTING customer {en_name} was added.")
        
    else:
        logger.info(f"{en_name} could not verify phone number..")
        
        
    return jsonify(data)



@app.route('/delivery-option', methods=['POST'])
def get_del_option():
    data = request.json
    name = data['name']
    en_name, _ = name_to_fing(name)
    option = data['option']
    logger.info(f"{en_name} considering option {option}")
    return jsonify(data)



@app.route('/delivery-type', methods=['POST'])
def get_del_type():
    data = request.json
    print(data)
    name = data['name']
    en_name, _ = name_to_fing(name)
    del_type = data['option']
    order_id = data['orderId']
    logger.info(f"Order ID: {order_id} was generated for {en_name}.")
    db = create_db()
    if db.name_exists(name):
        previous_orders = db.fetch_col_for_name(name, 'orders')
        db_string = previous_orders[0][0]
        ast_lst = ast.literal_eval(db_string)
        ast_lst[-1]['delivery_type'] = del_type
        ast_lst[-1]['order_id'] = order_id
        db.update_order(name, str(ast_lst))
        logger.info(f"Order ID {order_id} with a delivery choice of {del_type} submitted for {en_name}")
    
    return jsonify(data)




@app.route('/get-data', methods=['GET'])
def get_data():
    db = create_db()
    rows = db.fetch_all()
    return jsonify(rows)





if __name__ == '__main__':
    app.run(debug=True)
    
    
    
        
