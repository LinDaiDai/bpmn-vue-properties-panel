import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const routes = [{
        path: '/',
        redirect: '/properties-panel-extension'
    },
    {
        path: '/properties-panel-extension',
        component: () =>
            import ('./../components/properties-panel-extension')
    },
    {
        path: '/custom-properties-panel',
        component: () =>
            import ('./../components/custom-properties-panel')
    }
]

export default new Router({
    mode: 'history',
    routes
})