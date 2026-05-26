# 起步里程为3km（含3km），起步费6元。超过起步里程后载客行驶15km以内部分，基本单价1.8元/km。
# 载客行驶超过15km部分，基本单价加收50%的费用。时速低于12km/h的慢速行驶时间计入等待时间，每等待1分钟加收1元。
# 输入乘车里程数（整数）、等待时间，输出车费。
def fare(nums,time):
    if nums<=3:
        fare = 6
    elif  nums<=15:
         fare = 6 + (nums -3) * 1.8
    elif nums>15:
         fare = 6 + (nums -3) * 1.8 * 1.5
         if time > 0:
            fare = fare + time
            return fare
nums = int(input())
time = int(input())
print(fare(nums,time))
