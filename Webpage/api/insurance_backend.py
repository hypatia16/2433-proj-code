from flask import Flask, jsonify,request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
import urllib.parse
import pandas as pd
import joblib

import sys
print(sys.path)


app = Flask(__name__)

# Azure SQL connection details
server = '2433-project-server.database.windows.net'
database = 'CourseProject'
username = 'CloudSA314da031'
password = 'Hypatia@2023' # add your own password
driver = '{ODBC Driver 17 for SQL Server}'

# Configure Database URI using SQLAlchemy
params = urllib.parse.quote_plus(f"DRIVER={driver};SERVER=tcp:{server},1433;DATABASE={database};UID={username};PWD={password}")
app.config['SQLALCHEMY_DATABASE_URI'] = f"mssql+pyodbc:///?odbc_connect={params}"
app.config['SQLALCHEMY_COMMIT_ON_TEARDOWN'] = True
app.config['SECRET_KEY'] = 'supersecret'

# Initialize SQLAlchemy
db = SQLAlchemy(app)

# Load the trained Random Forest model
rf_model = joblib.load('random_forest_model.pkl')

@app.route('/check_database')
def check_database():
    try:
        # Execute a query to get all data from the dbo.Insurance table
        # Wrap the SQL query with text()
        sql_query = text("SELECT * FROM dbo.Insurance")
        result_proxy = db.session.execute(sql_query)

        # Fetch the column names
        columns = result_proxy.keys()

         # Convert result set to a list of dictionaries
        result = [dict(zip(columns, row)) for row in result_proxy]

        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)})

# @app.route('/predict_charges', methods=['POST'])
# def predict_charges():
#     try:
#         # Extract data from POST request
#         data = request.json
#         input_data = pd.DataFrame([data])

#         # One-hot encode categorical variables as done during model training
#         # Make sure to only include the categories that were present in the training data
#         cat_cols = ['region', 'sex', 'smoker']  # Adjust this list based on your model training
#         input_data = pd.get_dummies(input_data, columns=cat_cols)

#         # List of columns expected by the model (adjust this based on your model's training data)
#         expected_columns = ['age', 'bmi', 'children',
#                             'region_northwest', 'region_southeast', 'region_southwest',
#                             'sex_male', 'smoker_yes']

#         # Add missing columns with default value of 0
#         for column in expected_columns:
#             if column not in input_data.columns:
#                 input_data[column] = 0

#         # Ensure the order of columns matches the training data
#         input_data = input_data[expected_columns]

#         # Predict charges
#         predicted_charges = rf_model.predict(input_data)

#         return jsonify({"predicted_charges": predicted_charges[0]})
#     except Exception as e:
#         return jsonify({"error": str(e)})


@app.route('/add_record', methods=['PUT'])
def add_record():
    try:
        # Get data from request (excluding 'charges')
        data = request.json
        input_data = pd.DataFrame([data])

        # One-hot encode categorical variables as done during model training
        cat_cols = ['region', 'sex', 'smoker']  # Adjust this list based on your model training
        input_data = pd.get_dummies(input_data, columns=cat_cols)

        # List of columns expected by the model (adjust this based on your model's training data)
        expected_columns = ['age', 'bmi', 'children',
                            'region_northwest', 'region_southeast', 'region_southwest',
                            'sex_male', 'smoker_yes']

        # Add missing columns with default value of 0
        for column in expected_columns:
            if column not in input_data.columns:
                input_data[column] = 0

        # Ensure the order of columns matches the training data
        input_data = input_data[expected_columns]

        # Predict charges using the model
        calculated_charges = rf_model.predict(input_data)[0]
        data['charges'] = calculated_charges

        # Construct SQL INSERT query (including calculated 'charges')
        sql_query = text("""
            INSERT INTO dbo.Insurance (age, bmi, charges, children, region, sex, smoker)
            VALUES (:age, :bmi, :charges, :children, :region, :sex, :smoker)
        """)

        # Execute the query with data from the request
        db.session.execute(sql_query, data)
        db.session.commit()

        # Return the calculated charges to the front end
        return jsonify(calculated_charges)
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)})


if __name__ == '__main__':
    app.run()
