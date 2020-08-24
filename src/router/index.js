import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
/* Layout */
import Layout from '@/layout'
export const constantRoutes = [{
    path: '/login',
    component: () =>
        import('@/views/login/index'),
    hidden: true
},
{
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
        path: 'dashboard',
        name: 'Dashboard',
        component: () =>
            import('@/views/dashboard/index'),
        meta: { title: '首页', icon: 'dashboard' }
    }]
}
]

export const asyncRoutes = [

    {
        path: '/permission',
        component: Layout,
        redirect: '/permission/roleList',
        name: '权限设置',
        id: 1,
        meta: {
            title: '权限设置',
            icon: 'lock',
            role: []
        },
        children: [{
            path: 'roleList',
            name: '角色管理',
            id: 2,
            parentId: 1,
            component: () =>
                import('@/views/permission/roleList/index'),
            meta: { title: '角色管理', role: [] }
        },
        {
            path: 'adminList',
            name: '管理员列表',
            id: 3,
            parentId: 1,
            component: () =>
                import('@/views/permission/adminList/index'),
            meta: { title: '管理员列表', role: [] }
        },

        {
            path: 'permissionResource',
            name: '权限资源列表',
            id: 4,
            parentId: 1,
            component: () =>
                import('@/views/permission/permissionResource/index'),
            meta: { title: '权限资源列表', role: [] }
        },
        {
            path: 'rightsGroup',
            name: '权限分组列表',
            id: 5,
            parentId: 1,
            component: () =>
                import('@/views/permission/rightsGroup/index'),
            meta: { title: '权限分组列表', role: [] }
        }
        ]
    },
    {
        path: '/currency',
        component: Layout,
        redirect: '/currency/settingCurrency',
        name: '币种',
        id: 10,
        meta: {
            title: '币种设置',
            icon: 'currency',
            role: []
        },
        children: [{
            path: 'settingCurrency',
            name: '币种设置',
            id: 11,
            parentId: 10,
            component: () =>
                import('@/views/currency/settingCurrency/index'),
            meta: { title: '币种设置', role: [] }
        },

        ]
    },
    {
        path: '/deal',
        component: Layout,
        redirect: '/deal/bazaar/bazaarList',
        name: '交易',
        id: 20,
        meta: {
            title: '交易',
            icon: 'deal',
            role: []
        },
        children: [{
            path: 'bazaarList',
            name: '交易市场',
            id: 21,
            parentId: 20,
            component: () =>
                import('@/views/deal/bazaar/bazaarList/index'),
            meta: { title: '交易市场', role: [] }
        },
        {
            path: 'variety',
            name: '品种列表',
            id: 22,
            parentId: 20,
            component: () =>
                import('@/views/deal/variety/varietyList/index'),
            meta: { title: '品种列表', role: [] }
        },
        ]
    },
    {
        path: '/service',
        component: Layout,
        redirect: '/service/serviceList',
        name: '手续费',
        id: 30,
        meta: {
            title: '手续费',
            icon: 'service',
            role: []
        },
        children: [{
            path: 'serviceList',
            name: '手续费列表',
            id: 31,
            parentId: 30,
            component: () =>
                import('@/views/service/serviceList/index'),
            meta: { title: '手续费列表', role: [] }
        },

        ]
    },
    {
        path: '/position',
        component: Layout,
        redirect: '/position/positionList',
        name: '持仓限额',
        id: 40,
        meta: {
            title: '持仓限额',
            icon: 'position',
            role: []
        },
        children: [{
            path: 'positionList',
            name: '持仓限额列表',
            id: 41,
            parentId: 40,
            component: () =>
                import('@/views/position/positionList/index'),
            meta: { title: '持仓限额列表', role: [] }
        },

        ]
    },
    {
        path: '/timing',
        component: Layout,
        redirect: '/timing/timingList',
        name: '定时强平',
        id: 50,
        meta: {
            title: '定时强平',
            icon: 'timing',
            role: []
        },
        children: [{
            path: 'timingList',
            name: '定时强平列表',
            id: 51,
            parentId: 50,
            component: () =>
                import('@/views/timing/timingList/index'),
            meta: { title: '定时强平列表', role: [] }
        },

        ]
    },
    {
        path: '/deposit',
        component: Layout,
        redirect: '/deposit/depositList',
        name: '保证金',
        id: 60,
        meta: {
            title: '保证金',
            icon: 'deposit',
            role: []
        },
        children: [{
            path: 'depositList',
            name: '保证金列表',
            id: 61,
            parentId: 60,
            component: () =>
                import('@/views/deposit/depositList/index'),
            meta: { title: '保证金列表', role: [] }
        },

        ]
    },
    {
        path: '/client',
        component: Layout,
        redirect: '/client/clientlist',
        name: '客户信息',
        id: 70,
        meta: {
            title: '客户信息',
            icon: 'client',
            role: []
        },
        children: [{
            path: 'clientlist',
            name: '客户列表',
            id: 71,
            parentId: 70,
            component: () =>
                import('@/views/client/clientlist/index'),
            meta: { title: '客户列表', role: [] }
        },
        {
            path: 'fundsManagement',
            name: '资金管理',
            id: 72,
            parentId: 70,
            component: () =>
                import('@/views/client/fundsManagement/index'),
            meta: { title: '资金管理', role: [] }
        },
        {
            path: 'fundsDetailList',
            name: '资金详情列表',
            id: 73,
            parentId: 70,
            component: () =>
                import('@/views/client/fundsDetailList/index'),
            meta: { title: '资金详情列表', role: [] }
        },

        ]
    },
    {
        path: '/riskMonitoring',
        component: Layout,
        redirect: '/riskMonitoring/fundAccount',
        name: '风险监控',
        id: 80,
        meta: {
            title: '风险监控',
            icon: 'riskMonitoring',
            role: []
        },
        children: [{
            path: 'fundAccount',
            name: '资金账号',
            id: 81,
            parentId: 80,
            component: () =>
                import('@/views/riskMonitoring/fundAccount/index'),
            meta: { title: '资金账号', role: [] },
            children: [{
                path: 'highRisk',
                id: 811,
                name: '高风险区',
                parentId: 81,
                component: () =>
                    import('@/views/riskMonitoring/fundAccount/highRisk/index'),
                meta: { title: '高风险区', role: [] }
            },
            {
                path: 'middleRisk',
                id: 812,
                name: '中风险区',
                parentId: 81,
                component: () =>
                    import('@/views/riskMonitoring/fundAccount/middleRisk/index'),
                meta: { title: '中风险区', role: [] }
            },
            {
                path: 'lowRisk',
                id: 813,
                name: '低风险区',
                parentId: 81,
                component: () =>
                    import('@/views/riskMonitoring/fundAccount/lowRisk/index'),
                meta: { title: '低风险区', role: [] }
            },
            {
                path: 'freedom',
                id: 814,
                name: '自有区',
                parentId: 81,
                component: () =>
                    import('@/views/riskMonitoring/fundAccount/freedom/index'),
                meta: { title: '自有区', role: [] }
            }
            ]
        }, {
            path: 'position',
            name: '持仓查询',
            id: 82,
            parentId: 80,
            component: () =>
                import('@/views/riskMonitoring/position/index'),
            meta: { title: '持仓查询', role: [] },
            children: [{
                path: 'detail',
                id: 821,
                name: '持仓明细',
                parentId: 82,
                component: () =>
                    import('@/views/riskMonitoring/position/detail/index'),
                meta: { title: '持仓明细', role: [] }
            },
            {
                path: 'summary',
                id: 822,
                name: '持仓汇总',
                parentId: 82,
                component: () =>
                    import('@/views/riskMonitoring/position/summary/index'),
                meta: { title: '持仓汇总', role: [] }
            },
            {
                path: 'summarize',
                id: 823,
                name: '持仓总结',
                parentId: 82,
                component: () =>
                    import('@/views/riskMonitoring/position/summarize/index'),
                meta: { title: '持仓总结', role: [] }
            },
            ]
        }, {
            path: 'makeBargain',
            name: '平仓查询',
            id: 83,
            parentId: 80,
            component: () =>
                import('@/views/riskMonitoring/makeBargain/index'),
            meta: { title: '平仓查询', role: [] },
            children: [{
                path: 'detail',
                id: 831,
                name: '平仓明细',
                parentId: 83,
                component: () =>
                    import('@/views/riskMonitoring/makeBargain/detail/index'),
                meta: { title: '平仓明细', role: [] }
            },
            {
                path: 'summary',
                id: 832,
                name: '平仓总结',
                parentId: 83,
                component: () =>
                    import('@/views/riskMonitoring/makeBargain/summary/index'),
                meta: { title: '平仓总结', role: [] }
            },
            ]
        },
        {
            path: 'hang',
            name: '挂单查询',
            id: 84,
            parentId: 80,
            component: () =>
                import('@/views/riskMonitoring/hang/index'),
            meta: { title: '挂单查询', role: [] },
        }]
    },
    {
        path: '/log',
        component: Layout,
        redirect: '/log',
        name: '操作日志',
        id: 120,
        meta: { title: '操作日志', icon: 'log', role: [] },
        children: [{
            path: 'universal',
            name: '操作日志',
            id: 121,
            parentId: 120,
            component: () =>
                import('@/views/log/index'),
            meta: { title: '操作日志', role: [] }
        }]
    },
    {
        path: '/universal',
        component: Layout,
        redirect: '/universal',
        name: '通用设置',
        id: 90,
        meta: { title: '系统设置', icon: 'universal', role: [] },
        children: [{
            path: 'universal',
            name: '通用设置',
            id: 91,
            parentId: 90,
            component: () =>
                import('@/views/universal/index'),
            meta: { title: '通用设置', role: [] }
        }]
    },
    {
        path: '/personal',
        component: Layout,
        redirect: '/personal',
        name: '个人中心',
        id: 100,
        meta: { title: '', icon: 'personal', role: [] },
        children: [{
            path: 'personal',
            name: '个人中心',
            id: 101,
            parentId: 100,
            component: () =>
                import('@/views/personal/index'),
            meta: { title: '个人中心', role: [] }
        }]
    },
    {
        path: '/setting',
        component: Layout,
        redirect: '/setting',
        name: '系统设置',
        id: 110,
        meta: { title: '', icon: 'setting', role: [] },
        children: [{
            path: 'setting',
            name: '系统设置',
            id: 111,
            parentId: 110,
            component: () =>
                import('@/views/setting/index'),
            meta: { title: '系统设置', role: [] }
        }]
    },

    {
        path: '*',
        name: '404',
        component: () =>
            import('@/views/404'),
        hidden: true
    }
]

const createRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}
export default router