const MainRoutes = {
    path: '/main',
    meta: {
        requiresAuth: false
    },
    //redirect: '/main',
    component: () => import('@/layouts/full/FullLayout.vue'),
    children: [
        {
            name: 'Dashboard',
            path: '/',
            redirect: '/ui/c24',
            //component: () => import('@/views/components/Qualtrics.vue'),
            meta: {
                requiresAuth: true
            }
        },
        {
            name: 'Qualtrics',
            path: '/ui/qualtrics',
            component: () => import('@/views/components/Qualtrics.vue'),
            meta: {
                requiresAuth: true
            }
        },
        {
            name: 'c24',
            path: '/ui/c24',
            component: () => import('@/views/components/C24.vue'),
            meta: {
                requiresAuth: true
            }
        },
        {
            name: 'Typography',
            path: '/ui/typography',
            component: () => import('@/views/components/Typography.vue')
        },
        {
            name: 'QualtricsSurvey',
            path: '/ui/qualitricssurvey',
            component: () => import('@/views/components/QualtricsSurvey.vue')
        },
        {
            name: 'Shadow',
            path: '/ui/shadow',
            component: () => import('@/views/components/Shadow.vue')
        },
        {
            name: 'Icons',
            path: '/icons',
            component: () => import('@/views/pages/Icons.vue')
        },
        {
            name: 'UserManagement',
            path: '/user',
            component: () => import('@/views/admin/UserManagement.vue')
        },
    ]
};

export default MainRoutes;
