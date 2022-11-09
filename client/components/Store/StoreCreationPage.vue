<!-- Default page that also displays messages -->

<template>
  <main>
    <section v-if="$store.state.username">
      <header>
        <div class="left">

          <h2>
            <span v-if="$store.state.editedStoreItem">
              Edit Store Item
            </span>

            <span v-else>
              Create Store Item
            </span>
          </h2>

          
        </div>
        <div class="right">
          
        </div>
        
      </header>
          <EditStoreItemForm v-if="$store.state.editedStoreItem"/>
          <CreateStoreItemForm v-else/>
    </section>
    <section v-else>
      <header>
        <h2>Welcome to Fritter!</h2>
      </header>
      <article>
        <h3>
          <router-link to="/login">
            Sign in
          </router-link>
          to create store items.
        </h3>
      </article>
    </section>
  </main>
</template>

<script>
import CreateStoreItemForm from '@/components/Store/CreateStoreItemForm.vue';
import EditStoreItemForm from '@/components/Store/EditStoreItemForm.vue';

export default {
  name: 'StoreCreationPage',
  components: {CreateStoreItemForm, EditStoreItemForm},
  mounted() {
    
  }
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
}

header, header > * {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

button {
    margin-right: 10px;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}
</style>
