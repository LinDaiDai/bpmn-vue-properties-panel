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
    },
    {
        path: '/bpmn-js-in-color',
        component: () =>
            import ('./../components/bpmn-js-in-color')
    }
]

export default new Router({
    mode: 'history',
    routes
})