import { useState, useCallback } from 'react'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const generateId = () => Math.random().toString(36).substring(2, 9)

export const useChatBot = (api = '/api/ai/chat') => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setInput(e.target.value)
    },
    []
  )

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault()
      const trimmedInput = input.trim()
      if (!trimmedInput || isLoading) return

      const userMessage: ChatMessage = {
        id: generateId(),
        role: 'user',
        content: trimmedInput,
      }

      const assistantId = generateId()
      const assistantMessage: ChatMessage = {
        id: assistantId,
        role: 'assistant',
        content: '',
      }

      setMessages(prev => [...prev, userMessage, assistantMessage])
      setInput('')
      setIsLoading(true)

      try {
        const chatMessages = [
          ...messages.map(m => ({ role: m.role, content: m.content })),
          { role: 'user' as const, content: trimmedInput },
        ]

        const response = await fetch(api, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: chatMessages }),
        })

        if (!response.ok) throw new Error('请求失败')

        const reader = response.body?.getReader()
        if (!reader) throw new Error('无法读取响应')

        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (!line.trim()) continue
            if (line.startsWith('0:')) {
              try {
                const json = JSON.parse(line.slice(2))
                if (json.token) {
                  setMessages(prev =>
                    prev.map(m =>
                      m.id === assistantId
                        ? { ...m, content: m.content + json.token }
                        : m
                    )
                  )
                }
              } catch {
                // 忽略解析错误
              }
            }
          }
        }
      } catch {
        setMessages(prev =>
          prev.map(m =>
            m.id === assistantId
              ? { ...m, content: '❌ 请求失败，请稍后重试' }
              : m
          )
        )
      } finally {
        setIsLoading(false)
      }
    },
    [input, isLoading, messages, api]
  )

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  const setInputValue = useCallback((value: string) => {
    setInput(value)
  }, [])

  return {
    messages,
    input,
    setInput: setInputValue,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
    clearMessages,
  }
}
