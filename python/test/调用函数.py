# 一个不含0的数，如果它能被它的每一位除尽，则它是一个自除数。例如128是一个自除数，因为128能被1、2、8整除。
# 编写函数selfDivisor(num)判断num是否为自除数，
# 在函数外使用该函数输出不大于N的所有自除数。（注意，含有数字0的数不是自除数
def selfDivisor(num):
    num_str = str(num)
    for i in num_str:
        if int(i) == 0 or num % int(i) != 0:
            return False
    return True
def nums(N):
    for j in range(1,N+1):
        if selfDivisor(j):
            print(j)

N = int(input())
nums(N)    
