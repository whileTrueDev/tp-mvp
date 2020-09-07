from datetime import datetime as dt

start_date = dt.strptime('2020-09-07 15:07:19','%Y-%m-%d %H:%M:%S')
str_start_date = dt.strftime(start_date, '%Y%m%d%H%M%S')
chat_date = dt.strptime(dt.now().strftime('%Y-%m-%d %H:%M:%S'), '%Y-%m-%d %H:%M:%S')
play_date = chat_date - start_date

print(str_start_date + 'komtiv')
print(type(str_start_date))