# 写一个自己的endswith函数，判断一个字符串是否已指定的字符串结束，
# 要求输入一行字符串和结束字符，字符串和结束字符之间用’,’隔开。

def endswith(input_string):
    parts = input_string.split(',')

    if len(parts) != 2:
        return "请确保输入格式为 '字符串,结束字符'"

    main_string = parts[0].strip()
    ending_string = parts[1].strip()

    if main_string.endswith(ending_string):
        return True
    else:
        return False

# 获取用户输入
input1 = input("请输入字符串和结束字符（用逗号分隔）：")

# 调用自定义的 endswith 函数
result = endswith(input1)

# 根据结果输出相应的信息
if result is True:
    print("该字符串以指定的结束字符结尾。")
elif result is False:
    print("该字符串不以指定的结束字符结尾。")
else:
    print(result)