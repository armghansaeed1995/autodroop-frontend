<template>
  <q-page class="landing-page" :class="{ 'is-dark': isDark }">
    <!-- --- Lighting & Glow Effects --- -->
    <div class="lighting-container">
      <div class="ambient-glow"></div>
      <div class="laser-beam"></div>
    </div>

    <!-- --- Navigation --- -->
    <nav class="nav-container relative z-10">
      <div class="logo-group">
        <div class="logo-icon">AD</div>
        <span class="logo-text">Auto<span class="text-primary">Droop</span></span>
      </div>
      <div class="nav-links gt-sm">
        <a href="#">{{ $t('landing.nav.product') }}</a>
        <a href="#">{{ $t('landing.nav.templates') }}</a>
        <a href="#">{{ $t('landing.nav.integrations') }}</a>
        <a href="#">{{ $t('landing.nav.docs') }}</a>
        <a href="#">{{ $t('landing.nav.pricing') }}</a>
      </div>
      <div class="nav-actions">
        <q-btn flat :label="$t('landing.nav.signIn')" class="gt-xs sign-in-btn" to="/customer/login" no-caps />
        <q-btn unelevated :label="$t('landing.nav.getStarted')" class="get-started-btn" to="/customer/login" no-caps />
        <q-btn flat round :icon="isDark ? 'las la-sun' : 'las la-moon'" @click="toggleDarkMode" dense size="sm" class="theme-toggle" />
      </div>
    </nav>

    <!-- --- Hero Section --- -->
    <section class="hero-section relative z-10">
      <h1 class="hero-title text-gradient">
        {{ $t('landing.hero.title') }}
      </h1>
      <p class="hero-subtitle">
        {{ $t('landing.hero.subtitle') }}
      </p>

      <div class="hero-btns">
        <q-btn unelevated :label="$t('landing.hero.startFree')" class="btn-primary-glow" to="/customer/login" no-caps />
        <q-btn outline :label="$t('landing.hero.howItWorks')" class="btn-secondary-outline" no-caps />
      </div>

      <div class="hero-badges">
        <span><q-icon name="las la-credit-card" /> {{ $t('landing.hero.noCreditCard') }}</span>
        <span><q-icon name="las la-rocket" /> {{ $t('landing.hero.readyToScale') }}</span>
        <span><q-icon name="las la-infinity" /> {{ $t('landing.hero.freeForever') }}</span>
      </div>
    </section>

    <!-- --- Mockup Section --- -->
    <section class="mockup-section relative z-10">
      <div class="mockup-wrapper">
        <div class="mockup-glow-border"></div>
        <div class="mockup-container">

          <!-- Mockup Toolbar -->
          <div class="mockup-toolbar">
            <div class="toolbar-left">
              <div class="window-controls">
                <div class="dot bg-negative"></div>
                <div class="dot bg-warning"></div>
                <div class="dot bg-positive"></div>
              </div>
              <div class="toolbar-brand">
                <div class="mini-logo">AD</div>
                AutoDroop
              </div>
            </div>
            <div class="toolbar-center">{{ $t('landing.mockup.aiAssistant') }}</div>
            <div class="toolbar-right">
              <q-icon name="las la-history" />
              <q-icon name="las la-adjust" />
              <q-icon name="las la-cog" />
              <div class="user-avatar-placeholder"></div>
            </div>
          </div>

          <div class="mockup-body">
            <!-- Sidebar -->
            <div class="mockup-sidebar gt-sm">
              <div class="sidebar-item active">
                <q-icon name="las la-home" /> Dashboard
              </div>
              <div class="sidebar-item"><q-icon name="las la-layer-group" /> Inventory</div>
              <div class="sidebar-item"><q-icon name="las la-shopping-cart" /> Orders</div>
              <div class="sidebar-item"><q-icon name="las la-envelope" /> Messages</div>
              <div class="sidebar-item sep-bottom"><q-icon name="las la-cog" /> Settings</div>

              <div class="sidebar-label">Recent Activity</div>
              <div class="sidebar-recent">Amazon IT Import #421</div>
              <div class="sidebar-recent">eBay UK Sync Success</div>
              <div class="sidebar-recent">Price Adjusted: SKU-782</div>

              <div class="sidebar-upgrade-card">
                <div class="upgrade-glow"></div>
                <div class="upgrade-title">
                  {{ $t('landing.mockup.upgradePro') }} <span class="badge-pro">{{ $t('landing.mockup.pro') }}</span>
                </div>
                <p class="upgrade-desc">{{ $t('landing.mockup.proDescription') }}</p>
                <button class="upgrade-btn">{{ $t('landing.mockup.learnMore') }}</button>
              </div>
            </div>

            <!-- Dashboard Content -->
            <div class="mockup-content">
              <div class="chat-interface">
                <h3 class="chat-title">{{ $t('landing.mockup.heyThere') }}</h3>
                <p class="chat-subtitle">{{ $t('landing.mockup.whatToAutomate') }}</p>
                <p class="chat-help">{{ $t('landing.mockup.helpText') }}</p>

                <div class="action-grid">
                  <div class="action-pill"><q-icon name="las la-cube" /> {{ $t('landing.mockup.actions.createWorkflow') }}</div>
                  <div class="action-pill"><q-icon name="las la-link" /> {{ $t('landing.mockup.actions.connectSuppliers') }}</div>
                  <div class="action-pill"><q-icon name="las la-chart-bar" /> {{ $t('landing.mockup.actions.generateReport') }}</div>
                  <div class="action-pill"><q-icon name="las la-envelope" /> {{ $t('landing.mockup.actions.sendDigest') }}</div>
                  <div class="action-pill"><q-icon name="las la-file-upload" /> {{ $t('landing.mockup.actions.organizeFiles') }}</div>
                  <div class="action-pill"><q-icon name="las la-lightbulb" /> {{ $t('landing.mockup.actions.suggestIdeas') }}</div>
                </div>

                <div class="chat-input-wrapper">
                  <div class="input-glow"></div>
                  <div class="attach-btn"><q-icon name="las la-plus" /> <span>{{ $t('landing.mockup.attach') }}</span></div>
                  <input type="text" placeholder="" />
                  <div class="input-actions">
                    <q-icon name="las la-microphone" />
                    <div class="send-btn"><q-icon name="las la-arrow-up" /></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- --- Trusted By Section --- -->
    <section class="trusted-section">
      <p class="trusted-label">{{ $t('landing.trustedBy') }}</p>
      <div class="partners-logos">
        <q-icon name="lab la-slack" />
        <span class="partner-text"><q-icon name="las la-cube" /> Notion</span>
        <span class="partner-text">Airtable</span>
        <q-icon name="lab la-figma" />
        <q-icon name="lab la-shopify" />
      </div>
    </section>

    <!-- --- Features Section --- -->
    <section class="features-section relative z-10">
      <h2 class="section-title">{{ $t('landing.features.title') }}</h2>

      <div class="features-grid">
        <div class="feature-card-large group">
          <div class="mesh-bg"></div>
          <div class="floating-icon"><q-icon name="las la-share-alt" /></div>
          <div class="feature-info bottom-align">
            <div class="feature-brand">
              <div class="mini-logo">AD</div>
              AutoDroop
            </div>
            <h3 class="feature-heading">{{ $t('landing.features.connectTools.title') }}</h3>
            <p class="feature-desc">{{ $t('landing.features.connectTools.description') }}</p>
          </div>
        </div>

        <div class="features-stack">
          <div class="feature-card-small group">
            <div class="glow-accent top-right"></div>
            <div class="feature-icon-box">
              <q-icon name="las la-layer-group" />
            </div>
            <div class="feature-info">
              <h3 class="feature-heading-sm">{{ $t('landing.features.buildVisually.title') }}</h3>
              <p class="feature-desc-sm">{{ $t('landing.features.buildVisually.description') }}</p>
            </div>
          </div>
          <div class="feature-card-small group">
            <div class="glow-accent bottom-right"></div>
            <div class="feature-icon-row">
              <div class="icon-play"><q-icon name="las la-play" /></div>
              <div class="icon-check"><q-icon name="las la-check" /></div>
            </div>
            <div class="feature-info">
              <h3 class="feature-heading-sm">{{ $t('landing.features.runScale.title') }}</h3>
              <p class="feature-desc-sm">{{ $t('landing.features.runScale.description') }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="section-footer">
        <q-btn outline label="Explore Templates" class="explore-btn" no-caps />
      </div>
    </section>

    <!-- --- Stats Section --- -->
    <section class="stats-section relative z-10">
      <div class="stats-grid">
        <div v-for="(stat, i) in stats" :key="i" class="stat-card group">
          <div class="stat-icon-bg" :class="i % 2 === 0 ? 'left' : 'right'"><q-icon :name="stat.icon" /></div>
          <h3 class="stat-heading">{{ $t(stat.title) }}</h3>
          <p class="stat-desc">{{ $t(stat.desc) }}</p>
        </div>
      </div>
    </section>

    <!-- --- Templates Section (Added from sample.html layout) --- -->
    <section class="templates-section relative z-10">
      <div class="section-header text-center">
        <h2 class="section-title-sm">{{ $t('landing.templates.title') }}</h2>
        <p class="section-subtitle">{{ $t('landing.templates.subtitle') }}</p>
      </div>

      <div class="templates-scroll">
        <div class="template-card group">
          <div class="template-visual">
            <div class="visual-glow"></div>
            <div class="visual-icon"><q-icon name="las la-share-nodes" /></div>
          </div>
          <div class="template-info">
            <h4 class="template-name">{{ $t('landing.templates.marketing') }}</h4>
            <p class="template-desc-sm">{{ $t('landing.templates.marketingDesc') }}</p>
            <div class="template-tags">
              <span>{{ $t('landing.templates.tags.italy') }}</span>
              <span>Marketing</span>
            </div>
          </div>
        </div>

        <div class="template-card group">
          <div class="template-visual column-style">
            <div class="visual-glow-alt"></div>
            <div class="mock-item active"><div class="mini-logo">AD</div> AutoDroop</div>
            <div class="mock-item">{{ $t('landing.templates.tags.inventory') }}</div>
            <div class="mock-item">Import</div>
          </div>
          <div class="template-info">
            <h4 class="template-name">{{ $t('landing.templates.leadGen') }}</h4>
            <p class="template-desc-sm">{{ $t('landing.templates.leadGenDesc') }}</p>
            <div class="template-tags">
              <span>{{ $t('landing.templates.tags.uk') }}</span>
              <span>{{ $t('landing.templates.tags.import') }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="scroll-controls">
        <q-btn round outline icon="las la-chevron-left" size="sm" />
        <q-btn round outline icon="las la-chevron-right" size="sm" />
      </div>
    </section>

    <!-- --- Testimonials Section --- -->
    <section class="testimonials-section relative z-10">
      <div class="section-header text-center">
        <h2 class="section-title-sm">{{ $t('landing.testimonials.title') }}</h2>
        <p class="section-subtitle">{{ $t('landing.testimonials.subtitle') }}</p>
      </div>

      <div class="masonry-layout">
        <div v-for="(msg, key) in testimonials" :key="key" class="testimonial-card">
          <q-icon name="las la-quote-left" class="quote-icon" />
          <p class="testimonial-text">{{ msg }}</p>
          <div class="author-info">
            <div class="author-avatar"><q-icon name="las la-user" /></div>
            <div class="author-details">
              <div class="author-name">{{ authors[key].name }}</div>
              <div class="author-role">{{ authors[key].role }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- --- Pricing Section --- -->
    <section class="pricing-section relative z-10">
      <div class="section-header text-center">
        <h2 class="section-title-sm">{{ $t('landing.pricing.title') }}</h2>
        <p class="section-subtitle">{{ $t('landing.pricing.subtitle') }}</p>
      </div>

      <div class="pricing-grid">
        <!-- Free Tier -->
        <div class="price-card">
          <div class="price-header">
            <q-icon name="las la-cube" />
            <h3 class="tier-name">{{ $t('landing.pricing.free.name') }}</h3>
            <p class="tier-desc">{{ $t('landing.pricing.free.desc') }}</p>
          </div>
          <div class="tier-price">${{ $t('landing.pricing.free.price') }}<span class="price-unit"> /14 Days</span></div>
          <q-btn outline :label="$t('landing.pricing.cta.free')" class="price-btn-outline" to="/customer/login" no-caps />
          <ul class="tier-features">
            <li v-for="f in $tm('landing.pricing.free.features')" :key="f"><q-icon name="las la-check-circle" /> {{ f }}</li>
          </ul>
        </div>

        <!-- Pro Tier (Featured) -->
        <div class="price-card featured shadow-glow">
          <div class="card-glow-center"></div>
          <div class="price-header relative z-10">
            <q-icon name="las la-cubes" class="text-primary" />
            <h3 class="tier-name">{{ $t('landing.pricing.pro.name') }}</h3>
            <p class="tier-desc">{{ $t('landing.pricing.pro.desc') }}</p>
          </div>
          <div class="tier-price relative z-10">${{ $t('landing.pricing.pro.price') }}<span class="price-unit"> /Mo</span></div>
          <q-btn unelevated :label="$t('landing.pricing.cta.pro')" class="price-btn-primary" to="/customer/login" no-caps />
          <ul class="tier-features relative z-10">
            <li v-for="f in $tm('landing.pricing.pro.features')" :key="f"><q-icon name="las la-check-circle" class="text-primary" /> {{ f }}</li>
          </ul>
        </div>

        <!-- Enterprise Tier -->
        <div class="price-card">
          <div class="price-header">
            <q-icon name="las la-building" />
            <h3 class="tier-name">{{ $t('landing.pricing.enterprise.name') }}</h3>
            <p class="tier-desc">{{ $t('landing.pricing.enterprise.desc') }}</p>
          </div>
          <div class="tier-price">${{ $t('landing.pricing.enterprise.price') }}<span class="price-unit"> /Mo</span></div>
          <q-btn outline :label="$t('landing.pricing.cta.enterprise')" class="price-btn-outline" no-caps />
          <ul class="tier-features">
            <li v-for="f in $tm('landing.pricing.enterprise.features')" :key="f"><q-icon name="las la-check-circle" /> {{ f }}</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- --- Footer --- -->
    <footer class="footer relative overflow-hidden">
      <div class="footer-glow"></div>
      <div class="footer-container relative z-10">
        <div class="footer-brand-side">
          <div class="logo-group">
            <div class="logo-icon">AD</div>
            <span class="logo-text">Auto<span class="text-primary">Droop</span></span>
          </div>
          <p class="footer-tagline">{{ $t('landing.footer.tagline') }}</p>
        </div>

        <div class="footer-links-side">
          <div class="link-col">
            <h4>{{ $t('landing.footer.product') }}</h4>
            <a href="#">{{ $t('landing.nav.pricing') }}</a>
            <a href="#">{{ $t('landing.nav.docs') }}</a>
            <a href="#">{{ $t('landing.nav.templates') }}</a>
          </div>
          <div class="link-col">
            <h4>{{ $t('landing.footer.company') }}</h4>
            <a href="#">Community</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'IndexPage',
  data() {
    return {
      authors: {
        emma: { name: 'Emma Collins', role: 'Store Owner' },
        hannah: { name: 'Hannah Lee', role: 'Operations' },
        laura: { name: 'Laura Kim', role: 'Dropshipper' },
        sofia: { name: 'Sofia Alvarez', role: 'Scale Lead' },
        michael: { name: 'Michael Torres', role: 'Power Seller' },
        david: { name: 'David Miller', role: 'Empire Builder' }
      },
      stats: [
        { title: 'landing.stats.integrations', desc: 'landing.stats.integrationsDesc', icon: 'las la-network-wired' },
        { title: 'landing.stats.visualEditor', desc: 'landing.stats.visualEditorDesc', icon: 'las la-list-ul' },
        { title: 'landing.stats.smartTriggers', desc: 'landing.stats.smartTriggersDesc', icon: 'las la-bolt' },
        { title: 'landing.stats.selfHost', desc: 'landing.stats.selfHostDesc', icon: 'las la-cloud' }
      ]
    };
  },
  computed: {
    isDark() {
      return this.$q.dark.isActive;
    },
    testimonials() {
      return {
        emma: this.$t('landing.testimonials.emma'),
        hannah: this.$t('landing.testimonials.hannah'),
        laura: this.$t('landing.testimonials.laura'),
        sofia: this.$t('landing.testimonials.sofia'),
        michael: this.$t('landing.testimonials.michael'),
        david: this.$t('landing.testimonials.david')
      };
    }
  },
  methods: {
    toggleDarkMode() {
      this.$q.dark.toggle();
    }
  }
});
</script>

<style lang="scss" scoped>
// --- Base Colors & Layout Config ---
$maroon: #8B1A1A;
$maroon-light: #B02525;
$charcoal: #121313;
$slate: #454F5B;
$dark-bg: #0A0C0D;
$dark-card: #121517;
$dark-border: #23292B;

.landing-page {
  font-family: 'Inter', sans-serif;
  background-color: #fdfdfd;
  color: #121313;
  overflow-x: hidden;
  position: relative;
  transition: background-color 0.3s, color 0.3s;

  &.is-dark {
    background-color: $dark-bg;
    color: #E2E8F0;
  }
}

// --- Lighting & Glow Effects (High Fidelity Translation) ---
.lighting-container {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  overflow: hidden; z-index: 0; pointer-events: none;
}
.ambient-glow {
  position: absolute; top: -10%; left: 50%; width: 100vw; height: 900px;
  transform: translateX(-50%);
  background: radial-gradient(ellipse at top, rgba(139, 26, 26, 0.08) 0%, transparent 60%);
  .is-dark & {
    background: radial-gradient(ellipse at top, rgba(139, 26, 26, 0.15) 0%, transparent 60%);
  }
}
.laser-beam {
  position: absolute; top: -100px; left: 68%;
  width: 3px; height: 1300px;
  background: linear-gradient(to bottom, #ffffff 0%, #B02525 20%, transparent 100%);
  box-shadow: 0 0 30px 5px rgba(139, 26, 26, 0.6), 0 0 100px 30px rgba(139, 26, 26, 0.2);
  transform: rotate(10deg); filter: blur(1px);
  opacity: 0.3;
  .is-dark & {
    opacity: 1;
    box-shadow: 0 0 30px 5px rgba(139, 26, 26, 0.8), 0 0 100px 30px rgba(139, 26, 26, 0.4);
  }
}
.footer-glow {
  position: absolute; bottom: 0; left: 50%; width: 100vw; height: 500px;
  transform: translateX(-50%);
  background: radial-gradient(ellipse at bottom, rgba(139, 26, 26, 0.05) 0%, transparent 70%);
  z-index: -1; pointer-events: none;
  .is-dark & { background: radial-gradient(ellipse at bottom, rgba(139, 26, 26, 0.2) 0%, transparent 70%); }
}

// --- Navigation ---
.nav-container {
  max-width: 1280px; margin: 0 auto; padding: 32px 24px;
  display: flex; justify-content: space-between; align-items: center;
}
.logo-group {
  display: flex; align-items: center; gap: 8px;
  .logo-icon {
    width: 32px; height: 32px; border-radius: 4px; background-color: $maroon;
    display: flex; align-items: center; justify-content: center;
    color: white; font-size: 12px; font-weight: bold;
    box-shadow: 0 0 10px rgba(139, 26, 26, 0.5);
  }
  .logo-text {
    font-size: 24px; font-weight: bold; letter-spacing: -0.025em;
    color: #121313; .is-dark & { color: white; }
  }
}
.nav-links {
  display: flex; gap: 32px; font-size: 14px; font-weight: 500;
  a {
    text-decoration: none; color: #4B5563; transition: color 0.2s;
    &:hover { color: #111827; .is-dark & { color: white; } }
    .is-dark & { color: #9CA3AF; }
  }
}
.nav-actions {
  display: flex; align-items: center; gap: 24px;
  .sign-in-btn { color: #4B5563; .is-dark & { color: #9CA3AF; } }
  .get-started-btn {
    background: linear-gradient(to right, $maroon, $maroon-light);
    color: white; padding: 10px 24px; border-radius: 9999px;
    box-shadow: 0 0 20px rgba(139, 26, 26, 0.3);
    &:hover { opacity: 0.9; }
  }
}

// --- Hero Section ---
.hero-section {
  max-width: 896px; margin: 0 auto; padding: 80px 24px 64px; text-align: center;
}
.hero-title {
  font-size: 72px; font-weight: bold; letter-spacing: -0.025em; margin-bottom: 24px;
  line-height: 1.1;
  @media (max-width: 600px) { font-size: 48px; }
}
.text-gradient {
  background: linear-gradient(to bottom, #111827 30%, #4B5563 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  .is-dark & { background: linear-gradient(to bottom, #ffffff 30%, #888 100%); }
}
.hero-subtitle {
  font-size: 18px; color: #4B5563; margin-bottom: 40px; max-width: 672px; margin-left: auto; margin-right: auto;
  line-height: 1.625; .is-dark & { color: #9CA3AF; }
}
.hero-btns {
  display: flex; justify-content: center; gap: 16px; margin-bottom: 40px;
  @media (max-width: 600px) { flex-direction: column; align-items: center; }
  .btn-primary-glow {
    background: linear-gradient(to right, $maroon, $maroon-light);
    color: white; padding: 14px 32px; border-radius: 9999px; font-weight: 500;
    box-shadow: 0 0 20px rgba(139, 26, 26, 0.4);
  }
  .btn-secondary-outline {
    background-color: transparent; border-color: rgba(0,0,0,0.1); padding: 14px 32px; border-radius: 9999px; font-weight: 500;
    .is-dark & { background-color: $dark-card; border-color: $dark-border; color: white; &:hover { border-color: #6B7280; } }
  }
}
.hero-badges {
  display: flex; flex-wrap: wrap; justify-content: center; gap: 24px; font-size: 14px; color: #6B7280; font-weight: 500;
  .is-dark & { color: #4B5563; }
}

// --- Mockup Section ---
.mockup-section {
  max-width: 1024px; margin: 0 auto 128px; padding: 0 24px;
}
.mockup-wrapper { position: relative; }
.mockup-glow-border {
  position: absolute; inset: -2px;
  background: linear-gradient(135deg, $maroon-light, $maroon, transparent 50%);
  border-radius: 25.6px; z-index: -1; opacity: 0.1; filter: blur(5px);
  .is-dark & { opacity: 0.8; }
}
.mockup-container {
  height: 600px; width: 100%; display: flex; flex-direction: column; position: relative; overflow: hidden;
  border-radius: 24px; border: 1px solid rgba(0,0,0,0.05); background: white;
  box-shadow: 0 25px 50px -12px rgba(0,0,0,0.1);
  .is-dark & {
    border-color: $dark-border; background: $dark-bg;
    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5), 0 0 100px -20px rgba(139,26,26,0.3);
  }
}
.mockup-toolbar {
  height: 56px; border-bottom: 1px solid rgba(0,0,0,0.05); display: flex; align-items: center; padding: 0 24px; justify-content: space-between;
  background-color: #fff; .is-dark & { background-color: $dark-card; border-color: $dark-border; }
}
.toolbar-left {
  display: flex; align-items: center; gap: 16px;
  .window-controls {
    display: flex; gap: 8px;
    .dot { width: 12px; height: 12px; border-radius: 9999px; }
  }
  .toolbar-brand {
    display: flex; align-items: center; gap: 8px; margin-left: 16px; font-size: 14px; font-weight: 600;
    .mini-logo { width: 16px; height: 16px; border-radius: 2px; background-color: $maroon; color: white; display: flex; align-items: center; justify-content: center; font-size: 8px; }
  }
}
.toolbar-center { font-size: 14px; font-weight: 500; color: #6B7280; .is-dark & { color: #9CA3AF; } }
.toolbar-right {
  display: flex; gap: 16px; color: #9CA3AF; font-size: 14px; align-items: center;
  .user-avatar-placeholder { width: 24px; height: 24px; border-radius: 9999px; background-color: #374151; }
}

.mockup-body { display: flex; flex: 1; overflow: hidden; }
.mockup-sidebar {
  width: 256px; border-right: 1px solid rgba(0,0,0,0.05); padding: 16px; display: flex; flex-direction: column; font-size: 14px;
  background-color: #f9fafb; .is-dark & { border-color: $dark-border; background-color: rgba(10, 12, 13, 0.8); }
}
.sidebar-item {
  padding: 10px 12px; border-radius: 8px; margin-bottom: 4px; display: flex; align-items: center; gap: 12px; color: #6B7280; cursor: pointer; transition: all 0.2s;
  i { font-size: 18px; width: 24px; }
  &.active {
    background-color: $maroon; color: white; box-shadow: 0 0 10px rgba(139, 26, 26, 0.3);
  }
  &:not(.active):hover { background-color: #f3f4f6; .is-dark & { background-color: $dark-card; color: white; } }
}
.sep-bottom { margin-bottom: 24px; }
.sidebar-label { font-size: 12px; font-weight: 600; color: #9CA3AF; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 12px 12px; }
.sidebar-recent {
  font-size: 12px; color: #9CA3AF; padding: 6px 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; cursor: pointer;
  &:hover { color: #4B5563; .is-dark & { color: white; } }
}
.sidebar-upgrade-card {
  margin-top: auto; background-color: #fff; border: 1px solid rgba(0,0,0,0.05); padding: 16px; border-radius: 12px; position: relative; overflow: hidden; cursor: pointer;
  .upgrade-glow { position: absolute; inset: 0; background-color: rgba(139, 26, 26, 0.05); }
  .upgrade-title { font-size: 14px; font-weight: bold; margin-bottom: 4px; position: relative; z-index: 10; display: flex; align-items: center; gap: 8px; }
  .badge-pro { background: linear-gradient(to right, $maroon, #EA580C); color: white; font-size: 10px; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; }
  .upgrade-desc { font-size: 11px; color: #9CA3AF; margin-bottom: 12px; line-height: 1.5; position: relative; z-index: 10; }
  .upgrade-btn { width: 100%; background-color: $maroon; color: white; border: none; font-size: 12px; padding: 8px; border-radius: 9999px; transition: 0.2s; position: relative; z-index: 10; cursor: pointer; &:hover { background-color: $maroon-light; } }
  .is-dark & { background-color: $dark-card; border-color: $dark-border; .upgrade-glow { background-color: rgba(139, 26, 26, 0.1); } }
}

.mockup-content {
  flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 32px; position: relative;
  background-image: radial-gradient(rgba(0,0,0,0.05) 1px, transparent 1px); background-size: 40px 40px;
  .is-dark & { background-image: radial-gradient(rgba(255,255,255,0.02) 1px, transparent 1px); }
}
.chat-interface { text-align: center; width: 100%; max-width: 672px; margin-top: -50px; position: relative; z-index: 10; }
.chat-title { font-size: 24px; font-weight: 600; margin-bottom: 8px; color: #111827; .is-dark & { color: white; } }
.chat-subtitle { font-size: 16px; color: #6B7280; margin-bottom: 8px; .is-dark & { color: #9CA3AF; } }
.chat-help { font-size: 12px; color: #9CA3AF; margin-bottom: 32px; }
.action-grid {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 32px;
  @media (min-width: 768px) { grid-template-columns: repeat(3, 1fr); }
}
.action-pill {
  padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.05); background-color: rgba(255,255,255,0.8); font-size: 11px; color: #4B5563; cursor: pointer; transition: 0.2s; display: flex; align-items: center; gap: 8px;
  i { color: #9CA3AF; }
  &:hover { border-color: #9CA3AF; }
  .is-dark & { background-color: rgba(18, 21, 23, 0.8); border-color: $dark-border; color: #D1D5DB; }
}
.chat-input-wrapper {
  background-color: #fff; border: 1px solid rgba(0,0,0,0.05); border-radius: 12px; padding: 8px; display: flex; align-items: center; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); position: relative;
  .input-glow { position: absolute; top: -12px; left: 16px; width: 90%; height: 16px; background-color: rgba(139, 26, 26, 0.1); filter: blur(20px); border-radius: 9999px; }
  .attach-btn { padding: 0 12px; color: #6B7280; font-size: 12px; display: flex; align-items: center; gap: 4px; cursor: pointer; &:hover { color: #111827; } }
  input { flex: 1; background: transparent; border: none; outline: none; padding: 8px; font-size: 14px; color: #111827; .is-dark & { color: white; } }
  .input-actions { display: flex; gap: 8px; padding-right: 8px; color: #6B7280; align-items: center; }
  .send-btn { width: 32px; height: 32px; border-radius: 8px; background-color: #f3f4f6; display: flex; align-items: center; justify-content: center; cursor: pointer; &:hover { background-color: #e5e7eb; .is-dark & { background-color: #4B5563; } } }
  .is-dark & { background-color: $dark-card; border-color: $dark-border; .input-glow { background-color: rgba(139, 26, 26, 0.2); } .send-btn { background-color: $dark-border; } }
}

// --- Trusted By Section ---
.trusted-section {
  max-width: 1024px; margin: 0 auto 128px; padding: 0 24px; text-align: center;
}
.trusted-label { font-size: 14px; font-weight: 500; color: #4B5563; margin-bottom: 40px; }
.partners-logos {
  display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 40px; opacity: 0.3; transition: 0.5s;
  i { font-size: 30px; }
  .partner-text { font-size: 20px; font-weight: bold; display: flex; align-items: center; gap: 8px; }
  &:hover { opacity: 1; }
  @media (min-width: 768px) { gap: 64px; }
}

// --- Features Section ---
.features-section {
  max-width: 1152px; margin: 0 auto 128px; padding: 0 24px;
}
.section-title { font-size: 36px; font-weight: bold; text-align: center; margin-bottom: 64px; letter-spacing: -0.025em; }
.features-grid {
  display: grid; grid-template-columns: 1fr; gap: 24px;
  @media (min-width: 768px) { grid-template-columns: repeat(5, 1fr); }
}
.feature-card-large {
  grid-column: span 1; background-color: white; border: 1px solid rgba(0,0,0,0.05); border-radius: 20px; padding: 40px; display: flex; flex-direction: column; justify-content: flex-end; position: relative; overflow: hidden; min-height: 450px;
  @media (min-width: 768px) { grid-column: span 3; }
  .mesh-bg { position: absolute; inset: 0; background-image: radial-gradient(rgba(0,0,0,0.05) 1px, transparent 1px); background-size: 40px 40px; }
  .floating-icon { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 112px; height: 64px; border: 1px solid rgba(139, 26, 26, 0.4); border-radius: 9999px; display: flex; align-items: center; justify-content: center; font-size: 20px; background-color: #fff; box-shadow: 0 0 40px rgba(139, 26, 26, 0.3); transition: 0.5s; z-index: 10; }
  &:hover .floating-icon { transform: translate(-50%, -50%) scale(1.1); }
  .feature-info { position: relative; z-index: 20; }
  .feature-brand { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; font-weight: bold; font-size: 18px; .mini-logo { width: 24px; height: 24px; border-radius: 4px; background-color: $maroon; color: white; display: flex; align-items: center; justify-content: center; font-size: 10px; } }
  .feature-heading { font-size: 24px; font-weight: bold; margin-bottom: 8px; }
  .feature-desc { font-size: 14px; color: #6B7280; max-width: 448px; }
  .is-dark & { background-color: $dark-card; border-color: $dark-border; .mesh-bg { background-image: radial-gradient(rgba(255,255,255,0.02) 1px, transparent 1px); } .floating-icon { background-color: $dark-card; color: white; } .feature-desc { color: #9CA3AF; } }
}
.features-stack {
  grid-column: span 1; display: flex; flex-direction: column; gap: 24px;
  @media (min-width: 768px) { grid-column: span 2; }
}
.feature-card-small {
  background-color: white; border: 1px solid rgba(0,0,0,0.05); border-radius: 20px; padding: 32px; flex: 1; display: flex; flex-direction: column; justify-content: flex-end; position: relative; overflow: hidden;
  .glow-accent { position: absolute; width: 160px; height: 160px; background-color: rgba(139, 26, 26, 0.15); filter: blur(48px); border-radius: 9999px; transition: 0.5s; }
  &:hover .glow-accent { background-color: rgba(139, 26, 26, 0.3); }
  &.top-right .glow-accent { top: 0; right: 0; }
  &.bottom-right .glow-accent { bottom: 0; right: 0; }
  .feature-icon-box { margin-bottom: 40px; position: relative; z-index: 10; font-size: 32px; color: $maroon-light; filter: drop-shadow(0 0 15px rgba(139, 26, 26, 0.8)); }
  .feature-icon-row { display: flex; gap: 12px; margin-bottom: 40px; position: relative; z-index: 10; align-items: flex-end; }
  .icon-play { width: 48px; height: 48px; background-color: rgba(139, 26, 26, 0.2); border-radius: 12px; border: 1px solid rgba(139, 26, 26, 0.4); display: flex; align-items: center; justify-content: center; color: $maroon-light; box-shadow: 0 0 15px rgba(139, 26, 26, 0.4); }
  .icon-check { width: 40px; height: 40px; background-color: #f3f4f6; border-radius: 12px; border: 1px solid #d1d5db; display: flex; align-items: center; justify-content: center; color: #6B7280; .is-dark & { background-color: $dark-border; border-color: #374151; color: #9CA3AF; } }
  .feature-heading-sm { font-size: 20px; font-weight: bold; margin-bottom: 8px; position: relative; z-index: 20; }
  .feature-desc-sm { font-size: 14px; color: #6B7280; position: relative; z-index: 20; .is-dark & { color: #9CA3AF; } }
  .is-dark & { background-color: $dark-card; border-color: $dark-border; .glow-accent { background-color: rgba(139, 26, 26, 0.1); } }
}
.section-footer { text-align: center; margin-top: 40px; }
.explore-btn { border-color: rgba(0,0,0,0.1); border-radius: 9999px; font-size: 12px; padding: 8px 24px; .is-dark & { border-color: $dark-border; color: white; &:hover { border-color: #6B7280; } } }

// --- Stats Section ---
.stats-section {
  max-width: 1152px; margin: 0 auto 128px; padding: 0 24px;
}
.stats-grid {
  display: grid; grid-template-columns: 1fr; gap: 24px;
  @media (min-width: 768px) { grid-template-columns: repeat(2, 1fr); }
  @media (min-width: 1024px) { grid-template-columns: repeat(4, 1fr); }
}
.stat-card {
  background-color: white; border: 1px solid rgba(0,0,0,0.05); border-radius: 20px; padding: 40px; display: flex; flex-direction: column; justify-content: flex-end; position: relative; overflow: hidden; min-height: 350px;
  .stat-icon-bg { position: absolute; top: 25%; font-size: 80px; color: $maroon; opacity: 0.1; transition: 0.5s; &.left { left: 25%; } &.right { right: 25%; } }
  &:hover .stat-icon-bg { opacity: 0.3; &.left { transform: scale(1.1) rotate(12deg); } &.right { transform: scale(1.1) rotate(-12deg); } }
  .stat-heading { font-size: 24px; font-weight: bold; margin-bottom: 8px; position: relative; z-index: 10; }
  .stat-desc { font-size: 14px; color: #6B7280; max-width: 320px; position: relative; z-index: 10; .is-dark & { color: #9CA3AF; } }
  .is-dark & { background-color: $dark-card; border-color: $dark-border; .stat-icon-bg { color: $maroon-light; } }
}

// --- Templates Section ---
.templates-section {
  max-width: 1152px; margin: 0 auto 128px; padding: 0 24px;
}
.section-title-sm { font-size: 30px; font-weight: bold; margin-bottom: 16px; letter-spacing: -0.025em; }
.section-subtitle { font-size: 16px; color: #6B7280; margin-bottom: 64px; .is-dark & { color: #9CA3AF; } }
.templates-scroll {
  display: flex; gap: 24px; overflow-x: auto; padding-bottom: 32px; scroll-snap-type: x mandatory;
  &::-webkit-scrollbar { display: none; }
}
.template-card {
  min-width: 320px; background-color: white; border: 1px solid rgba(0,0,0,0.05); border-radius: 20px; padding: 24px; display: flex; flex-direction: column; gap: 24px; scroll-snap-align: center;
  @media (min-width: 768px) { min-width: 450px; flex-direction: row; }
  .template-visual {
    width: 100%; height: 144px; background-color: #0E1012; border-radius: 12px; border: 1px solid rgba(0,0,0,0.1); position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center;
    @media (min-width: 768px) { width: 50%; }
    .visual-glow { position: absolute; inset: 0; background-color: rgba(139, 26, 26, 0.05); transition: 0.3s; }
    .visual-icon { width: 48px; height: 48px; border-radius: 9999px; background-color: rgba(139, 26, 26, 0.2); border: 1px solid rgba(139, 26, 26, 0.4); display: flex; align-items: center; justify-content: center; color: $maroon-light; box-shadow: 0 0 15px rgba(139, 26, 26, 0.5); position: relative; z-index: 10; }
    &.column-style {
      flex-direction: column; gap: 8px;
      .visual-glow-alt { position: absolute; top: 0; right: 0; width: 96px; height: 96px; background-color: rgba(139, 26, 26, 0.15); filter: blur(32px); }
      .mock-item { width: 75%; height: 20px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.1); background-color: rgba(0,0,0,0.2); color: #6B7280; font-size: 9px; display: flex; align-items: center; justify-content: center; gap: 4px; &.active { border-color: rgba(139,26,26,0.3); background-color: rgba(139,26,26,0.05); color: $maroon-light; font-weight: bold; .mini-logo { width: 12px; height: 12px; border-radius: 2px; background-color: $maroon; color: white; font-size: 6px; display: flex; align-items: center; justify-content: center; } } }
    }
  }
  &:hover .visual-glow { background-color: rgba(139, 26, 26, 0.1); }
  .template-info { flex: 1; display: flex; flex-direction: column; justify-content: center; }
  .template-name { font-size: 18px; font-weight: bold; margin-bottom: 8px; }
  .template-desc-sm { font-size: 12px; color: #6B7280; line-height: 1.625; margin-bottom: 16px; .is-dark & { color: #9CA3AF; } }
  .template-tags {
    display: flex; gap: 8px;
    span { font-size: 10px; border: 1px solid rgba(0,0,0,0.05); background-color: #f9fafb; padding: 4px 12px; border-radius: 9999px; color: #4B5563; .is-dark & { background-color: $dark-bg; border-color: $dark-border; color: #D1D5DB; } }
  }
  .is-dark & { background-color: $dark-card; border-color: $dark-border; }
}
.scroll-controls { display: flex; justify-content: center; gap: 12px; margin-top: 16px; }

// --- Testimonials Section ---
.testimonials-section {
  max-width: 1152px; margin: 0 auto 128px; padding: 0 24px;
}
.masonry-layout {
  column-count: 1; column-gap: 24px;
  @media (min-width: 768px) { column-count: 2; }
  @media (min-width: 1024px) { column-count: 3; }
}
.testimonial-card {
  break-inside: avoid; margin-bottom: 24px; background-color: white; border: 1px solid rgba(0,0,0,0.05); border-radius: 20px; padding: 32px; display: flex; flex-direction: column;
  .quote-icon { font-size: 24px; color: $maroon; opacity: 0.6; margin-bottom: 24px; filter: drop-shadow(0 0 5px rgba(139, 26, 26, 0.5)); }
  .testimonial-text { font-size: 14px; color: #4B5563; line-height: 1.625; margin-bottom: 32px; .is-dark & { color: #D1D5DB; } }
  .author-info { display: flex; align-items: center; gap: 16px; }
  .author-avatar { width: 40px; height: 40px; border-radius: 9999px; background-color: #374151; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; }
  .author-name { font-size: 14px; font-weight: bold; }
  .author-role { font-size: 12px; color: #6B7280; .is-dark & { color: #4B5563; } }
  .is-dark & { background-color: $dark-card; border-color: $dark-border; }
}

// --- Pricing Section ---
.pricing-section {
  max-width: 1152px; margin: 0 auto 128px; padding: 0 24px;
}
.pricing-grid {
  display: grid; grid-template-columns: 1fr; gap: 32px; max-width: 1024px; margin: 0 auto;
  @media (min-width: 768px) { grid-template-columns: repeat(3, 1fr); }
}
.price-card {
  background-color: white; border: 1px solid rgba(0,0,0,0.05); border-radius: 20px; padding: 32px; display: flex; flex-direction: column; min-height: 500px;
  .price-header { margin-bottom: 24px; i { font-size: 24px; color: #6B7280; margin-bottom: 16px; } }
  .tier-name { font-size: 20px; font-weight: bold; margin-bottom: 4px; }
  .tier-desc { font-size: 12px; color: #6B7280; .is-dark & { color: #4B5563; } }
  .tier-price { font-size: 48px; font-weight: bold; margin-bottom: 32px; .price-unit { font-size: 14px; font-weight: normal; color: #6B7280; } }
  .price-btn-outline { width: 100%; border: 1px solid rgba(0,0,0,0.1); background-color: #f9fafb; padding: 10px; border-radius: 9999px; font-weight: 500; margin-bottom: 32px; .is-dark & { background-color: $dark-bg; border-color: $dark-border; color: white; &:hover { background-color: #1f2937; } } }
  .price-btn-primary { width: 100%; background: linear-gradient(to right, $maroon, $maroon-light); color: white; padding: 10px; border-radius: 9999px; font-weight: 500; margin-bottom: 32px; box-shadow: 0 0 20px rgba(139, 26, 26, 0.4); }
  .tier-features { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 16px; font-size: 14px; color: #4B5563; flex: 1; i { margin-right: 12px; font-size: 16px; } .is-dark & { color: #9CA3AF; } }

  &.featured {
    border-color: rgba(139, 26, 26, 0.6); min-height: 520px; transform: translateY(-16px); box-shadow: 0 20px 50px rgba(139, 26, 26, 0.15); position: relative; overflow: hidden;
    @media (max-width: 768px) { transform: none; }
    .card-glow-center { position: absolute; top: 0; right: 0; width: 256px; height: 256px; background-color: rgba(139, 26, 26, 0.2); filter: blur(60px); border-radius: 9999px; transform: translate(25%, -25%); pointer-events: none; }
    .tier-desc { color: #9CA3AF; }
    .tier-features { color: #D1D5DB; }
  }
  .is-dark & { background-color: $dark-card; border-color: $dark-border; }
}

// --- Footer ---
.footer {
  padding: 96px 0 48px; border-top: 1px solid rgba(0,0,0,0.05); margin-top: 80px; position: relative;
  .is-dark & { border-color: $dark-border; }
}
.footer-container {
  max-width: 1152px; margin: 0 auto; padding: 0 24px; display: grid; grid-template-columns: 1fr; gap: 48px;
  @media (min-width: 768px) { grid-template-columns: repeat(4, 1fr); }
}
.footer-brand-side {
  @media (min-width: 768px) { grid-column: span 2; }
  .footer-tagline { font-size: 14px; color: #6B7280; max-width: 320px; line-height: 1.625; margin-top: 24px; }
}
.footer-links-side {
  display: contents;
  .link-col {
    display: flex; flex-direction: column; gap: 12px;
    h4 { font-size: 16px; font-weight: 600; margin: 0 0 12px; }
    a { text-decoration: none; color: #6B7280; font-size: 14px; transition: 0.2s; &:hover { color: #111827; .is-dark & { color: white; } } }
  }
}

// --- Utility ---
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.max-w-672 { max-width: 672px; }
</style>
