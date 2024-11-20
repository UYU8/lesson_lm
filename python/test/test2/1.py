# 编写程序，定义和调用函数def m(i),计算如下数列。结果保留4位小数。
# m(i)=4(1-1/3+1/5-1/7+···+1/(2i-1)-1/(2i+1)
def m(i):
    if i < 1:
        return "错误"
    total = 0.0
    for n in range(i):
        term_odd = 1 / (2 * n + 1)  # 1/(2n + 1)
        if n % 2 == 0:
            total += term_odd
        else:
            total -= term_odd
    result = 4 * total
    return round(result, 4)
a=(int(input("请输入i的值")))
print("结果为{}".format(m(a)))  # .format()将括号中的值插入{}中

