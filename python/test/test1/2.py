# 已知列表 a_list = [11,22,33,44,55,66,77,88,99,90]，将所有大于 60 的值保存至字典的第一个 key 中，将小于 60 的值保存至第二个 key 的值中。
# 即：{'k1': 大于 60 的所有值,'k2': 小于 60 的所有值}。
a_list = [11,22,33,44,55,66,77,88,99,90]
dict = {}
k1 = []
k2 = []
for i in a_list:
    if i > 60:
        k1.append(i)
    else:
        k2.append(i)
dict['k1'] = k1
dict['k2'] = k2
print(dict)