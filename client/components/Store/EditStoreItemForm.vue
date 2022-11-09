<!-- Form for creating freets (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'EditStoreItemForm',
  mixins: [BlockForm],
  data() {
    return {
      url: `/api/store/${this.$store.state.editedStoreItem}`,
      method: 'PUT',
      hasBody: true,
      fields: [
        {id: 'content', label: 'Content', value: ''},
        {id: 'type', label: 'Type', value: ''}
      ],
      title: 'Edit store item',
      callback: () => {
        const message = 'Successfully edited your store item!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
        console.log(this.$store);
      }
    };
  }
};
</script>
