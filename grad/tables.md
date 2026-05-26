: 表 4-1 users（用户信息表）

| 字段名 | 字段属性 | 长度 | 约束 | 说明 |
| :--- | :--- | :--- | :--- | :--- |
| id | INTEGER | | 主键 | 用户记录id |
| username | VARCHAR | 255 | 非空，唯一 | 登录用户名 |
| password | VARCHAR | 255 | 非空 | 加密密码哈希值 |
| monthly_budget | DECIMAL | | 允许空 | 用户月度预算 |
| created_at | DATETIME | | 非空 | 记录创建时间 |
| updated_at | DATETIME | | 非空 | 记录更新时间 |

<br>

: 表 4-2 categories（账单分类表）

| 字段名 | 字段属性 | 长度 | 约束 | 说明 |
| :--- | :--- | :--- | :--- | :--- |
| id | INTEGER | | 主键 | 分类记录id |
| user_id | INTEGER | | 外键，非空 | 所属用户id |
| name | VARCHAR | 50 | 非空 | 分类名称 |
| icon | VARCHAR | 100 | 非空 | 前端图标标识名 |
| type | VARCHAR | 20 | 非空 | income/expense |
| created_at | DATETIME | | 非空 | 记录创建时间 |
| updated_at | DATETIME | | 非空 | 记录更新时间 |

<br>

: 表 4-3 transactions（账单流水表）

| 字段名 | 字段属性 | 长度 | 约束 | 说明 |
| :--- | :--- | :--- | :--- | :--- |
| id | INTEGER | | 主键 | 流水记录id |
| user_id | INTEGER | | 外键，非空 | 所属用户id |
| category_id | INTEGER | | 外键，非空 | 所属分类id |
| amount | DECIMAL | | 非空 | 账单交易金额 |
| remark | VARCHAR | 255 | 允许空 | 账单备注信息 |
| date | DATETIME | | 非空 | 发生交易日期 |
| created_at | DATETIME | | 非空 | 记录创建时间 |
| updated_at | DATETIME | | 非空 | 记录更新时间 |

<br>

: 表 4-4 chat_messages（聊天消息表）

| 字段名 | 字段属性 | 长度 | 约束 | 说明 |
| :--- | :--- | :--- | :--- | :--- |
| id | INTEGER | | 主键 | 消息记录id |
| user_id | INTEGER | | 外键，非空 | 所属用户id |
| role | VARCHAR | 50 | 非空 | user/assistant |
| content | TEXT | | 非空 | 消息文本内容 |
| created_at | DATETIME | | 非空 | 记录创建时间 |
| updated_at | DATETIME | | 非空 | 记录更新时间 |
