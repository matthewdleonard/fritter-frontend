<!-- Form for creating freets (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'CreateStoreItemForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/store',
      method: 'POST',
      hasBody: true,
      fields: [
        {id: 'content', label: 'Content', value: ''},
        {id: 'type', label: 'Type', value: ''}
      ],
      title: 'Create store item',
      callback: () => {
        const message = 'Successfully created a store item!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
