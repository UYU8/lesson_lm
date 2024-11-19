import random
# 字符表
i = 'abcdefghijklmnopqrstuvwxyz'
# 生成10个随机字符串并统计出现次数
string_count = {}
for _ in range(10):
    # 随机挑选两个字母并组合成字符串
    random_string = ''.join(random.sample(i, 2))
    # 更新计数
    string_count[random_string] = string_count.get(random_string, 0) + 1
# 按字符串降序排序
sorted_results = sorted(string_count.items(), key=lambda x: x[0], reverse=True)
# 输出结果
print(sorted_results)