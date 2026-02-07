import {
  useState,
  useEffect,
  useMemo,
} from 'react'
import Autoplay from 'embla-carousel-autoplay'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi
} from '@/components/ui/carousel'

export interface SlideData {
  id: number | string
  image: string
  title?: string
}

interface SlideShowProps {
  slides: SlideData[]
  autoPlay?: boolean
  autoPlayDelay?: number
}

const SlideShow: React.FC<SlideShowProps> = ({
  slides,
  autoPlay = true,
  autoPlayDelay = 3000,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0)
  const [api, setApi] = useState<CarouselApi | null>(null)

  useEffect(() => {
    if (!api) return
    const onSelect = () => setSelectedIndex(api.selectedScrollSnap())
    api.on('select', onSelect)
    return () => {
      api.off('select', onSelect)
    }
  }, [api])

  // 使用 useMemo 创建插件，stopOnInteraction: false 确保交互后继续自动播放
  const plugins = useMemo(() => {
    if (!autoPlay) return []
    return [
      Autoplay({
        delay: autoPlayDelay,
        stopOnInteraction: false,  // 交互后继续自动播放
        stopOnMouseEnter: true,    // 鼠标悬停时暂停
      })
    ]
  }, [autoPlay, autoPlayDelay])

  return (
    <div className='relative w-full overflow-hidden rounded-2xl'>
      <Carousel
        className='w-full'
        setApi={setApi}
        plugins={plugins}
        opts={{ loop: true }}
      >
        <CarouselContent>
          {slides.map(({ id, image, title }, index) => (
            <CarouselItem key={id}>
              <div className='relative aspect-[2/1] w-full'>
                <img
                  src={image}
                  alt={title || `slide ${index + 1}`}
                  className='h-full w-full object-cover'
                />
                {title && (
                  <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-white'>
                    <h3 className='text-lg font-bold'>{title}</h3>
                  </div>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      {/* 指示点 */}
      <div className='absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10'>
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => api?.scrollTo(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              selectedIndex === i 
                ? "bg-white w-5 shadow-sm" 
                : "bg-white/50 w-1.5 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default SlideShow
