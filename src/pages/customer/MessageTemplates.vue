<template>
  <q-page padding>
    <div class="q-mb-xl">
      <h1 class="text-h4 text-weight-bold q-my-none">Automated eBay Messages</h1>
      <p class="text-body2 text-grey-6 q-mt-xs">Manage your message templates for automated eBay communications.</p>
    </div>

    <q-card flat>
      <q-table
        :rows="templates"
        :columns="columns"
        row-key="id"
        :loading="loading"
        :filter="filter"
        flat
        class="admin-table"
      >
        <template v-slot:top>
          <div class="row full-width items-center justify-between q-gutter-y-md">
            <div class="text-h6 text-weight-medium">All Templates</div>

            <q-btn
              color="primary"
              icon="las la-plus"
              label="Create Template"
              unelevated
              @click="openDialog()"
            />
          </div>
        </template>

        <template v-slot:body-cell-trigger_status="props">
          <q-td :props="props">
            <q-badge color="primary">
              {{ props.row.trigger_status }}
            </q-badge>
          </q-td>
        </template>

        <template v-slot:body-cell-is_active="props">
          <q-td :props="props">
            <q-toggle
              v-model="props.row.is_active"
              color="green"
              @update:model-value="toggleActive(props.row)"
            />
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-xs">
            <q-btn flat round dense color="secondary" icon="las la-pen" @click="openDialog(props.row)">
              <q-tooltip>Edit</q-tooltip>
            </q-btn>
            <q-btn flat round dense color="negative" icon="las la-trash-alt" @click="deleteTemplate(props.row.id)">
              <q-tooltip>Delete</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Message Template Dialog -->
    <q-dialog v-model="dialogOpen" persistent>
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">Message Template</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="saveTemplate" class="q-gutter-md">
            <q-input
              filled
              v-model="editForm.name"
              label="Template Name (Internal) *"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Template name is required']"
            />

            <q-select
              filled
              v-model="editForm.trigger_status"
              :options="['ordered', 'shipped', 'delivered', 'cancelled', 'returned']"
              label="Trigger Status *"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Trigger status is required']"
            />

            <q-input
              filled
              v-model="editForm.subject"
              label="eBay Message Subject *"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Subject is required']"
            />

            <q-input
              filled
              v-model="editForm.body"
              label="Message Body *"
              type="textarea"
              rows="6"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Message body is required']"
            />

            <div class="text-caption text-grey-6 q-mt-sm">
              You can use the following variables in your subject and body:
              <code>{{buyer_name}}</code>, <code>{{order_id}}</code>, <code>{{tracking_id}}</code>, <code>{{carrier}}</code>.
            </div>

            <q-card-actions align="right" class="text-primary">
              <q-btn flat label="Cancel" v-close-popup />
              <q-btn label="Save Template" type="submit" color="primary" />
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
export default {
  name: 'MessageTemplatesPage',
  data() {
    return {
      templates: [],
      loading: false,
      filter: '',
      columns: [
        { name: 'name', label: 'Name', align: 'left', field: 'name', sortable: true },
        { name: 'trigger_status', label: 'Trigger Status', align: 'left', field: 'trigger_status', sortable: true },
        { name: 'subject', label: 'Subject', align: 'left', field: 'subject', sortable: true },
        { name: 'is_active', label: 'Active', align: 'center', field: 'is_active', sortable: true },
        { name: 'actions', label: 'Actions', align: 'right', field: 'actions' }
      ],
      dialogOpen: false,
      editForm: {
        id: null,
        trigger_status: null,
        name: '',
        subject: '',
        body: '',
        is_active: true
      },
      defaultForm: {
        id: null,
        trigger_status: null,
        name: '',
        subject: '',
        body: '',
        is_active: true
      },
      triggerStatusOptions: ['ordered', 'shipped', 'delivered', 'cancelled', 'returned']
    };
  },
  mounted() {
    this.fetchTemplates();
  },
  methods: {
    async fetchTemplates() {
      this.loading = true;
      try {
        const response = await this.$api.get('/message-templates');
        this.templates = response.data;
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: error.response?.data?.message || 'Failed to fetch message templates.',
          icon: 'las la-exclamation-triangle',
          position: 'top-right'
        });
        console.error('Error fetching templates:', error);
      } finally {
        this.loading = false;
      }
    },
    openDialog(template = null) {
      this.editForm = template ? { ...template } : { ...this.defaultForm };
      this.dialogOpen = true;
    },
    async saveTemplate() {
      this.loading = true;
      try {
        if (this.editForm.id) {
          await this.$api.put(`/message-templates/${this.editForm.id}`, this.editForm);
          this.$q.notify({
            type: 'positive',
            message: 'Template updated successfully.',
            icon: 'las la-check-circle',
            position: 'top-right'
          });
        } else {
          await this.$api.post('/message-templates', this.editForm);
          this.$q.notify({
            type: 'positive',
            message: 'Template created successfully.',
            icon: 'las la-check-circle',
            position: 'top-right'
          });
        }
        this.dialogOpen = false;
        await this.fetchTemplates(); // Refresh list
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: error.response?.data?.message || 'Failed to save template.',
          icon: 'las la-exclamation-triangle',
          position: 'top-right'
        });
        console.error('Error saving template:', error);
      } finally {
        this.loading = false;
      }
    },
    async toggleActive(template) {
      try {
        await this.$api.put(`/message-templates/${template.id}`, { is_active: template.is_active });
        this.$q.notify({
          type: 'positive',
          message: `Template ${template.is_active ? 'activated' : 'deactivated'} successfully.`,
          icon: 'las la-check-circle',
          position: 'top-right'
        });
      } catch (error) {
        // Revert toggle state on error
        template.is_active = !template.is_active;
        this.$q.notify({
          type: 'negative',
          message: error.response?.data?.message || 'Failed to update template status.',
          icon: 'las la-exclamation-triangle',
          position: 'top-right'
        });
        console.error('Error toggling template status:', error);
      }
    },
    deleteTemplate(id) {
      this.$q.dialog({
        title: 'Confirm Deletion',
        message: 'Are you sure you want to delete this message template? This cannot be undone.',
        cancel: true,
        persistent: true
      }).onOk(async () => {
        this.loading = true;
        try {
          await this.$api.delete(`/message-templates/${id}`);
          this.$q.notify({
            type: 'positive',
            message: 'Template deleted successfully.',
            icon: 'las la-check-circle',
            position: 'top-right'
          });
          await this.fetchTemplates(); // Refresh list
        } catch (error) {
          this.$q.notify({
            type: 'negative',
            message: error.response?.data?.message || 'Failed to delete template.',
            icon: 'las la-exclamation-triangle',
            position: 'top-right'
          });
          console.error('Error deleting template:', error);
        } finally {
          this.loading = false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.admin-table {
  /* Enforce flat table header styling */
  :deep(.q-table__top) {
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }

  body.body--dark & :deep(.q-table__top) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  /* Make header typography clean and readable */
  :deep(th) {
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.75rem;
    color: $grey-6;
  }
}
</style>
