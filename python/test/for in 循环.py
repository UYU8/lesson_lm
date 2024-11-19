# 将1元人民币兑换成1，2，5分的硬币，有多少种换法？（硬币个数可以为0）例如，其中一种换法为：10个1分硬币加20个2分硬币加10个5分硬币。
def count():
    count = 0
    for i in range(101):
        for j in range(51):
            for k in range(21):
                if i + 2 * j + 5 * k == 100:
                    count += 1
    return count
print(count())