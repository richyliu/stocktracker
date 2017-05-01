import random


f = open('data.txt', 'w')


# 8 possible winning configurations
# 0 is empty, 1 is filled
win = [
    '001001001',
    '010010010',
    '100100100',
    # ^- vertical columns
    '111000000',
    '000111000',
    '000000111',
    # ^- horizontal rows
    '100010001',
    '001010100'
    # ^- x shapes
]



for _ in range(100):
    a = random.choice(win)
    f.write(a + '\n')


f.close()
