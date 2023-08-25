import requests
import json




def send_payment(amount, name, phone, order_id, email):
    body = {'merchantID': '3eaf3be0-36ec-40fc-8bdd-830d9e46c4e4', 'amount': 10000,
        'description': f'{{"name": "{name}", "code": "{order_id}"}}' ,'email': email,
        'mobile': f'98{phone[1:]}',  'callBackURL':'mahdavi-rice.com/payment-callback'}
    
    headers =  {"Content-Type":"application/json"}
    
    response = requests.post('https://pms.rayanpay.com/api/v2/ipg/paymentrequest', data=json.dumps(body), headers=headers)
    return response.text

# def verif_successfull_pay():
#     body = {'merchantID': '3eaf3be0-36ec-40fc-8bdd-830d9e46c4e4', 'amount': 0,
#        'authority': "string",
#         }
#     headers =  {"Content-Type":"application/json"}
#     response = requests.post('https://pms.rayanpay.com/api/v2/ipg/paymentVerification', data=json.dumps(body), headers=headers)
#     return response.text

if __name__=="__main__":
    print(send_payment(10000, 'milad mahdavilayen', '09153820062', '290809238052hjnjk', 'miladmahdavilayen@gmail.com'))