import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/login',    
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/user/login.vue'),
    meta: { title: '登录', icon: 'user', requiresAuth: false },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/user/register.vue'),
    meta: { title: '注册', requiresAuth: false },
  },
  {
    path: '/main',
    name: 'Main',
    component: () => import('@/layouts/MainLayout.vue'),
    redirect: '/main/dashboard', // 默认重定向到仪表盘
    children: [ 
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '仪表盘', icon: 'Odometer', requiresAuth: true },
      },  
  
      {
        path: 'product/list',
        name: 'ProductList',
        component: () => import('@/views/product/index.vue'),
        meta: { title: '商品列表', icon: 'Goods', requiresAuth: true }
      },
      {
        path: 'product/category',
        name: 'ProductCategory',
        component: () => import('@/views/product/category.vue'),
        meta: { title: '商品分类', icon: 'Collection', requiresAuth: true  }
      },
      {
        path: 'order',
        name: 'Order',
        redirect: '/main/order/list',
        meta: { title: '订单管理', icon: 'List', requiresAuth: true },
        children: [
          {
            path: 'list',
            name: 'OrderList',
            component: () => import('@/views/order/index.vue'),
            meta: { title: '订单列表', requiresAuth: true }
          },
          {
            path: 'after-sale',
            name: 'OrderAfterSale',
            component: () => import('@/views/order/after-sale.vue'),
            meta: { title: '售后处理', requiresAuth: true }
          }
        ]
      },
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/user/index.vue'),
        meta: { title: '用户管理', icon: 'User' , requiresAuth: true }
      },
      {
        path: 'user/baby',
        name: 'BabyStatistics',
        component: () => import('@/views/user/BabyStatistics.vue'),
        meta: { title: '宝宝情况统计', icon: 'User' , requiresAuth: true }
      },
      {
        path: 'cart',          
        name: 'Cart',
        component: () => import('@/views/cart/index.vue'),
        meta: { title: '购物车', requiresAuth: true }
      }
    ]
  }
]


const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫 - 每次跳转前检查
// router.beforeEach((to, from, next) => {  
//   const isLoggedIn = !!sessionStorage.getItem('user')
  
//   // 白名单：不需要登录就能访问的页面
//   const whiteList = ['/login']
  
//   if (whiteList.includes(to.path)) {
//     // 如果是白名单页面，直接放行
//     next()
//   } else if (!isLoggedIn) {
//     // 如果不是白名单页面且未登录，跳转到登录页
//     next('/login')
//   } else {
//     // 已登录，正常访问
//     next()
//   }
// })
router.beforeEach((to, from) => {
  const isLoggedIn = !!sessionStorage.getItem('user')
  // 如果页面不需要登录，直接放行
  if (!to.meta.requiresAuth) {    
    return true
  }  
  // 如果需要登录但未登录
  if (!isLoggedIn) {    
    return '/login' 
  }  
  // 其他情况放行
  return true
})

export default router