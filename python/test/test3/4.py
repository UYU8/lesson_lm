class Person:
    def __init__(self, name, gender):
        self.name = name
        self.gender = gender

class Student(Person):
    def __init__(self, name, gender, score):
        super().__init__(name, gender)
        self.score = score

stu = Student("张三", "男", 85)
print(stu.name, stu.gender, stu.score)