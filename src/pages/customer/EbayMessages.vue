<template>
  <q-page padding class="bg-grey-1">
    <div class="row q-col-gutter-md full-height" style="height: calc(100vh - 150px)">
      <!-- Conversations Sidebar -->
      <div class="col-12 col-md-4 col-lg-3">
        <q-card flat bordered class="column full-height rounded-borders bg-white">
          <q-card-section class="q-py-md">
            <div class="text-h6 text-weight-bold">eBay Messages</div>
            <q-input v-model="search" placeholder="Search conversations..." dense outlined class="q-mt-sm">
              <template v-slot:prepend><q-icon name="las la-search" /></template>
            </q-input>
          </q-card-section>

          <q-separator />

          <q-scroll-area class="col">
            <q-list separator>
              <q-item
                v-for="conv in filteredConversations"
                :key="conv.id"
                clickable
                @click="selectConversation(conv)"
                :active="selectedConversation?.id === conv.id"
                active-class="bg-blue-1 text-primary"
              >
                <q-item-section avatar>
                  <q-avatar color="primary" text-color="white">
                    {{ conv.buyer_username?.charAt(0).toUpperCase() }}
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label class="text-weight-bold">{{ conv.buyer_username }}</q-item-label>
                  <q-item-label caption lines="1">{{ conv.last_message_text }}</q-item-label>
                  <q-item-label caption class="text-grey-5 q-mt-xs">
                    Item: {{ conv.item_id || 'General' }}
                  </q-item-label>
                </q-item-section>

                <q-item-section side top>
                  <q-item-label caption>{{ formatTime(conv.last_message_at) }}</q-item-label>
                  <q-badge v-if="!conv.is_read" color="red" rounded floating />
                </q-item-section>
              </q-item>

              <q-item v-if="conversations.length === 0" class="text-center q-pa-xl">
                <q-item-section class="text-grey-6">
                  <q-icon name="las la-comments" size="64px" class="q-mb-md" />
                  No messages yet.
                </q-item-section>
              </q-item>
            </q-list>
          </q-scroll-area>
        </q-card>
      </div>

      <!-- Chat Window -->
      <div class="col-12 col-md-8 col-lg-9">
        <q-card flat bordered class="column full-height rounded-borders bg-white" v-if="selectedConversation">
          <!-- Chat Header -->
          <q-item class="q-py-md bg-white">
            <q-item-section avatar>
              <q-avatar color="primary" text-color="white">
                {{ selectedConversation.buyer_username?.charAt(0).toUpperCase() }}
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-h6 text-weight-bold">{{ selectedConversation.buyer_username }}</q-item-label>
              <q-item-label caption>
                eBay Item: <span class="text-primary cursor-pointer" @click="openItem(selectedConversation.item_id)">{{ selectedConversation.item_title || selectedConversation.item_id }}</span>
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn flat round icon="las la-sync" @click="fetchMessages(selectedConversation.id)" />
            </q-item-section>
          </q-item>

          <q-separator />

          <!-- Messages Area -->
          <q-scroll-area class="col q-pa-md bg-grey-1" ref="scrollArea">
            <div v-for="msg in messages" :key="msg.id" class="q-mb-md">
              <q-chat-message
                :name="msg.sender_role === 'buyer' ? selectedConversation.buyer_username : 'Me (Seller)'"
                :avatar="msg.sender_role === 'buyer' ? null : undefined"
                :text="[msg.text]"
                :sent="msg.sender_role === 'seller'"
                :bg-color="msg.sender_role === 'seller' ? 'primary' : 'white'"
                :text-color="msg.sender_role === 'seller' ? 'white' : 'black'"
                :stamp="formatDateTime(msg.sent_at)"
              />
            </div>
          </q-scroll-area>

          <q-separator />

          <!-- Reply Input -->
          <q-card-section class="q-pa-md bg-white">
            <q-form @submit="sendReply" class="row items-center q-gutter-sm">
              <q-input
                v-model="replyText"
                placeholder="Type your reply here..."
                outlined
                dense
                class="col"
                type="textarea"
                rows="2"
                @keydown.enter.prevent="sendReply"
              />
              <q-btn
                round
                color="primary"
                icon="las la-paper-plane"
                type="submit"
                :loading="sending"
                :disable="!replyText.trim()"
              />
            </q-form>
          </q-card-section>
        </q-card>

        <!-- Placeholder when no conversation is selected -->
        <q-card flat bordered class="column full-height flex-center bg-white" v-else>
          <q-icon name="las la-comments" size="128px" color="grey-3" />
          <div class="text-h5 text-grey-5 q-mt-md">Select a conversation to start chatting</div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';

export default {
  name: 'EbayMessagesPage',
  setup() {
    const $q = useQuasar();
    const conversations = ref([]);
    const messages = ref([]);
    const selectedConversation = ref(null);
    const search = ref('');
    const replyText = ref('');
    const loading = ref(false);
    const sending = ref(false);
    const scrollArea = ref(null);

    const filteredConversations = computed(() => {
      if (!search.value) return conversations.value;
      const s = search.value.toLowerCase();
      return conversations.value.filter(c => 
        c.buyer_username?.toLowerCase().includes(s) || 
        c.last_message_text?.toLowerCase().includes(s)
      );
    });

    const fetchConversations = async () => {
      loading.value = true;
      try {
        const res = await api.get('/ebay-messages/conversations');
        conversations.value = res.data;
      } catch (e) {
        console.error(e);
      } finally {
        loading.value = false;
      }
    };

    const fetchMessages = async (convId) => {
      try {
        const res = await api.get(`/ebay-messages/conversations/${convId}`);
        messages.value = res.data.messages;
        selectedConversation.value = res.data;
        scrollToBottom();
      } catch (e) {
        console.error(e);
      }
    };

    const selectConversation = (conv) => {
      selectedConversation.value = conv;
      fetchMessages(conv.id);
    };

    const sendReply = async () => {
      if (!replyText.value.trim() || sending.value) return;
      
      sending.value = true;
      try {
        const res = await api.post(`/ebay-messages/conversations/${selectedConversation.value.id}/reply`, {
          text: replyText.value
        });
        messages.value.push(res.data);
        replyText.value = '';
        scrollToBottom();
        
        // Update last message in list
        const idx = conversations.value.findIndex(c => c.id === selectedConversation.value.id);
        if (idx !== -1) {
          conversations.value[idx].last_message_text = res.data.text;
          conversations.value[idx].last_message_at = res.data.sent_at;
        }
      } catch (e) {
        $q.notify({ type: 'negative', message: 'Failed to send reply' });
      } finally {
        sending.value = false;
      }
    };

    const scrollToBottom = () => {
      nextTick(() => {
        if (scrollArea.value) {
          scrollArea.value.setScrollPercentage('vertical', 1);
        }
      });
    };

    const openItem = (itemId) => {
      window.open(`https://www.ebay.it/itm/${itemId}`, '_blank');
    };

    const formatTime = (dateStr) => {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDateTime = (dateStr) => {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      return date.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    onMounted(fetchConversations);

    return {
      conversations,
      messages,
      selectedConversation,
      search,
      replyText,
      loading,
      sending,
      filteredConversations,
      selectConversation,
      fetchMessages,
      sendReply,
      openItem,
      formatTime,
      formatDateTime,
      scrollArea
    };
  }
};
</script>

<style lang="scss" scoped>
.rounded-borders {
  border-radius: 12px;
}
.letter-spacing-lg {
  letter-spacing: 0.15em;
}
</style>
