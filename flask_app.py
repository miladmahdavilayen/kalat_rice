import os
import time
from loguru import logger
import json
import ast
from flask import Flask, request, jsonify, render_template, send_from_directory, flash, session
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from rayanpay import *

# from database import Database, export_db, get_current_time
from mongo_db import MongoDB
from gmail import send_message
from helper import *

app = Flask(__name__, static_folder='./build/static', template_folder='./build')

limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["60 per day", "10 per hour"],
    storage_uri="memory://",
)

app.secret_key = 'testkey'

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return render_template('index.html')


def load_db():
    mdb = MongoDB('mahdavi-rice-db', 'users')
    users = mdb.get_db()
    return users


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/submit-form', methods=['POST'])
@limiter.limit("60 per day")
def submit_form():
    data = request.json
    ename, _ = name_to_fing(data['fullName'])
    logger.info(f"{ename}'s attempting to submit an order: {data}. Sending them OTP. ")
    # send verification code to customer
    random_code = data['randNumber']
    phone = data['phoneNumber']
    phone = num_to_eng(phone)
    # send_verif_code(phone, random_code) 
    send_message('miladatx@gmail.com', f'Order Attmept Verif Code: {random_code}', f'user {ename} is attempting to submit a new order. Full Data: {data}')   
    return jsonify({'message': 'Form data inserted successfully!'})



@app.route('/get-verif-status', methods=['POST'])
def verif_status():
    data = request.json
    # logger.info(data, 'here milad')
    if data:
        # validation and checks
        name = data['name']
        en_name, f_name = name_to_fing(name)
        phone = data['phone']
        phone = num_to_eng(phone)
        email = data['email']
        email_correct = is_valid_email(email)
        address = data['address'].replace("\n", " ")
        amount = data['amount']
        amount = num_to_eng(amount)
        delivery_city = data['deliveryCity']
        register_date = persian_date()
                
        # build user and order and IP dicts
        
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
        
        order = {
            'order_id': '',
            'name_used_for_this_order': name,
            'initial_amount': amount,
            'delivery_type': 'Not Selected',
            'delivery_city': delivery_city,
            'delivery_address': address,
            'order_date_time': get_current_time(),
            'payment': 'Not Paid',
            'ip_info': ip_info
            }
        
        user = {
            'name': name,
            'en_name': en_name,
            'f_name': f_name,
            'phone': phone,
            'phone_verified': 'YES',
            'email': email_correct,
            'first_address': address,
            'date_registered': register_date,
            'orders': [order]
        }
        
        
        # load db
        users = load_db()
        
        
        name_querry = {'name':f'{name}'}
        phone_querry = {'phone': f'{phone}'}
        
        
        existing_user = users.find_one(name_querry)
        existing_phone = users.find_one(phone_querry)
        
        # new approach
        if existing_phone:
            
            # if the same exact customer is in db, just add to their orders
            if users.find_one({"$and": [name_querry, phone_querry]}):
                logger.info(f"Info for {en_name} already exists in database. Adding a new order.")
                existing_user['orders'].append(order)
                users.update_one(name_querry, {"$set": {"orders": existing_user['orders']}})
                logger.info(f"Order of {amount} for the EXISTING customer {en_name} is being processed.")
            
            # if number exists with a different name, update name
            else:
                logger.info(f'''PHONE: {phone} has previously been registered using a different NAME. 
                            Although since the phone verification was successful, 
                            updating their name to {en_name} now. You may still find 
                            the old name that was used inside previous orders''')
                
                existing_phone['name'] = name
                users.update_one(phone_querry, {"$set": {"name": existing_phone['name']}})
                
                existing_phone['orders'].append(order)
                users.update_one(phone_querry, {"$set": {"orders": existing_phone['orders']}})
                logger.info(f"Order of {amount} for the EXISTING phone number {phone} using a New name {en_name} is being processed.")
        
        # if phone number doesn't exist, add as a new user
        else:
            users.insert_one(user)
            logger.info(f"Order of {amount} for BRAND NEW customer {en_name} is being processed.")
            
                
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
    
    rice_amount = data['amount']
    rice_amount = num_to_eng(rice_amount)
    kg_price = data['riceKgPrice']
    delivery_cost = data['deliveryCost']
    total_charge = data['totalPrice']
    
    logger.info(f"Order ID: {order_id} was generated for {en_name}.")
    users = load_db()
    
    name_querry = {'name':f'{name}'}
    phone_querry = {'phone': f'{phone}'}
    name_phone_match = {"$and": [name_querry, phone_querry]}
    existing_user = users.find_one(name_phone_match)
    new_val = {'delivery_type': del_type, 'order_id': order_id, 'rice_kg_price': kg_price,
               'delivery_cost': delivery_cost, 'total_charge': total_charge, 'final_amount': rice_amount}
    
    existing_user['orders'][-1].update(new_val)
    users.update_one(name_phone_match, {"$set": {"orders": existing_user['orders']}})
    
   
    logger.info(f"Order ID {order_id} with a delivery choice of {del_type} submitted for {en_name}")
    send_message('miladatx@gmail.com', f'Order Submitted for {name}', f'Full Data: {data}')
    return jsonify(data)


@app.route('/payment-page', methods=['POST'])
def send_infoto_rayanpay():
    data = request.json
    name = data['name']
    order_id = data['orderId']
    phone = data['phone']
    amount = data['totalPrice']
    email = "no email for now"
    logger.info(f"amount {amount} phone {phone} name {name} ord_id {order_id}" )
    response = send_payment(amount, name, phone, order_id, email)  
    auth_code = json.loads(response)['authority']
    
    users = load_db()
    name_querry = {'name':f'{name}'}
    phone_querry = {'phone': f'{phone}'}
    name_phone_match = {"$and": [name_querry, phone_querry]}
    existing_user = users.find_one(name_phone_match)
    new_val = {'rayanpay_auth': auth_code }
    existing_user['orders'][-1].update(new_val)
    users.update_one(name_phone_match, {"$set": {"orders": existing_user['orders']}})
    
    logger.info(response)
    return jsonify(response)


@app.route('/verify-payment', methods=['POST'])
def verify_rayanpay():
    data = request.json
    status = data['status']
    auth_code = data['auth_code']
    
    if status == 'OK':
        users = load_db()
        auth_querry = {
            "orders": {
                "$elemMatch": {
                    "rayanpay_auth": auth_code
                }
            }
        }
        # auth_querry = {'orders.rayanpay_auth':f'{auth_code}'}
        existing_user = users.find_one(auth_querry)
        amount = existing_user['orders'][-1]['total_charge']
        logger.info(f'testing whether it has found the right user and total charge: {amount}')

        response = verif_successfull_pay(auth_code, int(amount))
        
        data = json.loads(response) 
        final_status = data['status'] 
        ref_id = data['refID'] 
        card_holder_pan = data['cardHolderPan']
        bank_hash = data['bankCardHash']
        
        if final_status == '100':
            new_val = {'payment': 'PAID', 'ref_id': ref_id, 'card_holder_pan': card_holder_pan, 'bank_hash': bank_hash }
            existing_user['orders'][-1].update(new_val)
        else:
            return 'Not Paid'
        
        return jsonify(response)
        
    
    return jsonify(data)


@app.route('/api/customers', methods=['GET'])
def post_customers():
    users = load_db()
    customer_list = list(users.find({}, {"_id": 0}))
    
    return jsonify(customer_list)



def test_f():
    users = load_db()
    auth_querry = {
        "orders": {
            "$elemMatch": {
                "rayanpay_auth": "b957b58d-ae3d-40f1-93dc-2de578125f48"
            }
        }
    }
    # auth_querry = {'orders.rayanpay_auth':f'{auth_code}'}
    existing_user = users.find_one(auth_querry)
    amount = existing_user['orders'][-1]['total_charge']
    logger.info(f'testing whether it has found the right user and total charge: {amount}')
    response = verif_successfull_pay("b957b58d-ae3d-40f1-93dc-2de578125f48", int(amount))
    logger.info(response)
    


if __name__ == '__main__':
    # app.run(debug=True)
    test_f()
    
    
    
        
