<template>
  <q-page padding>
    <div class="q-mb-xl">
      <h1 class="text-h4 text-weight-bold q-my-none">Supplier Accounts</h1>
      <p class="text-body2 text-grey-6 q-mt-xs">Manage your connected supplier accounts for automated ordering and track MFA OTP codes.</p>
    </div>

    <q-card flat class="table-card">
      <q-table
        :rows="suppliers"
        :columns="columns"
        row-key="id"
        :loading="loading"
        :filter="filter"
        flat
        class="admin-table"
      >
        <template v-slot:top>
          <div class="row full-width items-center justify-between q-gutter-y-md">
            <div class="text-h6 text-weight-medium">All Supplier Accounts</div>

            <div class="row items-center q-gutter-sm">
              <q-input
                v-model="filter"
                placeholder="Search..."
                dense
                outlined
                class="bg-white"
              >
                <template v-slot:append>
                  <q-icon name="las la-search" />
                </template>
              </q-input>
              <q-btn
                color="primary"
                icon="las la-plus"
                label="Add Supplier"
                unelevated
                @click="openDialog()"
              />
            </div>
          </div>
        </template>

        <template v-slot:body-cell-platform="props">
          <q-td :props="props">
            <q-chip :color="getPlatformColor(props.row.platform)" text-color="white" dense class="text-weight-bold">
              {{ props.row.platform }}
            </q-chip>
          </q-td>
        </template>

        <template v-slot:body-cell-otp_code="props">
          <q-td :props="props">
            <div v-if="props.row.is_mfa_enabled" class="column items-center">
              <div class="text-h6 text-primary text-weight-bolder letter-spacing-lg">
                {{ getOTP(props.row.id) || '--- ---' }}
              </div>
              <q-linear-progress
                :value="getOTPRemaining(props.row.id) / 30"
                color="primary"
                size="4px"
                class="q-mt-xs rounded-borders"
                style="width: 60px"
              />
            </div>
            <div v-else class="text-grey-5 text-caption text-italic">MFA Disabled</div>
          </q-td>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-chip
              :color="getStatusColor(props.row.status)"
              text-color="white"
              dense
              size="sm"
              class="text-weight-bold"
            >
              {{ props.row.status }}
            </q-chip>
          </q-td>
        </template>

        <template v-slot:body-cell-is_mfa_enabled="props">
          <q-td :props="props">
            <q-icon
              :name="props.row.is_mfa_enabled ? 'las la-check-circle' : 'las la-times-circle'"
              :color="props.row.is_mfa_enabled ? 'positive' : 'grey-4'"
              size="24px"
            />
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-xs">
            <q-btn outline round dense color="primary" icon="las la-pen" @click="openDialog(props.row)">
              <q-tooltip>Edit Account</q-tooltip>
            </q-btn>
            <q-btn outline round dense color="negative" icon="las la-trash-alt" @click="deleteSupplier(props.row.id)">
              <q-tooltip>Delete Account</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Supplier Dialog -->
    <q-dialog v-model="dialogOpen" persistent>
      <q-card style="width: 500px; max-width: 90vw; border-radius: 16px;">
        <q-card-section class="row items-center">
          <div class="text-h6 text-weight-bold">{{ form.id ? 'Edit' : 'Add' }} Supplier Account</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="saveSupplier" class="q-gutter-md">
            <q-input
              filled
              v-model="form.account_name"
              label="Account Nickname *"
              placeholder="e.g. My Amazon IT"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Account name is required']"
            />

            <q-select
              filled
              v-model="form.platform"
              :options="platformOptions"
              label="Platform *"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Platform is required']"
            />

            <div class="row q-col-gutter-sm">
              <div class="col-12">
                <q-input filled v-model="form.email" label="Login Email *" type="email" />
              </div>
              <div class="col-12">
                <q-input filled v-model="form.password" label="Login Password *" type="password" />
              </div>
            </div>

            <q-separator class="q-my-md" />

            <div class="row items-center justify-between q-mb-sm">
              <div class="text-subtitle2 text-weight-bold">Security (MFA)</div>
              <q-toggle v-model="form.is_mfa_enabled" label="Enable OTP Generation" left-label color="primary" />
            </div>

            <q-slide-transition>
              <div v-if="form.is_mfa_enabled">
                <q-input
                  filled
                  v-model="form.otp_secret"
                  label="OTP Secret (Base32) *"
                  hint="Paste the secret key provided by Amazon during MFA setup."
                  lazy-rules
                  :rules="[(val) => !form.is_mfa_enabled || (val && val.length > 0) || 'OTP Secret is required when MFA is enabled']"
                />
              </div>
            </q-slide-transition>

            <q-input
              filled
              v-model="form.notes"
              type="textarea"
              label="Internal Notes"
              rows="3"
            />

            <q-card-actions align="right" class="q-pa-none q-pt-md">
              <q-btn flat label="Cancel" v-close-popup color="grey-7" />
              <q-btn unelevated label="Save Account" type="submit" color="primary" class="q-px-lg" />
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { websocketService, useSocketStore } from 'src/services/websocket';
import { mapState } from 'pinia';

export default {
  name: 'SuppliersListPage',
  data() {
    return {
      suppliers: [],
      loading: false,
      filter: '',
      dialogOpen: false,
      form: {
        id: null,
        account_name: '',
        platform: 'amazon',
        email: '',
        password: '',
        otp_secret: '',
        is_mfa_enabled: false,
        notes: '',
        status: 'active'
      },
      defaultForm: {
        id: null,
        account_name: '',
        platform: 'amazon',
        email: '',
        password: '',
        otp_secret: '',
        is_mfa_enabled: false,
        notes: '',
        status: 'active'
      },
      platformOptions: [
        { label: 'Amazon', value: 'amazon' },
        { label: 'AliExpress', value: 'aliexpress' },
        { label: 'Shopify', value: 'shopify' }
      ],
      columns: [
        { name: 'account_name', label: 'Account Name', align: 'left', field: 'account_name', sortable: true },
        { name: 'platform', label: 'Platform', align: 'center', field: 'platform', sortable: true },
        { name: 'email', label: 'Email', align: 'left', field: 'email', sortable: true },
        { name: 'otp_code', label: 'Current OTP', align: 'center', field: 'id' },
        { name: 'status', label: 'Status', align: 'center', field: 'status', sortable: true },
        { name: 'is_mfa_enabled', label: 'MFA', align: 'center', field: 'is_mfa_enabled', sortable: true },
        { name: 'actions', label: 'Actions', align: 'right', field: 'actions' }
      ]
    };
  },
  computed: {
    ...mapState(useSocketStore, ['supplierOTPs'])
  },
  mounted() {
    this.fetchSuppliers();
    this.subscribeToOTP();
  },
  beforeUnmount() {
    this.unsubscribeFromOTP();
  },
  methods: {
    async fetchSuppliers() {
      this.loading = true;
      try {
        const response = await this.$api.get('/suppliers');
        this.suppliers = response.data;
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: 'Failed to fetch supplier accounts.',
          icon: 'las la-exclamation-triangle'
        });
        console.error('Error fetching suppliers:', error);
      } finally {
        this.loading = false;
      }
    },
    async subscribeToOTP() {
      try {
        await websocketService.send('suppliers/subscribe-otp');
      } catch (error) {
        console.error('Failed to subscribe to OTP updates:', error.message);
      }
    },
    async unsubscribeFromOTP() {
      try {
        await websocketService.send('suppliers/unsubscribe-otp');
      } catch (error) {
        console.error('Failed to unsubscribe from OTP updates:', error.message);
      }
    },
    getOTP(id) {
      return this.supplierOTPs[id]?.otp;
    },
    getOTPRemaining(id) {
      return this.supplierOTPs[id]?.remaining || 0;
    },
    openDialog(supplier = null) {
      if (supplier) {
        this.form = { ...supplier };
      } else {
        this.form = { ...this.defaultForm };
      }
      this.dialogOpen = true;
    },
    async saveSupplier() {
      this.loading = true;
      try {
        if (this.form.id) {
          await this.$api.put(`/suppliers/${this.form.id}`, this.form);
          this.$q.notify({ type: 'positive', message: 'Supplier account updated.' });
        } else {
          await this.$api.post('/suppliers', this.form);
          this.$q.notify({ type: 'positive', message: 'Supplier account added.' });
        }
        this.dialogOpen = false;
        await this.fetchSuppliers();
        // Re-subscribe to catch any new MFA enabled accounts
        await this.subscribeToOTP();
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: error.response?.data?.message || 'Failed to save account.'
        });
      } finally {
        this.loading = false;
      }
    },
    deleteSupplier(id) {
      this.$q.dialog({
        title: 'Confirm Deletion',
        message: 'Permanently remove this supplier account?',
        cancel: true,
        persistent: true
      }).onOk(async () => {
        this.loading = true;
        try {
          await this.$api.delete(`/suppliers/${id}`);
          this.$q.notify({ type: 'positive', message: 'Account deleted.' });
          await this.fetchSuppliers();
        } catch (error) {
          this.$q.notify({ type: 'negative', message: 'Delete failed.' });
        } finally {
          this.loading = false;
        }
      });
    },
    getPlatformColor(platform) {
      switch (platform.toLowerCase()) {
        case 'amazon': return 'orange-9';
        case 'aliexpress': return 'red-8';
        case 'shopify': return 'green-7';
        default: return 'grey-7';
      }
    },
    getStatusColor(status) {
      switch (status) {
        case 'active': return 'positive';
        case 'expired': return 'warning';
        case 'error': return 'negative';
        default: return 'grey-7';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.table-card {
  border-radius: 16px;
  overflow: hidden;
}

.letter-spacing-lg {
  letter-spacing: 0.15em;
}

.admin-table {
  :deep(th) {
    font-weight: 700;
    text-transform: uppercase;
    font-size: 0.75rem;
    color: $grey-7;
  }
}
</style>
