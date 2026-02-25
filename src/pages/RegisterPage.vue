<template>
  <div class="register-page flex flex-center q-pa-md">
    <q-card class="register-card overflow-hidden" flat>
      <div class="row full-height">

        <div class="col-12 col-md-6 bg-secondary text-white flex flex-center q-pa-xl register-branding sm-hide xs-hide">
          <div class="text-center">
            <q-icon name="las la-rocket" size="80px" class="q-mb-md" />
            <h2 class="text-h3 text-weight-bold q-my-none">Join Us</h2>
            <p class="text-subtitle1 q-mt-md opacity-80">
              Create an account to start managing your platform today.
            </p>
          </div>
        </div>

        <div class="col-12 col-md-6 q-pa-xl flex column justify-center form-container">
          <div class="q-mb-xl">
            <div class="text-h4 text-weight-bold q-mb-xs">Create Account</div>
            <div class="text-body2 text-grey-6">Fill in the details below to get started.</div>
          </div>

          <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-y-md">

            <q-input
              filled
              v-model="firstName"
              label="First Name *"
              lazy-rules
              :rules="[(val) => (val && val.length >= 2) || 'First name must be at least 2 characters']"
            >
              <template v-slot:prepend>
                <q-icon name="las la-user" />
              </template>
            </q-input>

            <q-input
              filled
              v-model="lastName"
              label="Last Name *"
              lazy-rules
              :rules="[(val) => (val && val.length >= 2) || 'Last name must be at least 2 characters']"
            >
              <template v-slot:prepend>
                <q-icon name="las la-user" />
              </template>
            </q-input>

            <q-input
              filled
              type="email"
              v-model="email"
              label="Email *"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Email is required',
                (val) => /.+@.+\..+/.test(val) || 'Email must be valid'
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="las la-envelope" />
              </template>
            </q-input>

            <q-input
              filled
              v-model="companyName"
              label="Company Name"
              lazy-rules
              :rules="[(val) => (val === null || val.length === 0 || val.length >= 2) || 'Company name must be at least 2 characters']"
            >
              <template v-slot:prepend>
                <q-icon name="las la-building" />
              </template>
            </q-input>

            <q-input
              filled
              :type="isPwdVisible ? 'text' : 'password'"
              v-model="password"
              label="Password *"
              lazy-rules
              :rules="[
                (val) => (val && val.length >= 6) || 'Password must be at least 6 characters'
              ]"
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

            <q-input
              filled
              :type="isConfirmPwdVisible ? 'text' : 'password'"
              v-model="confirmPassword"
              label="Confirm password *"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Please confirm your password',
                (val) => val === password || 'Passwords do not match'
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="las la-check-circle" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="isConfirmPwdVisible ? 'las la-eye' : 'las la-eye-slash'"
                  class="cursor-pointer"
                  @click="isConfirmPwdVisible = !isConfirmPwdVisible"
                />
              </template>
            </q-input>

            <div class="row items-center q-mb-sm">
              <q-checkbox v-model="acceptTerms" color="primary" dense />
              <div class="text-caption q-ml-sm">
                I agree to the <a href="#" class="text-primary text-weight-medium" style="text-decoration: none;">Terms & Conditions</a>
              </div>
            </div>

            <div class="row q-gutter-sm q-mt-sm">
              <q-btn
                label="Register"
                type="submit"
                color="primary"
                size="lg"
                class="col-grow"
                unelevated
                :loading="loading"
              />
              <q-btn
                label="Reset"
                type="reset"
                color="secondary"
                size="lg"
                flat
                class="col-auto"
                :disable="loading"
              />
            </div>
          </q-form>

          <div class="text-center q-mt-xl text-body2">
            <span class="text-grey-6">Already have an account?</span>
            <router-link to="/login" class="text-primary text-weight-medium q-ml-xs" style="text-decoration: none;">
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
  name: 'PageRegister',
  data() {
    return {
      firstName: '',
      lastName: '',
      email: '',
      companyName: '',
      password: '',
      confirmPassword: '',
      isPwdVisible: false,
      isConfirmPwdVisible: false,
      acceptTerms: false,
      loading: false
    }
  },
  methods: {
    async onSubmit() {
      // Secondary check for terms & conditions
      if (!this.acceptTerms) {
        this.$q.notify({
          color: 'warning',
          message: 'You must accept the Terms & Conditions',
          icon: 'las la-exclamation-triangle',
          position: 'top-right'
        });
        return;
      }

      this.loading = true;

      try {
        const response = await this.$axios.post('http://localhost:3000/api/register', {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          companyName: this.companyName,
          password: this.password,
          confirmPassword: this.confirmPassword // Though not sent to backend, keeping for local validation consistency
        });

        this.$q.notify({
          color: 'positive',
          message: response.data.message + ' Please select a package to complete your registration.',
          icon: 'las la-check-circle',
          position: 'top-right'
        });

        // Store customer ID and email temporarily for the package purchase flow
        localStorage.setItem('pendingCustomerId', response.data.customer.id);
        localStorage.setItem('pendingCustomerEmail', response.data.customer.email);

        // Redirect to buy package page
        this.$router.push('/buy-package');
      } catch (error) {
        let errorMessage = 'An unexpected error occurred during registration.';
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
      this.firstName = '';
      this.lastName = '';
      this.email = '';
      this.companyName = '';
      this.password = '';
      this.confirmPassword = '';
      this.isPwdVisible = false;
      this.isConfirmPwdVisible = false;
      this.acceptTerms = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.register-page {
  background: var(--q-bg-light); // Uses global CSS variables

  body.body--dark & {
    background: var(--q-bg-dark);
  }
}

.register-card {
  width: 100%;
  max-width: 1000px;
  min-height: 650px;
  border-radius: $radius-base;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1) !important;

  @media (max-width: $breakpoint-sm-max) {
    max-width: 450px;
    min-height: auto;
  }
}

.register-branding {
  // Using secondary color to differentiate slightly from the Login page
  background: linear-gradient(135deg, $secondary 0%, darken($secondary, 15%) 100%);
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
