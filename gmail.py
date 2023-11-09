from __future__ import print_function
import os.path
import base64
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# If modifying these scopes, delete the file token.json.
SCOPES = ['https://www.googleapis.com/auth/gmail.send']

def send_message(to, subject, body):
    if isinstance(to, str):
        to_list = [to]
    elif isinstance(to, list):
        to_list = to
    else:
        raise ValueError("Invalid type for 'to'. Use str or list.")
    
    creds = None
    
    if os.path.exists('gmail_auth_keys/token.json'):
        creds = Credentials.from_authorized_user_file('gmail_auth_keys/token.json', SCOPES)
        
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'gmail_auth_keys/desktop_auth.json', SCOPES)
            creds = flow.run_local_server(port=0)
            
        with open('gmail_auth_keys/token.json', 'w') as token:
            token.write(creds.to_json())
    
    service = build('gmail', 'v1', credentials=creds)
    
    for to in to_list:
        message = MIMEMultipart()
        message['to'] = to
        message['subject'] = subject

        message.attach(MIMEText(body, 'plain'))

        raw = base64.urlsafe_b64encode(message.as_bytes()).decode('utf-8')

        try:
            message = service.users().messages().send(userId="me", body={'raw': raw}).execute()
            print(F'Successfully sent message to {to} Message Id: {message["id"]}')
        except HttpError as error:
            print(F'An error occurred: {error}')
            message = None
        
    return message

if __name__ == '__main__':
    recipients_single = 'miladatx@gmail.com'
    recipients_list = ['miladatx@gmail.com', 'example@example.com', 'another@example.com']

    send_message(recipients_single, 'test email', 'test body')
    send_message(recipients_list, 'test email', 'test body')
