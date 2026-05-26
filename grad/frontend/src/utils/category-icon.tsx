/**
 * 分类图标工具 — 根据分类名称返回对应的 Ant Design Icon 组件
 * 供 QuickAddSheet、ChartsPage 等共享使用
 */

import React from 'react';
import {
  AccountBookOutlined,
  AppstoreOutlined,
  AudioOutlined,
  BookOutlined,
  CarOutlined,
  ClockCircleOutlined,
  CoffeeOutlined,
  CompassOutlined,
  EllipsisOutlined,
  FilterOutlined,
  FireOutlined,
  FundOutlined,
  GiftOutlined,
  HeartOutlined,
  HighlightOutlined,
  HomeOutlined,
  LaptopOutlined,
  MedicineBoxOutlined,
  MobileOutlined,
  PaperClipOutlined,
  PhoneOutlined,
  PlayCircleOutlined,
  ReadOutlined,
  ReconciliationOutlined,
  RedEnvelopeOutlined,
  RocketOutlined,
  SafetyCertificateOutlined,
  ScissorOutlined,
  SettingOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  SkinOutlined,
  SmileOutlined,
  SolutionOutlined,
  StarOutlined,
  SwapOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  ToolOutlined,
  TrophyOutlined,
  TruckOutlined,
  UserOutlined,
  VideoCameraOutlined,
  WalletOutlined,
  WifiOutlined,
} from '@ant-design/icons';

/* ─────────────────────────────────────────
   分类图标映射 — 关键词 → AntD Icon
   （支持多关键词，越具体的写越前面）
───────────────────────────────────────── */
const ICON_RULES: Array<[string[], React.ReactNode]> = [
  // ── 支出：餐饮相关
  [['餐饮', '吃饭', '餐厅', '外卖', '午饭', '早餐', '晚餐', '美食'], <CoffeeOutlined />],
  [['咖啡', '奶茶', '饮料', '下午茶'], <CoffeeOutlined />],
  [['蔬菜', '菜市场', '生鲜'], <ShoppingCartOutlined />],
  [['水果'], <FilterOutlined />],
  [['零食', '小吃', '甜点', '糕点'], <SmileOutlined />],
  [['烟酒', '烟草', '酒水', '啤酒', '白酒'], <FireOutlined />],

  // ── 支出：购物
  [['购物', '网购', '电商', '超市', '百货'], <ShoppingOutlined />],
  [['日用', '日常', '生活用品', '卫生', '纸巾'], <ShopOutlined />],
  [['服饰', '衣服', '鞋子', '穿搭', '服装', '衣物'], <SkinOutlined />],
  [['美容', '化妆', '护肤', '美发', '发型', '美甲'], <ScissorOutlined />],
  [['礼物', '礼品', '送礼'], <GiftOutlined />],

  // ── 支出：交通出行
  [['交通', '公交', '地铁', '打车', '出行', '滴滴', '出租'], <CarOutlined />],
  [['汽车', '加油', '停车', '洗车', '保养', '维修汽车', '车险'], <CarOutlined />],
  [['旅行', '旅游', '出游', '度假', '机票', '酒店', '住宿'], <RocketOutlined />],
  [['快递', '快运', '物流', '货运'], <TruckOutlined />],

  // ── 支出：住房
  [['住房', '房租', '房贷', '租房', '押金'], <HomeOutlined />],
  [['居家', '家居', '家具', '装修', '家电'], <HomeOutlined />],
  [['水电', '水费', '电费', '燃气', '暖气', '物业'], <ThunderboltOutlined />],

  // ── 支出：健康医疗
  [['医疗', '看病', '医院', '药品', '药费', '门诊', '体检'], <MedicineBoxOutlined />],
  [['保险', '保险费', '意外险', '医保', '社保'], <SafetyCertificateOutlined />],
  [['运动', '健身', '健身房', '游泳', '跑步', '球类'], <TrophyOutlined />],

  // ── 支出：娱乐
  [['娱乐', '游戏', '网游', '电游', '游乐'], <PlayCircleOutlined />],
  [['电影', '影视', '剧集', '看剧', '电视'], <VideoCameraOutlined />],
  [['音乐', '演唱会', '音乐会', '乐器'], <AudioOutlined />],
  [['旅游景点', '门票', '景区'], <CompassOutlined />],

  // ── 支出：通讯数码
  [['通讯', '话费', '流量', '电话费', '手机费', '网络费'], <PhoneOutlined />],
  [['网络', 'wifi', '宽带', '网费'], <WifiOutlined />],
  [['数码', '电子', '手机', '相机', '耳机', '平板'], <MobileOutlined />],
  [['电脑', '笔记本', '电脑配件'], <LaptopOutlined />],

  // ── 支出：教育学习
  [['学习', '培训', '课程', '教育'], <ReadOutlined />],
  [['书籍', '图书', '书本', '杂志', '漫画'], <BookOutlined />],
  [['学费', '补课', '辅导班'], <SolutionOutlined />],

  // ── 支出：人际社交
  [['社交', '聚餐', '请客', '朋友', '同学', '同事', '应酬'], <TeamOutlined />],
  [['孩子', '儿童', '小孩', '育儿', '奶粉', '玩具', '早教'], <SmileOutlined />],
  [['长辈', '父母', '老人', '孝顺', '赡养'], <UserOutlined />],
  [['亲友', '亲戚', '家人'], <TeamOutlined />],

  // ── 支出：其他
  [['宠物', '狗粮', '猫粮', '宠物医院', '猫', '狗'], <HeartOutlined />],
  [['礼金', '红包', '份子钱', '婚礼', '红包支出'], <RedEnvelopeOutlined />],
  [['办公', '办公用品', '文具', '打印', '耗材'], <PaperClipOutlined />],
  [['维修', '修理', '维护', '零件'], <ToolOutlined />],
  [['捐赠', '慈善', '公益', '捐款'], <HeartOutlined />],
  [['彩票', '福彩', '体彩', '竞猜'], <StarOutlined />],
  [['税费', '税款', '手续费', '罚款'], <AccountBookOutlined />],

  // ── 收入
  [['工资', '薪资', '薪水', '月薪', '底薪'], <WalletOutlined />],
  [['奖金', '年终奖', '绩效', '提成', '激励'], <TrophyOutlined />],
  [['兼职', '副业', '兼差', '外快', '临时工'], <ClockCircleOutlined />],
  [['理财', '基金', '股票', '分红', '利息', '收益', '投资'], <FundOutlined />],
  [['收入红包', '收到红包'], <RedEnvelopeOutlined />],
  [['租金', '出租', '租房收入', '房租收入'], <HomeOutlined />],
  [['报销', '退款', '退费', '补贴'], <ReconciliationOutlined />],
  [['转账', '收款', '回款'], <SwapOutlined />],
  [['稿费', '版权', '稿酬'], <HighlightOutlined />],
  [['销售', '卖出', '变卖'], <ShoppingOutlined />],
  [['中奖', '彩票收入'], <StarOutlined />],

  // ── 通用兜底
  [['设置', '系统', '配置'], <SettingOutlined />],
  [['其它', '其他', '杂项', '未分类'], <EllipsisOutlined />],
];

/**
 * 根据分类名称返回匹配的图标组件
 * @param name 分类名称
 */
export function getCategoryIcon(name: string): React.ReactNode {
  const lowerName = (name || '').toLowerCase();
  for (const [keywords, icon] of ICON_RULES) {
    if (keywords.some(kw => lowerName.includes(kw))) return icon;
  }
  return <AppstoreOutlined />;
}
