# 有1，2，3，4数字，能组成多少个互不相同且无重复的三位数并输出这些三位数
i = [1,2,3,4]
j = []
count = 0
for a in i:
    for b in i:
        for c in i:
            if a !=b and b != c and a!=c:
                count+=1
                j.append(a*100+b*10+c)
print('能组成{}个三位数'.format(count))
for num in j:
    print(num, end=" ") 
