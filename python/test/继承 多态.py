# 输入列表元素个数和相应数据（整数），
# 统计并输出列表长度，列表中位数、低于中位数元素的个数、高于中位数元素的个数、
# 输出列表元素的平方和、降序排序后的列表。
def main():
    # 获取用户输入的列表元素个数和数据
    n = int(input("请输入列表元素个数: "))
    print("请输入{}个整数:".format(n))
    data = list(map(int, input().split()))
    
    # 计算列表长度
    length = len(data)
    
    # 对列表进行排序
    sorted_data = sorted(data)

    # 计算中位数
    if length % 2 == 0:
        median = (sorted_data[length // 2 - 1] + sorted_data[length // 2]) / 2
    else:
        median = sorted_data[length // 2]
    
    # 统计低于和高于中位数的元素个数
    lower_count = sum(1 for x in data if x < median)
    higher_count = sum(1 for x in data if x > median)
    
    # 计算列表元素的平方和
    square_sum = sum(x ** 2 for x in data)
    
    # 降序排序
    desc_sorted_data = sorted_data[::-1]
    
    # 输出结果
    print("列表长度:", length)
    print("中位数:", median)
    print("低于中位数的元素个数:", lower_count)
    print("高于中位数的元素个数:", higher_count)
    print("列表元素的平方和:", square_sum)
    print("降序排序后的列表:", desc_sorted_data)
    
main()
