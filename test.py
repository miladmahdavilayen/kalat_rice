import requests
import json


response = requests.get("https://ipinfo.io").content
# print(dir(response))

print(str(response))
# for item in response:
#     print(item)