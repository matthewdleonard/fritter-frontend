<!-- Form for creating freets (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'CreateMessageForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/messages',
      method: 'POST',
      hasBody: true,
      fields: [
        {id: 'content', label: 'Content', value: ''},
        {id: 'recipient', label: 'Recipient', value: ''}
      ],
      title: 'Create a message',
      refreshFreets: true,
      callback: () => {
        const message = 'Successfully created a message!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
