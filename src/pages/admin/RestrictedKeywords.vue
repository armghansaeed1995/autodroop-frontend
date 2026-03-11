<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-xl">
      <div>
        <h1 class="text-h4 text-weight-bold q-my-none">Restricted Keywords</h1>
        <p class="text-body2 text-grey-6 q-mt-xs">Manage VeRO, Counterfeit, and Prohibited keywords for product validation.</p>
      </div>
      <div class="row q-gutter-sm">
        <q-btn
          outline
          color="primary"
          icon="las la-file-excel"
          label="Bulk Upload"
          @click="showUploadDialog = true"
        />
        <q-btn
          color="primary"
          icon="las la-plus"
          label="Add Keyword"
          @click="openAddDialog"
        />
      </div>
    </div>

    <q-card flat bordered class="rounded-borders">
      <q-table
        :rows="keywords"
        :columns="columns"
        row-key="id"
        :loading="loading"
        :filter="filter"
        flat
      >
        <template v-slot:top-right>
          <q-input v-model="filter" placeholder="Search keywords..." dense outlined>
            <template v-slot:append><q-icon name="las la-search" /></template>
          </q-input>
        </template>

        <template v-slot:body-cell-type="props">
          <q-td :props="props">
            <q-chip
              :color="getTypeColor(props.row.type)"
              text-color="white"
              dense
              class="text-weight-bold"
            >
              {{ props.row.type }}
            </q-chip>
          </q-td>
        </template>

        <template v-slot:body-cell-match_type="props">
          <q-td :props="props">
            <q-badge outline color="grey-7">{{ props.row.match_type }}</q-badge>
          </q-td>
        </template>

        <template v-slot:body-cell-region_code="props">
          <q-td :props="props">
            <q-chip outline dense size="sm">{{ props.row.region_code || 'GLOBAL' }}</q-chip>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-xs">
            <q-btn flat round dense color="negative" icon="las la-trash-alt" @click="deleteKeyword(props.row.id)">
              <q-tooltip>Delete</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Add Keyword Dialog -->
    <q-dialog v-model="showAddDialog">
      <q-card style="width: 450px; border-radius: 16px;">
        <q-card-section class="row items-center">
          <div class="text-h6 text-weight-bold">Add Restricted Keyword</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="saveKeyword" class="q-gutter-md">
            <q-input
              v-model="form.keyword"
              label="Keyword/Brand Name *"
              outlined
              dense
              lazy-rules
              :rules="[val => val && val.length > 0 || 'Required']"
            />
            
            <q-select
              v-model="form.type"
              :options="['VeRO', 'Counterfeit', 'Prohibited', 'Trademark']"
              label="Violation Type *"
              outlined
              dense
            />

            <div class="row q-col-gutter-sm">
              <div class="col-6">
                <q-select
                  v-model="form.match_type"
                  :options="['PARTIAL', 'EXACT', 'REGEX']"
                  label="Match Type"
                  outlined
                  dense
                />
              </div>
              <div class="col-6">
                <q-input
                  v-model="form.region_code"
                  label="Region (Optional)"
                  placeholder="e.g. IT"
                  outlined
                  dense
                />
              </div>
            </div>

            <q-input
              v-model="form.notes"
              type="textarea"
              label="Internal Notes"
              outlined
              dense
              rows="3"
            />

            <q-card-actions align="right" class="q-px-none q-pt-md">
              <q-btn flat label="Cancel" v-close-popup />
              <q-btn unelevated label="Save Keyword" type="submit" color="primary" />
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Bulk Upload Dialog -->
    <q-dialog v-model="showUploadDialog">
      <q-card style="width: 400px; border-radius: 16px;">
        <q-card-section>
          <div class="text-h6 text-weight-bold">Bulk Upload Keywords</div>
          <p class="text-caption text-grey-7">Upload an Excel/CSV file with columns: <b>keyword, type, region, match_type, notes</b></p>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-file
            v-model="uploadFile"
            label="Choose Excel File"
            outlined
            dense
            accept=".xlsx, .xls, .csv"
          >
            <template v-slot:prepend><q-icon name="las la-file-excel" /></template>
          </q-file>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn
            unelevated
            label="Upload Now"
            color="primary"
            @click="handleBulkUpload"
            :loading="uploading"
            :disable="!uploadFile"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';

export default {
  name: 'RestrictedKeywordsPage',
  setup() {
    const $q = useQuasar();
    const keywords = ref([]);
    const loading = ref(false);
    const filter = ref('');
    const showAddDialog = ref(false);
    const showUploadDialog = ref(false);
    const uploadFile = ref(null);
    const uploading = ref(false);

    const form = ref({
      keyword: '',
      type: 'VeRO',
      match_type: 'PARTIAL',
      region_code: '',
      notes: ''
    });

    const columns = [
      { name: 'keyword', label: 'Keyword', align: 'left', field: 'keyword', sortable: true },
      { name: 'type', label: 'Type', align: 'center', field: 'type', sortable: true },
      { name: 'match_type', label: 'Match', align: 'center', field: 'match_type' },
      { name: 'region_code', label: 'Region', align: 'center', field: 'region_code' },
      { name: 'notes', label: 'Notes', align: 'left', field: 'notes', classes: 'text-grey-7' },
      { name: 'actions', label: 'Actions', align: 'right', field: 'actions' }
    ];

    const fetchKeywords = async () => {
      loading.value = true;
      try {
        const res = await api.get('/admin/restricted-keywords');
        keywords.value = res.data;
      } catch (e) {
        console.error(e);
      } finally {
        loading.value = false;
      }
    };

    const openAddDialog = () => {
      form.value = { keyword: '', type: 'VeRO', match_type: 'PARTIAL', region_code: '', notes: '' };
      showAddDialog.value = true;
    };

    const saveKeyword = async () => {
      try {
        await api.post('/admin/restricted-keywords', form.value);
        $q.notify({ type: 'positive', message: 'Keyword added' });
        showAddDialog.value = false;
        fetchKeywords();
      } catch (e) {
        $q.notify({ type: 'negative', message: 'Failed to add keyword' });
      }
    };

    const handleBulkUpload = async () => {
      if (!uploadFile.value) return;
      uploading.value = true;
      const formData = new FormData();
      formData.append('file', uploadFile.value);

      try {
        const res = await api.post('/admin/restricted-keywords/bulk-upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        $q.notify({ type: 'positive', message: res.data.message });
        showUploadDialog.value = false;
        uploadFile.value = null;
        fetchKeywords();
      } catch (e) {
        $q.notify({ type: 'negative', message: 'Upload failed' });
      } finally {
        uploading.value = false;
      }
    };

    const deleteKeyword = (id) => {
      $q.dialog({
        title: 'Delete Keyword',
        message: 'Are you sure?',
        cancel: true,
        ok: { color: 'negative', flat: true }
      }).onOk(async () => {
        try {
          await api.delete(`/admin/restricted-keywords/${id}`);
          $q.notify({ type: 'positive', message: 'Deleted' });
          fetchKeywords();
        } catch (e) {
          console.error(e);
        }
      });
    };

    const getTypeColor = (type) => {
      switch (type) {
        case 'VeRO': return 'orange-9';
        case 'Counterfeit': return 'red-9';
        case 'Prohibited': return 'black';
        default: return 'primary';
      }
    };

    onMounted(fetchKeywords);

    return {
      keywords,
      columns,
      loading,
      filter,
      showAddDialog,
      showUploadDialog,
      uploadFile,
      uploading,
      form,
      fetchKeywords,
      openAddDialog,
      saveKeyword,
      handleBulkUpload,
      deleteKeyword,
      getTypeColor
    };
  }
};
</script>
