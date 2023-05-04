
# SSH access to an Android phone is only available if the phone has been rooted, which can void the warranty and potentially leave the phone open to security risks. It is recommended to avoid rooting your phone unless you have a good understanding of the risks and know what you're doing.

# Assuming your Android phone is rooted, you can use the following steps to send an SMS message using Python and SSH:

# Install an SSH server on your Android phone, such as Dropbear or OpenSSH. You can do this by installing an app from the Google Play Store or by using a command-line tool like Termux.

# Connect to your Android phone via SSH using the following command in your terminal or command prompt:

# Note that the above command assumes you have the "androidhelper" Python module installed on your Android phone. If you don't have it installed, you can install it using the following command:

import paramiko
import time

def send_sms_android(phone_number, message, username, password, ip_address):
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(ip_address, username=username, password=password, port='8022')

    command = f"python -c \"import os; os.system(termux-sms-send -n '{phone_number}' '{message}');\""
    # command = f"python -c \"import androidhelper; droid = androidhelper.Android(); droid.smsSend('{phone_number}', '{message}')\""
    stdin, stdout, stderr = ssh.exec_command(command)
    print(stdin, stdout, stderr)
    time.sleep(1)

    ssh.close()
    
    

if __name__ == "__main__":
    send_sms_android("7164176050", "hello", 'u0_a189', '997615', '192.168.1.87')