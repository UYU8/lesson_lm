def Merge(dict1, dict2):
    """
    合并两个字典，返回一个新的字典。

    参数：
    dict1：字典，需要合并的第一个字典。
    dict2：字典，需要合并的第二个字典。

    返回值：
    一个新的字典，包含了 dict1 和 dict2 中的所有键值对。
    如果 dict1 和 dict2 中有相同的键，则 dict2 中的值会覆盖 dict1 中的值。
    """
    # 使用 ** 操作符将字典 dict1 和 dict2 合并成一个新的字典
    res = {**dict1, **dict2}

    return res
# 对象字面量 python 字典 key:value 键值对
dict1 = {"name": "奶龙", "age": 8}
dict2 = {"name": "暴暴龙", "city": "全军列队"}
dict3 = Merge(dict1, dict2)
print(dict3)