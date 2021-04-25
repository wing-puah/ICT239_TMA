from bson import ObjectId  # For ObjectId to work
import copy


class Collection:
    def __init__(self, collection):
        self.collection = collection


class User(Collection):
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


calorie_per_min_per_kg_map = {
    'bicycling': 0.064,
    'walking': 0.084,
    'swimming': 0.13,
    'running': 0.21,
}


class Activity(Collection):
    def add_single(self, data):
        print(data)
        parsed_data = parse_form_to_db(data)
        self.collection.insert_one(parsed_data)
        parsed_data['_id'] = str(parsed_data['_id'])
        print(f'parsed_data: {parsed_data}')
        return parsed_data


def parse_form_to_db(data):
    # we will store activities inside an object and do calculation herer
    date, time = data['datetime'].split('T')
    del data['datetime']
    data.update({'date': date, 'time': time, 'activities': {}})
    total_calories = 0

    for k, v in calorie_per_min_per_kg_map.items():
        value = data[k]
        del data[k]

        if value == '':
            continue

        activity_minutes = float(value)
        data['activities'][k] = activity_minutes
        total_calories += activity_minutes * v

    data['total_calories'] = total_calories
    return data

    # for k, v in data.items():
    #     data_to_insert.append({'date': date, 'time': time, k: v})

    # return data_to_insert
