import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const auth = {
    namespaced: true,
    state: {
        token: localStorage.getItem('token') || '',
        userRole: '',
    },
    mutations: {
        SET_TOKEN(state, token) {
            state.token = token;
            localStorage.setItem('token', token);
        },
        LOGOUT(state) {
            state.token = '';
            localStorage.removeItem('token');
        },
    }
}
const pan = {
    namespaced: true,
    state: {
        loadingStates: {
            fileList: false,
            storage: false,
            refresh: false,
            delete: false,
            createFolder: false
        }
    },
    actions: {
        async withLoading({ commit }, { type, fn }) {
            commit('SET_LOADING', { type, value: true });
            try {
                return await fn();
            } finally {
                commit('SET_LOADING', { type, value: false });
            }
        },
    },
    mutations: {
        SET_LOADING(state, { type, value }) {
            state.loadingStates[type] = value;
        },
    }
}
export default new Vuex.Store({
    modules: { auth, pan }
});
