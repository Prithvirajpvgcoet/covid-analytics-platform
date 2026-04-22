import pandas as pd
import json

url = "https://raw.githubusercontent.com/kunalnandre/TE-Laboratory-Practicals/main/Data%20Science%20and%20Big%20Data/Mini%20Project/covid_vaccine_statewise.csv"
df = pd.read_csv(url)
with open('cols.json', 'w') as f:
    json.dump(list(df.columns), f)
