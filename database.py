import sqlite3
import csv
import time
import os

class Database:
    def __init__(self, db):
        self.conn = sqlite3.connect(db)
        self.cur = self.conn.cursor()
        self.cur.execute("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, e_name TEXT, f_name TEXT, email TEXT, phone TEXT, address TEXT, orders TEXT, phone_verified TEXT)")
        self.conn.commit()

    def insert(self, name, e_name, f_name, email, phone, address, order, phone_verified):
        self.cur.execute("INSERT INTO users (id, name, e_name, f_name, email, phone, address, orders, phone_verified) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?)", (name, e_name, f_name, email, phone, address, order, phone_verified))
        self.conn.commit()

    def fetch_all(self):
        self.cur.execute("SELECT * FROM users")
        rows = self.cur.fetchall()
        return rows
    
    def fetch_col_for_name(self, name, col):
        self.cur.execute(f"SELECT {col} FROM users WHERE name == '{name}'")
        rows = self.cur.fetchall()
        return rows
        
    
    def name_exists(self, name):
        self.cur.execute(f"SELECT EXISTS(SELECT 1 FROM users WHERE name = '{name}');")
        db_exist_check = self.cur.fetchall()
        return int(db_exist_check[0][0])
    
    def phone_exists(self, phone):
        self.cur.execute(f"SELECT EXISTS(SELECT 1 FROM users WHERE phone = '{phone}');")
        db_exist_check = self.cur.fetchall()
        return int(db_exist_check[0][0])

    def update(self, id_, id_val, col, col_val):
        self.cur.execute(f"UPDATE users SET {col} = '{col_val}' WHERE {id_} = '{id_val}';")
        self.conn.commit()
    
    def update_order(self, name, order):
        self.cur.execute('UPDATE users SET orders = ? WHERE name = ?', (order, name))
        
        self.conn.commit()
        

    def __del__(self):
        self.conn.close()



def export_db(csv_file):
    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    c.execute("PRAGMA table_info(users)") # Replace "table_name" with the name of your database table
    column_names = [column[1] for column in c.fetchall()]

    # Write the data to the CSV file
    c.execute("SELECT * FROM users") # Replace "table_name" with the name of your database table
    data = c.fetchall()
    
    with open(csv_file, 'w', newline='') as f:
        writer = csv.writer(f)
        # Write the column names to the first row of the CSV file
        
        writer.writerow(column_names)
        # Write the data to the remaining rows of the CSV file
        writer.writerows(data)
        

def get_current_time():
    current_time = time.localtime()
    time_ = time.strftime("%H:%M:%S", current_time)
    date_ = time.strftime("%Y-%m-%d", current_time)
    return f'{time_}_{date_}'
      
      
        
if __name__ == "__main__":
    curr_time = get_current_time()
    path = 'db_outputs'
    if not os.path.exists(path):
        os.mkdir(path)
        export_db(f'{path}/data_{curr_time}.csv')