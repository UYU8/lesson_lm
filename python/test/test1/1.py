# 从字符表abcdefghijklmnopqrstuvwxyz中随机挑选两个字母组成字符串，共挑选10个，降序输出所有不同的字符串及重复的次数。
# 例如：产生的10个随机字母组成的字符串分别为ab, cx, gd, ef, oc, jk, gh, bs, py, uv，
# 输出结果为[('uv',1), ( 'py',1), ( 'oc',1), ( 'jk',1), ('gh',1), ('gd',1), ('ef',1), ('cx',1), ('bs',1), ('ab',1)]。
import random
# 字符表
i = 'abcdefghijklmnopqrstuvwxyz'
# 生成10个随机字符串并统计出现次数
count = {}
for _ in range(10):
    # 随机挑选两个字母并组合成字符串
    rs = ''.join(random.sample(i, 2))
    # 更新计数
    count[rs] = count.get(rs, 0) + 1
# 按字符串降序排序rs
sortedr= sorted(count.items(), key=lambda x: x[0], reverse=True)
# 输出结果
print(sortedr)