from flask import Flask, request, jsonify, render_template, send_from_directory, flash, session
from database import Database, export_db, get_current_time
from mongo_db import MongoDB
import os
import time
from loguru import logger
import json
import ast

from helper import *

app = Flask(__name__, static_folder='./build/static', template_folder='./build')

app.secret_key = 'testkey'


def load_db():
    mdb = MongoDB('mahdavi-rice-db', 'users')
    users = mdb.get_db()
    return users


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
    phone = num_to_eng(phone)
    send_verif_code(phone, random_code)    
    return jsonify({'message': 'Form data inserted successfully!'})



@app.route('/get-verif-status', methods=['POST'])
def verif_status():
    data = request.json
    print(data, 'here milad')
    if data:
        # validation and checks
        ip_info = {
            'ip' : data['ip'],
            'city' : data['city'],
            'region' : data['region'],
            'country' : data['country'],
            'location' : data['location'],
            'time_zone' : data['timezone'],
            'host_name' : data['hostname'],
            'postal' : data['postal']
            }
        name = data['name']
        en_name, f_name = name_to_fing(name)
        phone = data['phone']
        phone = num_to_eng(phone)
        email = data['email']
        email_correct = is_valid_email(email)
        address = data['address'].replace("\n", " ")
        amount = data['amount']
        amount = num_to_eng(amount)
        
                
        # build user and order info
        
           
        order = {
            'order_id': '',
            'amount': amount,
            'delivery_type': 'Not Selected',
            'order_date_time': get_current_time(),
            'ip_info': ip_info
            }
        
        user = {
            'name': name,
            'en_name': en_name,
            'f_name': f_name,
            'phone': phone,
            'phone_verified': 'YES',
            'email': email_correct,
            'address': address,
            'orders': [order],
            'payment': 'Not Paid'
        }
        
        order_json = str([order])
        
        
        # load db
        users = load_db()
        
        
        name_querry = {'name':f'{name}'}
        phone_querry = {'phone': f'{phone}'}
        
        
        existing_user = users.find_one(name_querry)
        
        if existing_user:
            if users.find_one({"$and": [name_querry, phone_querry]}):
                logger.info(f"customer {en_name} info already in system")
                existing_user['orders'].append(order)
                users.update_one(name_querry, {"$set": {"orders": existing_user['orders']}})
                logger.info(f"Order of {amount} for the EXISTING customer {en_name} was added.")
            else:
                logger.info(f"NAME: {en_name} is in the system with a different PHONE. Adding this one as a new user.")
                users.insert_one(user)
            
        else:
            if users.find_one(phone_querry):
                logger.info(f'''PHONE: {phone} is already in the system with a different NAME. 
                            Although since the phone verification was successful, 
                            Adding this one as a new customer too.''')
                users.insert_one(user)
                logger.info(f"Order of {amount} for the DOUBTEDLY NEW customer {en_name} was added.")
            else:
                users.insert_one(user)
                logger.info(f"Order of {amount} for BRAND NEW customer {en_name} was added.")
                
    else:
        logger.info(f"could not verify phone number..")
        
        
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
    name = data['name']
    en_name, _ = name_to_fing(name)
    del_type = data['option']
    order_id = data['orderId']
    phone = data['phone']
    phone = num_to_eng(phone)
    logger.info(f"Order ID: {order_id} was generated for {en_name}.")
    users = load_db()
    
    name_querry = {'name':f'{name}'}
    phone_querry = {'phone': f'{phone}'}
    name_phone_match = {"$and": [name_querry, phone_querry]}
    existing_user = users.find_one(name_phone_match)
    new_val = {'delivery_type': del_type, 'order_id': order_id}
    
    existing_user['orders'][-1].update(new_val)
    users.update_one(name_phone_match, {"$set": {"orders": existing_user['orders']}})
    
   
    logger.info(f"Order ID {order_id} with a delivery choice of {del_type} submitted for {en_name}")
    
    return jsonify(data)




if __name__ == '__main__':
    app.run(debug=True)
    
    
    
        
