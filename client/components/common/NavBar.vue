<!-- A basic navigation bar component -->
<!-- Example of a component which is included on all pages (via App.vue) -->
<!-- This navbar takes advantage of both flex and grid layouts for positioning elements; feel free to redesign as you see fit! -->

<template>
  <nav>
    <div class="left">
      <img src="../../public/logo.svg">
      <h1 class="title">
        Fritter
      </h1>
    </div>
    <div class="right">
      <router-link to="/">
        Home
      </router-link>
      <router-link class = "navbar.link"
        v-if="$store.state.username"
        to="/account"
      >
        Account
      </router-link>
      <router-link class = "navbar.link"
        v-else
        to="/login"
      >
        Login
      </router-link>
      <router-link class = "navbar.link"
        v-if="$store.state.username"
        to="/messages"
      >
      Messages
      </router-link>
      <router-link class = "navbar.link"
        v-if="$store.state.username"
        to="/store"
      >
      Store
      </router-link>
      <router-link class = "navbar.link"
        v-if="$store.state.username"
        to="/lock"
      >
      Lock
      </router-link>
    </div>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in $store.state.alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </nav>
</template>


<script>

export default {
  name: 'NavBar',
  components: {},
  methods: {
    timerCallback() {
      setTimeout(() => this.timerCallback(), 15000);

      if (this.$store.state.username) {
        for (let i in this.$store.state.locks) {
          let lock = this.$store.state.locks[i];
          
          this.$store.commit('lockPassTime', [i, 15]);
          this.$store.commit('checkIfLocked');

        }
      }
    },
  },
  mounted() {
    this.$store.commit('refreshLocks');
    setTimeout(() => this.timerCallback(), 15000);
  }
};
</script>

<style scoped>
nav {
    padding: 1vw 2vw;
    background-color: #ECF87F;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
}

.title {
    font-size: 32px;
    margin: 0 5px;
}

img {
    height: 32px;
}

.left {
	display: flex;
	align-items: center;
}

.right {
    font-size: 20px;
    display: grid;
    gap: 16px;
    grid-auto-flow: column;
    align-items: center;
}

.right a {
    margin-left: 5px;
    text-decoration: none;
    color: black;
}

.alerts {
    width: 25%;
}
</style>
