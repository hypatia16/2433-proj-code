import pandas as pd
import pyodbc
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
import joblib

# Database connection details
server = '2433-project-server.database.windows.net'
database = 'CourseProject'
username = 'CloudSA314da031'
password = 'XXXXXX' # add your own password
driver = '{ODBC Driver 17 for SQL Server}'

# Connect to the database
conn = pyodbc.connect(
    f'DRIVER={driver};SERVER=tcp:{server},1433;DATABASE={database};UID={username};PWD={password};Connection Timeout=30',
    timeout=30
)
query = "SELECT * FROM dbo.Insurance"

# Load data into DataFrame
df_insurance = pd.read_sql(query, conn)

# Preprocessing
cat_cols = ['region', 'sex', 'smoker']  # Add other categorical columns if needed
df_insurance = pd.get_dummies(df_insurance, columns=cat_cols, drop_first=True, dtype="int")

# Splitting data
X = df_insurance.drop(["charges"], axis=1)
y = df_insurance["charges"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train the model
rf = RandomForestRegressor()
rf.fit(X_train, y_train)

# Evaluate the model
y_pred = rf.predict(X_test)
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)
print("Mean Absolute Error:", mae)
print("R-squared:", r2)

# Save the trained model
joblib.dump(rf, 'random_forest_model.pkl')
