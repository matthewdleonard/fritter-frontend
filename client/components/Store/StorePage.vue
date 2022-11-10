<!-- Default page that also displays messages -->

<template>
  <main>
    <section>
      <header>
        <div class="left">
          <h2>
            Fritter Store
            <span v-if="$store.state.filter">
              by @{{ $store.state.filter }}
            </span>
          </h2>
        </div>
        <div class="right">
          
        </div>
        
      </header>

          <GetStoreForm
            ref="getStoreForm"
            value="author"
            placeholder="🔍 Filter by author (optional)"
            button="🔄 Get store items"
          />
      <section
        v-if="$store.state.storeItems.length"
      >
        <StoreItemComponent
          v-for="storeItem in $store.state.storeItems"
          :key="storeItem.id"
          :storeItem="storeItem"
        />
      </section>
      <article
        v-else
      >
        <h3>No store items found.</h3>
      </article>
    </section>

    <section v-if="$store.state.username">
      <header>

          <router-link to="/createstoreitem">
        <h2>Create a new store item as @{{ $store.state.username }}</h2>

          </router-link>
      </header>
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
import StoreItemComponent from '@/components/Store/StoreItemComponent.vue';
import CreateStoreItemForm from '@/components/Store/CreateStoreItemForm.vue';
import GetStoreForm from '@/components/Store/GetStoreForm.vue';

export default {
  name: 'StorePage',
  components: {StoreItemComponent, GetStoreForm, CreateStoreItemForm},
  mounted() {
    this.$refs.getStoreForm.submit();
    this.$store.commit('updateEditedStoreItem', null);
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
