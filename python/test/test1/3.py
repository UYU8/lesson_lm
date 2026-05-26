# 读入两行，两行的格式一样，都是用空格分隔的若干个整数，将这些数合并到一个列表中，降序排列后输出整个列表。
# 示例 
# 输入：
# 1 5 9 -1 0
# 234 6 9 2 34 0
# 输出：
# [234, 34, 9, 9, 6, 5, 2, 1, 0, 0, -1]
l1 = list(map(int,input().split()))
l2 = list(map(int,input().split()))
for i in l2:
    l1.append(i)
l1.sort(reverse=True)
print(l1)