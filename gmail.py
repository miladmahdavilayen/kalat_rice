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


def send_message(to, subject, body, file=None):
    """Shows basic usage of the Gmail API.
    Lists the user's Gmail labels.
    """
    creds = None
    # The file token.json stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'desktop_auth.json', SCOPES)
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open('token.json', 'w') as token:
            token.write(creds.to_json())

    
    # Call the Gmail API
    service = build('gmail', 'v1', credentials=creds)
    
    # Create the message
    message = MIMEMultipart()
    message['to'] = to
    message['subject'] = subject

    # Add the body of the email
    message.attach(MIMEText(body, 'plain'))

    # Add the file attachment (if provided)
    if file:
        attachment = open(file, "rb")
        p = MIMEBase('application', 'octet-stream')
        p.set_payload((attachment).read())
        encoders.encode_base64(p)
        p.add_header('Content-Disposition', "attachment; filename= %s" % file)
        message.attach(p)

    # Convert the message to a string and encode as base64
    raw = base64.urlsafe_b64encode(message.as_bytes()).decode('utf-8')

    try:
        # Send the email using the Gmail API
        message = service.users().messages().send(userId="me", body={'raw': raw}).execute()
        print(F'Successfully sent message to {to} Message Id: {message["id"]}')
    except HttpError as error:
        print(F'An error occurred: {error}')
        message = None
        
    return message

if __name__ == '__main__':
    send_message('miladatx@gmail.com', 'test email', 'test body')