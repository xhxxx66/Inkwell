import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 生成一段较长的章节内容
function generateChapterContent(chapterNum: number): string {
  const paragraphs = [
    `天色渐暗，暮色笼罩着整个青云山脉。群峰之间，云雾缭绕，偶有飞鸟掠过，发出清脆的鸣叫声。山脚下的小镇已经亮起了星星点点的灯火，炊烟袅袅升起，混合着山间的草木气息，弥漫在空气中。`,
    `少年站在山崖边，望着远方连绵起伏的群山，心中涌起一股难以言喻的感觉。三年了，自从踏入修炼之路以来，他经历了太多太多。从一个懵懂无知的少年，到如今已经能够引气入体，感受到天地间灵气的流动。`,
    `"师兄，天色不早了，我们该回去了。"身后传来一个清脆的声音，是小师妹沈月华。她穿着一身素白色的长裙，黑发如瀑布般垂落在肩头，一双明亮的眼睛看着他，带着几分关切。`,
    `他转过身来，微微一笑："月华，你先回去吧，我再待一会。今天修炼有所感悟，想在这里再体会一下。"`,
    `沈月华皱了皱眉，但还是点了点头。她知道师兄的性格，一旦决定的事情，就不会轻易改变。"那师兄小心，山上夜间有妖兽出没，不要太晚了。"说完，她转身沿着山路走下去，白色的身影很快消失在暮色之中。`,
    `独自一人站在山巅，少年闭上了眼睛，开始感受天地间灵气的脉动。修炼之道，讲究的是与天地共鸣。只有真正感受到自然的力量，才能够将灵气纳为己用，突破一个又一个境界。`,
    `他的呼吸渐渐变得平稳而悠长，身体周围的灵气开始产生微妙的波动。这是一种难以形容的感觉，仿佛整个人都融入了天地之间，成为了自然的一部分。风从耳边呼啸而过，带着山间特有的清冷气息。`,
    `突然，一道微弱的光芒从他的丹田处升起，沿着经脉缓缓流转。这是他修炼数月以来第一次出现的异象。少年心中一喜，但随即强压下激动的情绪，继续保持平静的心境。`,
    `时间一分一秒地过去，夜幕已经完全降临。月光如水般洒落在山巅，将整个世界镀上了一层银白色的光辉。在这宁静而神秘的氛围中，少年的修为在不知不觉间产生了质变。`,
    `"咔嚓——"一声清脆的声响从他体内传出，那是经脉被打通的声音。紧接着，一股温热的气流从丹田涌出，如同潮水般冲刷着他的四肢百骸。这种感觉既痛苦又畅快，仿佛整个身体都在被重新塑造。`,
    `当他再次睁开眼睛的时候，世界在他眼中变得不一样了。月光不再只是普通的光芒，而是蕴含着某种特殊的能量。空气中的灵气变得清晰可见，如同无数微小的光点在空中飘荡。`,
    `"筑基期……我终于突破了！"少年低声喃喃，脸上露出了难以抑制的喜悦之情。这个境界，他足足追逐了两年之久。无数个日日夜夜的苦修，终于在这一刻得到了回报。`,
    `然而，喜悦还未持续多久，山下突然传来一阵急促的钟声。那是宗门的警钟，只有在遭遇重大危机的时候才会敲响。少年脸色一变，二话不说，身形一闪，如同一道流光般向山下飞掠而去。`,
    `此时的他已经不同于往日。突破筑基期之后，他的速度和力量都有了质的飞跃。原本需要半个时辰才能走完的山路，现在只需要几个呼吸的时间就能到达。`,
    `当他赶到宗门广场的时候，已经有不少弟子聚集在那里。每个人的脸上都带着紧张和不安的表情。广场中央，宗门的长老们正在低声商议着什么，气氛异常凝重。`,
    `"发生什么事了？"少年拉住旁边的一名师弟，急切地问道。`,
    `师弟脸色苍白，声音发抖："师兄，是魔教的人……他们已经打到了外围防线。掌门师叔祖正在抵挡，但对方来的人太多了……"`,
    `少年的心沉了下去。魔教与正道的争斗由来已久，但谁也没想到，他们会在这个时候发动突袭。而且从师弟的描述来看，这次魔教是有备而来，来势汹汹。`,
    `"所有筑基期以上的弟子，立即到前殿集合！"一道洪亮的声音从高处传来，是大师兄的命令。少年深吸一口气，收起心中的恐惧和不安，大步向前殿走去。`,
    `这一夜，注定是不平凡的一夜。这一战，将会改变很多人的命运。而对于刚刚突破筑基期的少年来说，这场战斗既是一个考验，也是一个真正踏入修炼者世界的开始。`,
  ]

  // 根据章节号选择不同的开头
  const openings = [
    `第${chapterNum}章的故事发生在一个月后。`,
    `距离上次的事件已经过去了数日。`,
    `清晨的阳光洒在修炼场上。`,
    `夜幕再次降临青云山。`,
    `一封来自远方的飞剑传书打破了宗门的宁静。`,
  ]

  const opening = openings[(chapterNum - 1) % openings.length]
  // 每章随机选取 15-20 段，保证内容足够长
  const selectedParagraphs: string[] = [opening, '']
  const count = 15 + (chapterNum % 6)
  for (let i = 0; i < count; i++) {
    selectedParagraphs.push(paragraphs[i % paragraphs.length])
    selectedParagraphs.push('')
  }

  return selectedParagraphs.join('\n')
}

async function main() {
  // 确保分类存在
  const category = await prisma.category.upsert({
    where: { name: '玄幻' },
    update: {},
    create: { name: '玄幻', orderNum: 1 },
  })

  // 创建测试书籍
  const book = await prisma.book.create({
    data: {
      title: '青云修仙录',
      author: '测试作者',
      cover: 'https://picsum.photos/300/400?random=999',
      description: '一个普通少年踏入修仙之路，历经磨难，终成大道的故事。从懵懂无知的少年到一代仙尊，他用自己的坚持和毅力，书写了一段波澜壮阔的修仙传奇。',
      wordCount: 0,
      chapterCount: 10,
      status: '连载中',
      rating: 8.8,
      readCount: 12580,
      likeCount: 3200,
      collectCount: 1580,
      commentCount: 456,
      publishedAt: new Date(),
      categoryId: category.id,
    },
  })

  // 创建标签
  const tagNames = ['热血', '升级', '修仙']
  for (const name of tagNames) {
    const tag = await prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name },
    })
    await prisma.bookTag.upsert({
      where: { bookId_tagId: { bookId: book.id, tagId: tag.id } },
      update: {},
      create: { bookId: book.id, tagId: tag.id },
    })
  }

  // 创建10个章节，每章内容较长
  const chapterTitles = [
    '少年初入修仙路',
    '灵根觉醒',
    '入门考核',
    '筑基之夜',
    '魔教来袭',
    '生死一战',
    '绝地逢生',
    '秘境探险',
    '意外收获',
    '再次启程',
  ]

  let totalWords = 0
  for (let i = 0; i < chapterTitles.length; i++) {
    const content = generateChapterContent(i + 1)
    const wordCount = content.length

    await prisma.chapter.create({
      data: {
        title: chapterTitles[i],
        content,
        wordCount,
        orderNum: i + 1,
        bookId: book.id,
        isVip: i >= 8,
      },
    })

    totalWords += wordCount
  }

  // 更新书籍总字数
  await prisma.book.update({
    where: { id: book.id },
    data: { wordCount: totalWords },
  })
}

main()
  .catch(() => {
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
