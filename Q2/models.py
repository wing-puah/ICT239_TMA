from bson import ObjectId  # For ObjectId to work

import copy
import pandas
import json


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
        parsed_data = parse_form_to_db(data)
        self.collection.insert_one(parsed_data)
        parsed_data['_id'] = str(parsed_data['_id'])
        return parsed_data

    def get_multi(self, user=None):
        query = {} if user == None else {'email': user}
        res = self.collection.find(query)
        return list(map(convert_id_to_string, list(res)))


def convert_id_to_string(data):
    data['_id'] = str(data['_id'])
    return json.dumps(data)


def parse_form_to_db(data):
    # we will store activities inside an object and do calculation herer
    date, time = data['datetime'].split('T')
    del data['datetime']
    data.update({'date': date, 'time': time, 'activities': {}})
    return parse_single_activities(data)


def parse_single_activities(data):
    total_calories = 0
    weight = data['weight']

    for k, v in calorie_per_min_per_kg_map.items():
        value = data[k]
        del data[k]

        if value == '':
            continue

        activity_minutes = float(value)
        data['activities'][k] = activity_minutes
        total_calories += activity_minutes * v * weight

    data['total_calories'] = total_calories
    return data


class FileMapper(Collection):
    def create_and_save_map(self, data):
        id_mapper = list(map(get_id, list(data)))
        to_db_data = {'all_ids': id_mapper}
        self.collection.insert_one(to_db_data)
        return to_db_data


def get_id(data):
    return data['_id']


class File(Collection):
    def upload(self, file):
        df = pandas.read_csv(file)
        df['date'] = df['datetime'].apply(get_date)
        df['time'] = df['datetime'].apply(get_time)
        df.drop('datetime', axis="columns", inplace=True)

        to_db_data = map_group_activities(list(df.to_dict('index').values()))
        self.collection.insert_many(to_db_data)

        return to_db_data


def map_group_activities(multi_data):
    for row in multi_data:
        row['activities'] = {}
        row = parse_single_activities(row)

    return multi_data


def get_date(str):
    return str.split('T')[0]


def get_time(str):
    return str.split('T')[1]
