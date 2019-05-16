import Router from 'vue-router'
import SpendTx from './views/spendTx.vue'

const routes = [
  {
    path: '/',
    name: 'spendtx',
    component: SpendTx,
    meta: { title: `Spend TX` },
  },
]

const router = new Router({ mode: 'history', routes: routes })

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} - Æternity Demo`
  next()
})

export default router
