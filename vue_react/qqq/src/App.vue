<template>
  <div class="tab-container">
    <!-- 标签页 -->
    <van-tabs v-model:active="activeTab" animated swipeable>
      <van-tab v-for="category in categories" :title="category.title" :key="category.key">
        <!-- 文章列表 -->
        <div v-for="article in filteredArticles(category.key)" :key="article.id" class="article-item">
          <h3>{{ article.title }}</h3>
          <p>{{ article.content }}</p>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeTab: 0, // 当前激活的标签页索引
      categories: [
        { title: '推荐', key: 'recommend' },
        { title: 'PC游戏', key: 'pcGame' },
        { title: '主机游戏', key: 'consoleGame' },
        { title: '手机游戏', key: 'mobileGame' },
        { title: '杂谈', key: 'miscellaneous' },
        { title: '科普', key: 'science' }
      ],
      articles: [
        // 示例文章数据
        { id: 1, category: 'pcGame', title: 'PC游戏文章1', content: '这是PC游戏的文章内容...' },
        { id: 2, category: 'consoleGame', title: '主机游戏文章1', content: '这是主机游戏的文章内容...' },
        { id: 3, category: 'mobileGame', title: '手机游戏文章1', content: '这是手机游戏的文章内容...' },
        { id: 4, category: 'miscellaneous', title: '杂谈文章1', content: '这是杂谈的文章内容...' },
        { id: 5, category: 'science', title: '科普文章1', content: '这是科普的文章内容...' },
        { id: 6, category: 'pcGame', title: 'PC游戏文章2', content: '这是另一篇PC游戏的文章内容...' },
        { id: 7, category: 'consoleGame', title: '主机游戏文章2', content: '这是另一篇主机游戏的文章内容...' },
        { id: 8, category: 'mobileGame', title: '手机游戏文章2', content: '这是另一篇手机游戏的文章内容...' },
        { id: 9, category: 'miscellaneous', title: '杂谈文章2', content: '这是另一篇杂谈的文章内容...' },
        { id: 10, category: 'science', title: '科普文章2', content: '这是另一篇科普的文章内容...' },
        // 更多文章...
      ]
    };
  },
  methods: {
    /**
     * 过滤文章，根据当前选择的栏目返回相应的文章列表
     * @param {string} categoryKey - 当前选中的栏目键值
     */
    filteredArticles(categoryKey) {
      if (categoryKey === 'recommend') {
        // 推荐页面展示所有栏目的文章
        return this.articles;
      } else {
        // 其他栏目仅展示对应栏目的文章
        return this.articles.filter(article => article.category === categoryKey);
      }
    }
  }
};
</script>

<style scoped>
.tab-container {
  padding: 16px;
}

.article-item {
  padding: 16px;
  border-bottom: 1px solid #e5e5e5;
  background-color: #f9f9f9;
}

.article-item h3 {
  margin: 0 0 8px;
  font-size: 18px;
}

.article-item p {
  margin: 0;
  color: #555;
}
</style>