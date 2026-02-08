import Mock from 'mockjs'

const categories = ['玄幻', '仙侠', '都市', '历史', '科幻', '游戏', '武侠', '悬疑', '言情', '军事']
const tags = ['热血', '爽文', '系统', '重生', '穿越', '升级', '无敌', '种田', '虐恋', '甜宠']

const books = Mock.mock({
  'list|50': [
    {
      'id|+1': 1,
      title: '@ctitle(2,6)',
      author: '@cname',
      cover: '@image(300x400)',
      category: () => Mock.Random.pick(categories),
      description: '@ctitle(15,40)',
      tags: () => Mock.Random.pick(tags, 2),
      'wordCount|100000-5000000': 1,
      'chapterCount|100-2000': 1,
      status: () => Mock.Random.pick(['连载中', '已完结']),
      'rating|6-10.1': 1,
      'readCount|10000-10000000': 1,
      'likeCount|100-100000': 1,
      'collectCount|100-50000': 1,
      'commentCount|10-5000': 1,
      publishedAt: '@datetime("yyyy-MM-dd")',
    }
  ]
}).list

export default [
  {
    url: '/api/books',
    method: 'get',
    response: ({ query }) => {
      const { page = '1', limit = '10', category } = query
      const currentPage = parseInt(page, 10)
      const size = parseInt(limit, 10)

      if (isNaN(currentPage) || isNaN(size) || currentPage < 1 || size < 1) {
        return {
          code: 400,
          msg: 'Invalid page or limit',
          data: null
        }
      }

      // 按分类筛选
      let filteredBooks = books
      if (category && category !== '全部') {
        filteredBooks = books.filter(book => book.category === category)
      }

      const total = filteredBooks.length
      const start = (currentPage - 1) * size
      const end = start + size
      const paginatedData = filteredBooks.slice(start, end)

      return {
        code: 200,
        msg: 'success',
        items: paginatedData,
        pagination: {
          current: currentPage,
          limit: size,
          total,
          pages: Math.ceil(total / size)
        }
      }
    }
  },
  {
    url: '/api/books/:id',
    method: 'get',
    response: ({ query }) => {
      const id = parseInt(query.id, 10)
      const book = books.find(b => b.id === id)

      if (!book) {
        return {
          code: 404,
          msg: 'Book not found',
          data: null
        }
      }

      return {
        code: 200,
        msg: 'success',
        data: book
      }
    }
  },
  {
    url: '/api/categories',
    method: 'get',
    response: () => {
      return {
        code: 200,
        msg: 'success',
        data: ['全部', ...categories]
      }
    }
  }
]
