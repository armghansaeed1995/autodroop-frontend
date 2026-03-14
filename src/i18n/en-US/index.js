export default {
  common: {
    support: 'Support',
    viewAll: 'View All',
    used: 'Used',
    total: 'Total',
    documentation: 'Documentation',
    tutorials: 'Tutorials',
    community: 'Community',
    cancel: 'Cancel',
    save: 'Save',
    statuses: {
      paid: 'Paid',
      pending: 'Pending',
      cancelled: 'Cancelled'
    }
  },
  customerDashboard: {
    welcome: 'Welcome back',
    subtitle: 'Here is an overview of your account and recent activity.',
    currentPlan: 'Current Plan',
    renewsOn: 'Renews on',
    upgradePlan: 'Upgrade Plan',
    manageBilling: 'Manage Billing',
    storageUsed: 'Storage Used (GB)',
    apiCalls: 'API Calls',
    recentInvoices: 'Recent Invoices',
    quickLinks: 'Quick Links',
    fetchingData: 'Fetching dashboard data...',
    totalSales: 'Total Sales',
    totalOrders: 'Total Orders',
    activeListings: 'Active Listings',
    notifications: {
      accountPending: 'Your account is pending. Please select a package.',
      sessionExpired: 'Session expired or no user data found. Please log in again.',
      fetchCustomerError: 'Failed to fetch customer details.',
      fetchStatsError: 'Failed to fetch dashboard statistics.'
    }
  },
  layout: {
    admin: 'Admin',
    panel: 'Panel',
    logout: 'Logout',
    mainMenu: 'Main Menu',
    system: 'System',
    menu: 'Menu',
    language: 'Language',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    more: 'More',
    nav: {
      dashboard: 'My Dashboard',
      productDrafts: 'Product Drafts',
      inventory: 'Inventory',
      orders: 'Orders',
      messages: 'Messages',
      messageTemplates: 'Message Templates',
      suppliers: 'Suppliers',
      settings: 'Settings',
      ebayAccounts: 'eBay Accounts',
      supplierAccounts: 'Supplier Accounts',
      preferences: 'Preferences & Tools',
      billing: 'Profile & Billing'
    },
    adminNav: {
      dashboard: 'Dashboard',
      customers: 'Customers',
      regions: 'Global Regions',
      templates: 'Global Templates',
      keywords: 'Restricted Keywords',
      packages: 'Packages',
      settings: 'Settings',
      design: 'Design System'
    }
  },
  productDrafts: {
    title: 'Product Drafts',
    subtitle: 'Optimize and prepare your listings before publishing to eBay.',
    allDrafts: 'All Drafts',
    addAsinList: 'Add ASIN List',
    importCsv: 'Import CSV',
    columns: {
      product: 'Product',
      uploadDate: 'Upload Date',
      region: 'Region',
      stock: 'Stock',
      price: 'Price (BUY/SELL)',
      profit: 'Profit',
      itemId: 'ItemID / ASIN',
      actions: 'Actions'
    },
    tooltips: {
      publish: 'Publish to eBay',
      edit: 'Edit Draft',
      delete: 'Delete'
    },
    bulkActions: {
      selected: 'Drafts Selected',
      upload: 'Upload Drafts',
      delete: 'Delete',
      schedule: 'Schedule',
      changeAccount: 'Change eBay Account'
    },
    importDialog: {
      title: 'Import from Amazon ASINs',
      subtitle: 'Enter one ASIN per line. Products will be imported as drafts for the selected region.',
      region: 'Region',
      targetAccount: 'Target eBay Account',
      startImport: 'Start Import'
    },
    accountSelector: {
      title: 'Select eBay Account',
      label: 'eBay Account',
      apply: 'Apply to Selected'
    },
    notifications: {
      fetchError: 'Failed to fetch drafts',
      importSuccess: 'Successfully queued {count} ASINs for import.',
      importError: 'Import failed.',
      publishConfirm: 'This will move the product to inventory and upload it to the live eBay store. Continue?',
      publishLabel: 'Publish',
      publishStarted: 'Publishing started.',
      publishError: 'Publish failed.',
      bulkPublishTitle: 'Bulk Publish',
      bulkPublishConfirm: 'Publish {count} products to eBay?',
      publishAll: 'Publish All',
      bulkPublishStarted: 'Bulk publishing started.',
      deleteConfirmTitle: 'Confirm Delete',
      deleteConfirmMsg: 'Are you sure you want to permanently delete {count} drafts?',
      deleteAll: 'Delete All',
      deleteSuccess: 'Drafts deleted.',
      accountUpdatedSim: 'Account updated for selected drafts (Simulated)'
    }
  },
  inventory: {
    title: 'Inventory Management',
    subtitle: 'Monitor performance, optimize listings, and manage sponsorships.',
    advancedFilters: 'Advanced Filters',
    refreshPerformance: 'Refresh Performance',
    stats: {
      totalListings: 'Total Listings',
      highDws: 'High DWS (>30)',
      sponsoredItems: 'Sponsored Items',
      monthlyViews: 'Monthly Views'
    },
    filters: {
      searchPlaceholder: 'Search Title, Listing ID...',
      region: 'Region',
      status: 'Status',
      minViews: 'Min Views',
      maxDws: 'Max DWS',
      sponsoredOnly: 'Sponsored Only',
      reset: 'Reset',
      apply: 'Apply Filters'
    },
    columns: {
      product: 'Product & Store',
      performance: 'Performance (Monthly)',
      stock: 'Stock',
      price: 'Price (SELL)',
      profit: 'Profit (Net/ADV)',
      status: 'Status',
      actions: 'Actions'
    },
    metrics: {
      dws: 'DWS',
      views: 'Views',
      impressions: 'Imp.',
      net: 'NET:',
      adv: 'ADV:',
      noSponsorship: 'No Sponsorship',
      pending: 'PENDING',
      sponsored: 'SPONSORED'
    },
    tooltips: {
      sponsor: 'Sponsor Listing',
      edit: 'Edit Details',
      delete: 'Delete Listing'
    },
    bulkActions: {
      selected: 'Items Selected',
      sponsor: 'Bulk Sponsor',
      edit: 'Bulk Edit',
      delete: 'Bulk Delete',
      removeSponsor: 'Remove Sponsorship'
    },
    sponsorDialog: {
      title: 'Sponsor Listing',
      subtitle: 'Set your eBay Promoted Listings ad rate. This percentage will be deducted from your sale price upon successful sale via promotion.',
      adRate: 'Ad Rate (%)',
      hint: 'Recommended: 2.0% - 10.0%',
      apply: 'Apply Sponsorship'
    },
    editDialog: {
      title: 'Edit Listing Details',
      fieldTitle: 'Title',
      price: 'Selling Price',
      stock: 'Stock Quantity',
      description: 'Description',
      save: 'Save Changes'
    },
    bulkEditDialog: {
      title: 'Bulk Price Adjustment',
      subtitle: 'Adjust the selling price of {count} items by a percentage or fixed amount.',
      type: 'Adjustment Type',
      value: 'Value',
      apply: 'Apply Bulk Changes',
      options: {
        percent: 'Percentage (%)',
        fixed: 'Fixed Amount (€)'
      }
    },
    notifications: {
      fetchError: 'Failed to fetch inventory',
      applyingSponsor: 'Applying sponsorship on eBay...',
      sponsorSuccess: 'Successfully sponsored {count} listings.',
      sponsorError: 'Failed to apply sponsorship.',
      deleteConfirm: 'Are you sure you want to delete "{title}"? This will attempt to remove the listing from eBay.',
      deleteStarted: 'Listing deletion queued.',
      deleteError: 'Failed to delete listing.',
      bulkDeleteConfirm: 'Delete {count} listings from inventory and eBay?',
      bulkDeleteStarted: 'Bulk deletion queued.',
      bulkDeleteError: 'Bulk deletion failed.',
      savingSync: 'Saving changes and syncing with eBay...',
      updateSuccess: 'Listing updated successfully.',
      updateError: 'Failed to update listing.',
      applyingBulk: 'Applying bulk updates...',
      bulkUpdateSuccess: 'Bulk updated {count} listings.',
      bulkUpdateError: 'Bulk update failed.',
      removeSponsorConfirm: 'Remove Promoted Listings sponsorship from {count} items?',
      removeSponsorStarted: 'Sponsorship removal queued.',
      removeSponsorError: 'Failed to remove sponsorship.'
    }
  },
  orders: {
    title: 'Orders List',
    subtitle: 'View and manage all customer orders.',
    tabs: {
      all: 'All',
      pending: 'Pending',
      ordered: 'Ordered',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled'
    },
    filters: {
      searchPlaceholder: 'Search orders...',
      updateOrders: 'Update Orders'
    },
    columns: {
      product: 'Product',
      status: 'Status',
      priceProfit: 'Price & Profit',
      itemIds: 'Item IDs',
      orderDate: 'Order Date',
      actions: 'Actions'
    },
    details: {
      noTitle: 'No Title Available',
      sku: 'SKU:',
      qty: 'Qty:',
      trackingIssue: 'Tracking Issue',
      sell: 'SELL:',
      buy: 'BUY:',
      profit: 'PROFIT:',
      est: 'Est:',
      viewDetails: 'View Details',
      fulfillOrder: 'Fulfill Order',
      messageBuyer: 'Message Buyer',
      cancelOrder: 'Cancel Order'
    },
    modal: {
      orderNum: 'Order #{id}',
      items: 'Items',
      itemId: 'Item ID:',
      quantity: 'Quantity:',
      statusHistory: 'Status History',
      noHistory: 'No history available',
      historySubtitle: 'Status history will appear here as the order progresses.',
      buyerInfo: 'Buyer Information',
      name: 'Name:',
      username: 'Username:',
      phone: 'Phone:',
      shippingAddress: 'Shipping Address',
      financialSummary: 'Financial Summary',
      totalSell: 'Order Total (Sell)',
      costBuy: 'Purchase Cost (Buy)',
      ebayFees: 'eBay Fees',
      estProfit: 'Estimated Profit'
    },
    notifications: {
      fetchCountError: 'Failed to fetch pending order count:',
      fetchOrdersError: 'Failed to fetch orders.',
      syncSuccess: 'Orders synchronized successfully.',
      fulfillStarted: 'Starting fulfillment for Order: {id}',
      openingMessenger: 'Opening messenger for: {id}',
      cancelConfirm: 'Are you sure you want to cancel order #{id}? This will also attempt to cancel it on eBay.',
      cancelSent: 'Cancellation request sent for order #{id}'
    }
  },
  landing: {
    nav: {
      product: 'Product',
      templates: 'Templates',
      integrations: 'Integrations',
      docs: 'Docs',
      pricing: 'Pricing',
      signIn: 'Sign In',
      getStarted: 'Get Started'
    },
    hero: {
      title: 'Automate your eBay Dropshipping without limits.',
      subtitle: 'Create no-code workflows, sync inventory instantly, and connect suppliers seamlessly with one powerful visual platform.',
      startFree: 'Start For Free',
      howItWorks: 'How It Works',
      noCreditCard: 'No credit card required',
      readyToScale: 'Ready to scale',
      freeForever: 'Free trial available'
    },
    mockup: {
      aiAssistant: 'AI Price Optimizer',
      heyThere: 'Welcome back, Power Seller!',
      whatToAutomate: 'What do you want to optimize today?',
      helpText: 'I can help you build policies, connect new regions, or scale your inventory across global eBay markets.',
      actions: {
        createWorkflow: 'Create a policy',
        connectSuppliers: 'Connect Amazon & AliExpress',
        generateReport: 'Daily profit summary',
        sendDigest: 'Inventory sync report',
        organizeFiles: 'Bulk upload ASINs',
        suggestIdeas: 'Suggested regions'
      },
      attach: 'Attach',
      upgradePro: 'Upgrade to',
      pro: 'PRO',
      proDescription: 'Unlock advanced automations, priority syncs & premium regions.',
      learnMore: 'Learn More'
    },
    trustedBy: 'Trusted by 10,000+ dropshippers to run their daily stores',
    features: {
      title: 'Automate your store in minutes',
      connectTools: {
        title: 'Connect your stores',
        description: 'Easily link all your eBay accounts, from UK and IT to US and beyond.'
      },
      buildVisually: {
        title: 'Build with Mother Templates',
        description: 'Create master policies once and inherit them across all regions. No redundant work.'
      },
      runScale: {
        title: 'Run and scale',
        description: 'Launch products instantly and let our system handle stock and price changes.'
      }
    },
    stats: {
      integrations: '100+ Suppliers',
      integrationsDesc: 'Connect with Amazon, AliExpress, and local regional suppliers.',
      visualEditor: 'Mother Template System',
      visualEditorDesc: 'The ultimate way to manage global eBay policies.',
      smartTriggers: 'Smart Price Monitoring',
      smartTriggersDesc: 'Automatically adjust prices when supplier costs change.',
      selfHost: 'Cloud Automation',
      selfHostDesc: 'Everything runs on our secure, high-speed cloud infrastructure.'
    },
    templates: {
      title: 'Start faster with regional templates',
      subtitle: 'Jump right in with ready-to-use policies for Italy, UK, USA, and Germany.',
      marketing: 'Regional Setup',
      marketingDesc: 'Auto-configure shipping, payments, and returns for the Italian market.',
      leadGen: 'Inventory Import',
      leadGenDesc: 'Import thousands of products from Amazon with optimized eBay titles.',
      tags: {
        italy: 'Italy',
        uk: 'UK',
        inventory: 'Inventory',
        import: 'Import'
      }
    },
    testimonials: {
      title: 'Loved by sellers who scale smarter',
      subtitle: 'Real stories from teams who simplified complex eBay management and saved hours every week.',
      emma: '"AutoDroop completely changed how we handle inventory. What took hours now happens automatically."',
      hannah: '"We connected 5 stores in one day and fully automated tracking — an incredible time saver."',
      laura: '"We automated our price monitoring in a weekend. It\'s reliable, fast, and easy to scale."',
      sofia: '"The Mother Template system is so intuitive that we can manage 10 regions with one person."',
      michael: '"As a power seller, I love the combination of simplicity and control over pricing tiers."',
      david: '"Our entire order fulfillment runs through AutoDroop. We\'ve reduced errors by 90%."'
    },
    pricing: {
      title: 'Choose What Fits You',
      subtitle: 'Choose the plan that suits your dropshipping volume best.',
      free: {
        name: 'Trial',
        desc: 'Perfect for testing',
        price: '0',
        features: ['14-Day Free Trial', '1 eBay Account', '50 Product Drafts', 'Community Support']
      },
      pro: {
        name: 'Professional',
        desc: 'For growing sellers',
        price: '29',
        features: ['5 eBay Accounts', 'Unlimited Products', 'Priority Stock Sync', 'Bulk Price Updater']
      },
      enterprise: {
        name: 'Elite',
        desc: 'For dropshipping empires',
        price: '79',
        features: ['Unlimited eBay Accounts', 'Multi-User Access', 'Dedicated Account Manager', 'Custom API Access']
      },
      cta: {
        free: 'Start Trial',
        pro: 'Get Started',
        enterprise: 'Contact Sales'
      }
    },
    footer: {
      tagline: 'Automate anything. Connect everything. Build your eBay empire without limits.',
      product: 'Product',
      company: 'Company'
    }
  }
}
