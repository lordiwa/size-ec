import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: () => import('@/views/HomeView.vue') },
  { path: '/servicios', name: 'servicios', component: () => import('@/views/ServiciosView.vue') },
  { path: '/quienes-somos', name: 'quienes-somos', component: () => import('@/views/QuienesSomosView.vue') },
  { path: '/clientes/:slug', name: 'cliente', component: () => import('@/views/ClienteView.vue'), props: true },
  { path: '/contacto', name: 'contacto', component: () => import('@/views/ContactoView.vue') },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/NotFoundView.vue') }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})
