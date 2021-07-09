import { createApp } from 'vue'
import Message from '@/components/Message.vue'
export type MessageType = 'success' | 'error' | 'default' // 定义消息的类型
const createMessage = (message: string, type: MessageType, timeout = 2000): void => {
  const messageInstance = createApp(Message, {
    message,
    type
  })
  const mountNode = document.createElement('div')
  document.body.appendChild(mountNode)
  messageInstance.mount(mountNode)
  setTimeout(() => {
    messageInstance.unmount()
    document.body.removeChild(mountNode)
  }, timeout)
}
export default createMessage
// 自定义生成全局提示框组件的函数
