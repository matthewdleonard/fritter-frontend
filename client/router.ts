import Vue from 'vue';
import VueRouter from 'vue-router';
import FreetsPage from './components/Freet/FreetsPage.vue';
import AccountPage from './components/Account/AccountPage.vue';
import LoginPage from './components/Login/LoginPage.vue';
import MessagesPage from './components/Messages/MessagesPage.vue';
import StorePage from './components/Store/StorePage.vue';
import StoreCreationPage from './components/Store/StoreCreationPage.vue';
import LockPage from './components/Lock/LockPage.vue';
import NotFound from './NotFound.vue';

Vue.use(VueRouter);

const routes = [
  {path: '/', name: 'Home', component: FreetsPage},
  {path: '/account', name: 'Account', component: AccountPage},
  {path: '/login', name: 'Login', component: LoginPage},
  {path: '/messages', name: 'Messages', component: MessagesPage},
  {path: '/store', name: 'Store', component: StorePage},
  {path: '/lock', name: 'Lock', component: LockPage},
  {path: '/createstoreitem', name: 'Store Creation', component: StoreCreationPage},
  {path: '*', name: 'Not Found', component: NotFound}
];

const router = new VueRouter({routes});

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from, next) => {
  if (router.app.$store) {
    if (to.name === 'Login' && router.app.$store.state.username) {
      next({name: 'Account'}); // Go to Account page if user navigates to Login and are signed in
      return;
    }

    if (to.name === 'Account' && !router.app.$store.state.username) {
      next({name: 'Login'}); // Go to Login page if user navigates to Account and are not signed in
      return;
    }
    //If this is a place where the user should be locked out of on 
    if (to.name === 'Home' ||to.name === 'Store' || to.name === 'Store Creation' ||to.name === 'Messages' ) {
      router.app.$store.commit('checkIfLocked');
      if (router.app.$store.state.locked) {
        next({name: 'Lock'});
      }
    }
  }

  next();
});

export default router;
