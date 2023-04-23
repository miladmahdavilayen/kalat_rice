import random
import re
from googletrans import Translator
from kavenegar import KavenegarAPI


def send_flash(m_type, message):
    print(f"{m_type}: {message}")
    pass

def create_random_code():
    return 4
    pass

def send_verif_code(random_gen, phone_num):
    pass
    # api = KavenegarAPI('6747713838396F6B49306438394E73624F48366F4D656B36356B73717969386842697453307274597668303D')
    # params = { 'sender' : '09153820062', 'receptor': f'{phone_num}', 'message' :f'{random_gen}' }
    # response = api.sms_send( params)
    # return response


def name_to_fing(var_name):
    farsi_regex = re.compile(r'^[\u0600-\u06FF\s]+$')
    if farsi_regex.match(var_name):
        translator = Translator()
        farsi_name = var_name
        eng_name = translator.translate(farsi_name, dest='en').text
        return eng_name, farsi_name

    eng_name = var_name.title()
    return eng_name, "No Farsi Name"


def is_valid_email(email):
    # Regex pattern for email validation
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'

    # If email doesn't match pattern, return False
    if not re.match(pattern, email):
        return "Email Not Valid"

    return email

def num_to_eng(phone_number):
    is_farsi_number = re.search("[۰-۹]+", phone_number)
    if is_farsi_number:
        return re.sub("[۰-۹]", lambda x: str(ord(x.group(0)) - ord("۰")), phone_number)
    else:
        return phone_number
    


if __name__ == "__main__":
    pass