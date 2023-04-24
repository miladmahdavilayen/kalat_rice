import random
import re
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




def farsi_to_english(word):
    """
    Converts a Farsi word to its closest match in English letters.
    """
    # Define translation rules
    translation = {
        'ا': 'a',
        'آ': 'a',
        'ب': 'b',
        'پ': 'p',
        'ت': 't',
        'ث': 's',
        'ج': 'j',
        'چ': 'ch',
        'ح': 'h',
        'خ': 'kh',
        'د': 'd',
        'ذ': 'z',
        'ر': 'r',
        'ز': 'z',
        'ژ': 'zh',
        'س': 's',
        'ش': 'sh',
        'ص': 's',
        'ض': 'z',
        'ط': 't',
        'ظ': 'z',
        'ع': 'a',
        'غ': 'gh',
        'ف': 'f',
        'ق': 'q',
        'ک': 'k',
        'گ': 'g',
        'ل': 'l',
        'م': 'm',
        'ن': 'n',
        'و': 'o',
        'ه': 'h',
        'ی': 'y',
        'ئ': 'y',
        'ّ': '',
        'ْ': '',
        'ٌ': '',
        'ٍ': '',
        'ً': '',
        'ُ': '',
        'ِ': '',
        'َ': '',
        'ٰ': '',
        'ٔ': '',
        'ٖ': '',
        'ٗ': '',
        '٘': '',
        'ٙ': '',
        'ٚ': '',
        'ٓ': '',
        'ٕ': '',
        'ۡ': '',
        'ۨ': '',
        '۪': '',
        '۫': '',
        '۬': '',
        '۰': '0',
        '۱': '1',
        '۲': '2',
        '۳': '3',
        '۴': '4',
        '۵': '5',
        '۶': '6',
        '۷': '7',
        '۸': '8',
        '۹': '9'
    }
    
    # Convert Farsi letters to English letters using translation rules
    english_word = ''
    for letter in word:
        if letter in translation:
            english_word += translation[letter]
        else:
            english_word += letter
    return english_word


def name_to_fing(var_name):
    farsi_regex = re.compile(r'^[\u0600-\u06FF\s]+$')
    if farsi_regex.match(var_name):
        eng_name = farsi_to_english(var).title()
        farsi_name = var_name
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