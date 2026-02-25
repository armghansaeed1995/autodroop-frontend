<template>
  <div class="q-pa-md q-pa-md-xl">

    <div class="q-mb-xl">
      <h1 class="text-h4 text-weight-bold q-my-none">Design System</h1>
      <p class="text-body2 text-grey-6 q-mt-xs">Typography scale and button variants for the application.</p>
    </div>

    <div class="row q-col-gutter-lg">

      <div class="col-12 col-lg-6">
        <q-card flat class="q-pa-md full-height">
          <div class="text-h6 text-weight-medium q-mb-md">Typography Scale</div>
          <q-separator class="q-mb-md" />

          <div class="typography-list">
            <div class="row items-center q-mb-md">
              <div class="col-3 text-caption text-grey-6 text-uppercase">H1</div>
              <div class="col-9 text-h1 text-weight-bold">Heading 1</div>
            </div>

            <div class="row items-center q-mb-md">
              <div class="col-3 text-caption text-grey-6 text-uppercase">H2</div>
              <div class="col-9 text-h2 text-weight-bold">Heading 2</div>
            </div>

            <div class="row items-center q-mb-md">
              <div class="col-3 text-caption text-grey-6 text-uppercase">H3</div>
              <div class="col-9 text-h3 text-weight-medium">Heading 3</div>
            </div>

            <div class="row items-center q-mb-md">
              <div class="col-3 text-caption text-grey-6 text-uppercase">H4</div>
              <div class="col-9 text-h4 text-weight-medium">Heading 4</div>
            </div>

            <div class="row items-center q-mb-md">
              <div class="col-3 text-caption text-grey-6 text-uppercase">H5</div>
              <div class="col-9 text-h5 text-weight-medium">Heading 5</div>
            </div>

            <div class="row items-center q-mb-lg">
              <div class="col-3 text-caption text-grey-6 text-uppercase">H6</div>
              <div class="col-9 text-h6 text-weight-medium">Heading 6</div>
            </div>

            <q-separator class="q-mb-lg" />

            <div class="row items-start q-mb-md">
              <div class="col-3 text-caption text-grey-6 text-uppercase q-pt-xs">Subtitle 1</div>
              <div class="col-9 text-subtitle1">Used for card titles and distinct sectional headers.</div>
            </div>

            <div class="row items-start q-mb-md">
              <div class="col-3 text-caption text-grey-6 text-uppercase q-pt-xs">Body 1</div>
              <div class="col-9 text-body1">
                The standard default text. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Pellentesque condimentum, est sed lobortis fringilla, mi nisi efficitur urna.
              </div>
            </div>

            <div class="row items-start q-mb-md">
              <div class="col-3 text-caption text-grey-6 text-uppercase q-pt-xs">Body 2</div>
              <div class="col-9 text-body2 text-grey-7">
                Secondary body text. Used for descriptions, subtitles, or dense data tables where
                space is at a premium but readability is still required.
              </div>
            </div>

            <div class="row items-center">
              <div class="col-3 text-caption text-grey-6 text-uppercase">Caption</div>
              <div class="col-9 text-caption text-uppercase text-weight-bold tracking-wide">
                Used for tiny labels and badges
              </div>
            </div>
          </div>
        </q-card>
      </div>

      <div class="col-12 col-lg-6">
        <q-card flat class="q-pa-md">
          <div class="text-h6 text-weight-medium q-mb-md">Button Variants</div>
          <q-separator class="q-mb-lg" />

          <div class="q-mb-lg">
            <div class="text-subtitle2 text-grey-6 q-mb-sm text-uppercase">Solid (Unelevated)</div>
            <div class="row q-gutter-sm">
              <q-btn unelevated color="primary" label="Primary" />
              <q-btn unelevated color="secondary" label="Secondary" />
              <q-btn unelevated color="positive" label="Positive" />
              <q-btn unelevated color="negative" label="Negative" />
              <q-btn unelevated color="warning" text-color="dark" label="Warning" />
            </div>
          </div>

          <div class="q-mb-lg">
            <div class="text-subtitle2 text-grey-6 q-mb-sm text-uppercase">Outline</div>
            <div class="row q-gutter-sm">
              <q-btn outline color="primary" label="Primary" />
              <q-btn outline color="secondary" label="Secondary" />
              <q-btn outline color="positive" label="Positive" />
              <q-btn outline color="negative" label="Negative" />
            </div>
          </div>

          <div class="q-mb-lg">
            <div class="text-subtitle2 text-grey-6 q-mb-sm text-uppercase">Flat</div>
            <div class="row q-gutter-sm">
              <q-btn flat color="primary" label="Primary" />
              <q-btn flat color="secondary" label="Secondary" />
              <q-btn flat color="positive" label="Positive" />
              <q-btn flat color="negative" label="Negative" />
            </div>
          </div>

          <div class="q-mb-lg">
            <div class="text-subtitle2 text-grey-6 q-mb-sm text-uppercase">With Icons & States</div>
            <div class="row q-gutter-sm items-center">
              <q-btn unelevated color="primary" icon="las la-save" label="Save" />
              <q-btn outline color="secondary" icon-right="las la-arrow-right" label="Next" />
              <q-btn unelevated round color="accent" icon="las la-heart" />

              <q-btn
                unelevated
                color="primary"
                :loading="isLoading"
                @click="simulateLoading"
                icon="las la-cloud-upload-alt"
                label="Upload"
              />

              <q-btn unelevated disable color="primary" label="Disabled" />
            </div>
          </div>

          <div>
            <div class="text-subtitle2 text-grey-6 q-mb-sm text-uppercase">Sizes</div>
            <div class="row q-gutter-sm items-center">
              <q-btn unelevated size="sm" color="primary" label="Small" />
              <q-btn unelevated size="md" color="primary" label="Medium" />
              <q-btn unelevated size="lg" color="primary" label="Large" />
            </div>
          </div>

        </q-card>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'PageDesignShowcase',
  data() {
    return {
      isLoading: false
    }
  },
  methods: {
    simulateLoading() {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        this.$q.notify({
          color: 'positive',
          message: 'Action completed',
          icon: 'las la-check',
          position: 'top-right'
        });
      }, 2000);
    }
  }
}
</script>

<style lang="scss" scoped>
/* Ensure custom Line-heights match our Inter/Roboto font scale cleanly */
.typography-list {
  .text-h1 { font-size: 2.5rem; line-height: 1.2; letter-spacing: -0.02em; }
  .text-h2 { font-size: 2rem; line-height: 1.25; letter-spacing: -0.01em; }
  .text-h3 { font-size: 1.5rem; line-height: 1.3; }
  .text-h4 { font-size: 1.25rem; line-height: 1.35; }

  .tracking-wide {
    letter-spacing: 0.05em;
  }
}

/* Dark mode adjustments for specific typography elements */
body.body--dark {
  .text-grey-7 {
    color: $grey-5 !important;
  }
}
</style>
