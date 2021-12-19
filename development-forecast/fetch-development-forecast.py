import pandas as pd

url = "https://www.alamedaca.gov/Departments/Planning-Building-and-Transportation/Planning-Division/Development-Forecast"
dfs = pd.read_html(url, header=0)
df = dfs[0]

# remove the last column
df.drop(df.columns[len(df.columns)-1], axis=1, inplace=True)

df.to_csv('development-forecast.csv')
df.to_html('development-forecast.html')
