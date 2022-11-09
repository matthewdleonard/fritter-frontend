<!-- Form for creating freets (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'CreateLockForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/lock',
      method: 'POST',
      hasBody: true,
      fields: [
        {id: 'type', label: 'Type', value: ''},
      ],
      title: 'Create a lock',
      refreshFreets: true,
      callback: () => {
        const lock = 'Successfully created a lock!';
        this.$set(this.alerts, lock, 'success');
        setTimeout(() => this.$delete(this.alerts, lock), 3000);
        this.$store.commit('refreshLocks');
      }
    };
  }
};
</script>
