from bson import ObjectId  # For ObjectId to work
import copy


class User:
    def __init__(self, collection):
        self.collection = collection

    def add_single(self, data):
        self.collection.insert_one(data)
        del data['password']
        data['_id'] = str(data['_id'])
        return data

    def get_single(self, email, password):
        data = self.collection.find_one({'email': email, 'password': password})

        if data == None:
            return None

        del data['password']
        data['_id'] = str(data['_id'])
        return data
