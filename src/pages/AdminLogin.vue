<template>
  <div class="login-page flex flex-center q-pa-md">
    <q-card class="login-card overflow-hidden" flat>
      <div class="row full-height">

        <div class="col-12 col-md-6 bg-primary text-white flex flex-center q-pa-xl login-branding sm-hide xs-hide">
          <div class="text-center">
            <q-icon name="las la-cube" size="80px" class="q-mb-md" />
            <h2 class="text-h3 text-weight-bold q-my-none">Admin Portal</h2>
            <p class="text-subtitle1 q-mt-md opacity-80">
              Manage your platform efficiently and securely.
            </p>
          </div>
        </div>

        <div class="col-12 col-md-6 q-pa-xl flex column justify-center form-container">
          <div class="q-mb-xl">
            <div class="text-h4 text-weight-bold q-mb-xs">Admin Login</div>
            <div class="text-body2 text-grey-6">Please enter your admin credentials.</div>
          </div>

          <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-y-md">

            <q-input
              filled
              type="email"
              v-model="email"
              label="Email"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Please type your email',
                (val) => /.+@.+\..+/.test(val) || 'Email must be valid'
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="las la-envelope" />
              </template>
            </q-input>

            <q-input
              filled
              :type="isPwdVisible ? 'text' : 'password'"
              v-model="password"
              label="Password"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Please type your password']"
            >
              <template v-slot:prepend>
                <q-icon name="las la-lock" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="isPwdVisible ? 'las la-eye' : 'las la-eye-slash'"
                  class="cursor-pointer"
                  @click="isPwdVisible = !isPwdVisible"
                />
              </template>
            </q-input>

            <div class="row justify-end items-center q-mb-md">
              <a href="#" class="text-primary text-weight-medium text-caption text-no-wrap" style="text-decoration: none;">
                Forgot password?
              </a>
            </div>

            <q-btn
              label="Sign In"
              type="submit"
              color="primary"
              size="lg"
              class="full-width q-mt-sm"
              unelevated
              :loading="loading"
            />
          </q-form>

          <div class="text-center q-mt-xl text-body2">
            <span class="text-grey-6">Are you a customer?</span>
            <router-link to="/customer-login" class="text-primary text-weight-medium q-ml-xs" style="text-decoration: none;">
              Sign in here
            </router-link>
          </div>

        </div>
      </div>
    </q-card>
  </div>
</template>

<script>
export default {
  name: 'PageAdminLogin',
  data() {
    return {
      email: '',
      password: '',
      isPwdVisible: false,
      loading: false
    }
  },
  methods: {
    async onSubmit() {
      this.loading = true;

      try {
        const response = await this.$api.post('/auth/admin-login', {
          email: this.email,
          password: this.password
        });

        const { token, user } = response.data;

        this.$q.localStorage.set('token', token);
        this.$q.localStorage.set('user', user);

        this.$q.notify({
          color: 'positive',
          message: 'Login successful!',
          icon: 'las la-check-circle',
          position: 'top-right'
        });

        // Redirect to admin dashboard
        this.$router.push('/admin/dashboard');

      } catch (error) {
        let errorMessage = 'An unexpected error occurred during login.';
        if (error.response && error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
        this.$q.notify({
          color: 'negative',
          message: errorMessage,
          icon: 'las la-exclamation-triangle',
          position: 'top-right'
        });
      } finally {
        this.loading = false;
      }
    },
    onReset() {
      this.email = '';
      this.password = '';
      this.isPwdVisible = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.login-page {
  background: var(--q-bg-light); // Uses our global tokens

  body.body--dark & {
    background: var(--q-bg-dark);
  }
}

.login-card {
  width: 100%;
  max-width: 1000px;
  min-height: 600px;
  border-radius: $radius-base; // From our design-system variables
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1) !important;

  @media (max-width: $breakpoint-sm-max) {
    max-width: 450px;
    min-height: auto;
  }
}

.login-branding {
  background: linear-gradient(135deg, $primary 0%, darken($primary, 15%) 100%);
  position: relative;

  .opacity-80 {
    opacity: 0.8;
  }
}

.form-container {
  background: $surface-light;

  body.body--dark & {
    background: $surface-dark;
  }
}
</style>
