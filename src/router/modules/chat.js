/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const chatRouter = {
  path: '/chat',
  component: Layout,
  redirect: 'noredirect',
  name: 'Chat',
  meta: {
    title: 'chat',
    icon: 'chart'
  },
  children: [
    {
      path: 'chatIndex',
      component: () => import('@/views/chat/index'),
      name: 'ChatIndex',
      meta: { title: 'Chat', noCache: true }
    }
  ]
}

export default chatRouter
