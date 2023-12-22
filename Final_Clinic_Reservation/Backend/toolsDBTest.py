import psycopg2
conn = psycopg2.connect(database="tools",host="localhost",user="postgres",password="amralaa1212",port="5432")
cur = conn.cursor()

cur.execute('''
            CREATE TABLE IF NOT EXISTS Users
            (
                id serial PRIMARY KEY,
                name varchar(100),
                email varchar(100),
                password varchar(50),
                role varchar(50)
            );''')

cur.execute('''
            CREATE TABLE IF NOT EXISTS Appointments
            (
                id serial PRIMARY KEY NOT NULL,
                date varchar(100) NOT NULL,
                hour varchar(100) NOT NULL,
                createdBy INT NOT NULL,
                occupiedBy INT DEFAULT NULL,
                CONSTRAINT fk_doctor FOREIGN KEY(createdBy) REFERENCES Users(id),
                CONSTRAINT fk_patient FOREIGN KEY(occupiedBy) REFERENCES Users(id)
            );''')

#cur.execute(f'''INSERT INTO Appointments (createdBy,date,hour) VALUES (1,'ali','ali') ''')

#cur.execute('''DELETE FROM Appointments WHERE id = 1''')

#cur.execute('''UPDATE Appointments SET occupiedBy =''')

# cur.execute(f'''INSERT INTO Users (name, email, password, role) VALUES ('ali','ali','ali','doctor') ''')


cur.close()
conn.commit()
conn.close()