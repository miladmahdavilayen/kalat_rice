from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

    

class MongoDB():
    uri = "mongodb+srv://miladmahdavilayen:HKM0HHN8UfDJPb0s@miladcluster.u4hs6ts.mongodb.net/?retryWrites=true&w=majority"
    def __init__(self, collection_name, db_name, uri=uri):
        self.db_name = db_name
        self.client = MongoClient(uri, server_api=ServerApi('1'))
        self._test_client()
        self.collection = self.client[collection_name]

    def _test_client(self):
        try:
            self.client.admin.command('ping')
            print("O.K")
        except Exception as e:
            print(e)

    def get_db(self):
        return self.collection[self.db_name]
    

milad = {'name': 'milad mahdavi', 'email': 'milad@gmial.com', 'orders':{'order_id':'252462467', 'amount':'450', 'delivery_type': 'deliver', 'order_date': '34/34/566'}, 'address': 'mashhad'}

if __name__ == "__main__":
    db = MongoDB('mahdavi-rice-db')
    users = db.get_db('users')
    
    
    