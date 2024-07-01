import { createRouter, createWebHashHistory } from 'vue-router';
import MainRoutes from './MainRoutes';
import AuthRoutes from './AuthRoutes';
// import { useAuthStore } from '../stores/index';
// import { useIsAuthenticated } from '../msal/useIsAuthenticated';
import { registerGuard } from "./Guard";

export const router = createRouter({
    //history: createWebHistory(import.meta.env.BASE_URL),
    history: createWebHashHistory(),
    routes: [
        {
            path: '/:pathMatch(.*)*',
            component: () => import('@/views/pages/Error404.vue')
        },
        MainRoutes,
        AuthRoutes
    ]
});

registerGuard(router);

// router.beforeEach(async (to) => {
//     // redirect to login page if not logged in and trying to access a restricted page
//     //console.log("====to:", to)
//     const publicPages = ['/auth/login'];
//     const authRequired = !publicPages.includes(to.path);
//     const auth = useAuthStore();
//     //const isAuthenticated = useIsAuthenticated();
//     //console.log("===isAuthenticated:", isAuthenticated)

//     if (authRequired && !auth.user) {
//     //if (authRequired && !isAuthenticated) {
//         auth.returnUrl = to.fullPath;
//         return '/auth/login';
//     }
// })
