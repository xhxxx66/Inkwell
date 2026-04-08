import { useRef, useEffect } from 'react'
import { Send, Bot, User, Trash2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { useChatBot } from '@/hooks/useChatBot'

const Ai = () => {
  const {
    messages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading,
    clearMessages,
  } = useChatBot('/api/ai/chat')

  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const quickQuestions = [
    '推荐几本好看的玄幻小说',
    '有什么经典的悬疑推理小说',
    '适合睡前阅读的轻松小说',
    '最近有什么热门新书',
  ]

  const handleQuickQuestion = (question: string) => {
    setInput(question)
    textareaRef.current?.focus()
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] min-h-0 bg-gray-50">
      {/* 头部 */}
      <div className="flex-shrink-0 bg-white px-4 py-3 border-b flex items-center justify-between">
        <div className="flex gap-2 items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-base">墨墨</h1>
            <p className="text-xs text-gray-500">AI 阅读助手</p>
          </div>
        </div>
        {messages.length > 0 && (
          <Button variant="ghost" size="icon" onClick={clearMessages}>
            <Trash2 className="w-5 h-5 text-gray-500" />
          </Button>
        )}
      </div>

      {/* 消息区域 */}
      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-lg font-semibold mb-2">你好，我是墨墨 👋</h2>
            <p className="text-gray-500 text-sm text-center mb-6">
              我是你的 AI 阅读助手，可以帮你推荐书籍、解答问题
            </p>
            <div className="w-full max-w-sm space-y-2">
              <p className="text-xs text-gray-400 text-center mb-2">试试问我：</p>
              {quickQuestions.map((q, i) => (
                <Button
                  key={i}
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-2 px-3 text-sm"
                  onClick={() => handleQuickQuestion(q)}
                >
                  {q}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex gap-3',
                  message.role === 'user' ? 'flex-row-reverse' : ''
                )}
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                    message.role === 'user'
                      ? 'bg-blue-500'
                      : 'bg-gradient-to-br from-purple-500 to-pink-500'
                  )}
                >
                  {message.role === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>

                <div
                  className={cn(
                    'max-w-[75%] rounded-2xl px-4 py-2.5',
                    message.role === 'user'
                      ? 'bg-blue-500 text-white rounded-tr-sm'
                      : 'bg-white shadow-sm rounded-tl-sm'
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {message.content ||
                      (message.role === 'assistant' && isLoading
                        ? '思考中...'
                        : '')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 输入区域 */}
      <form
        onSubmit={handleSubmit}
        className="flex-shrink-0 bg-white border-t p-3"
      >
        <div className="flex gap-2 items-end">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="输入消息..."
            className="min-h-[44px] max-h-[120px] resize-none"
            rows={1}
          />
          <Button
            type="submit"
            size="icon"
            className="h-11 w-11 flex-shrink-0"
            disabled={!input.trim() || isLoading}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-xs text-gray-400 text-center mt-2">
          AI 生成内容仅供参考
        </p>
      </form>
    </div>
  )
}

export default Ai
