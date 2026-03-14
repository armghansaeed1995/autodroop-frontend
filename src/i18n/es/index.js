export default {
  common: {
    support: 'Soporte',
    viewAll: 'Ver Todo',
    used: 'Usado',
    total: 'Total',
    documentation: 'Documentación',
    tutorials: 'Tutoriales',
    community: 'Comunidad',
    cancel: 'Cancelar',
    save: 'Guardar',
    statuses: {
      paid: 'Pagado',
      pending: 'Pendiente',
      cancelled: 'Cancelado'
    }
  },
  customerDashboard: {
    welcome: 'Bienvenido de nuevo',
    subtitle: 'Aquí tienes un resumen de tu cuenta y actividad reciente.',
    currentPlan: 'Plan Actual',
    renewsOn: 'Se renueva el',
    upgradePlan: 'Mejorar Plan',
    manageBilling: 'Gestionar Facturación',
    storageUsed: 'Almacenamiento Usado (GB)',
    apiCalls: 'Llamadas a la API',
    recentInvoices: 'Facturas Recientes',
    quickLinks: 'Enlaces Rápidos',
    fetchingData: 'Obteniendo datos del panel...',
    totalSales: 'Ventas Totales',
    totalOrders: 'Pedidos Totales',
    activeListings: 'Anuncios Activos',
    notifications: {
      accountPending: 'Su cuenta está pendiente. Por favor, seleccione un paquete.',
      sessionExpired: 'La sesión ha expirado o no se han encontrado datos de usuario. Por favor, inicie sesión de nuevo.',
      fetchCustomerError: 'Error al obtener los detalles del cliente.',
      fetchStatsError: 'Error al obtener las estadísticas del panel.'
    }
  },
  layout: {
    admin: 'Panel de',
    panel: 'Control',
    logout: 'Cerrar Sesión',
    mainMenu: 'Menú Principal',
    system: 'Sistema',
    menu: 'Menú',
    language: 'Idioma',
    darkMode: 'Modo Oscuro',
    lightMode: 'Modo Claro',
    more: 'Más',
    nav: {
      dashboard: 'Mi Panel',
      productDrafts: 'Borradores de Productos',
      inventory: 'Inventario',
      orders: 'Pedidos',
      messages: 'Mensajes',
      messageTemplates: 'Plantillas de Mensajes',
      suppliers: 'Proveedores',
      settings: 'Configuración',
      ebayAccounts: 'Cuentas de eBay',
      supplierAccounts: 'Cuentas de Proveedor',
      preferences: 'Preferencias y Herramientas',
      billing: 'Perfil y Facturación'
    },
    adminNav: {
      dashboard: 'Panel',
      customers: 'Clientes',
      regions: 'Regiones Globales',
      templates: 'Plantillas Globales',
      keywords: 'Palabras Restringidas',
      packages: 'Paquetes',
      settings: 'Configuración',
      design: 'Sistema de Diseño'
    }
  },
  productDrafts: {
    title: 'Borradores de Productos',
    subtitle: 'Optimice y prepare sus anuncios antes de publicarlos en eBay.',
    allDrafts: 'Todos los Borradores',
    addAsinList: 'Añadir Lista de ASIN',
    importCsv: 'Importar CSV',
    columns: {
      product: 'Producto',
      uploadDate: 'Fecha de Carga',
      region: 'Región',
      stock: 'Stock',
      price: 'Precio (COMPRA/VENTA)',
      profit: 'Beneficio',
      itemId: 'ItemID / ASIN',
      actions: 'Acciones'
    },
    tooltips: {
      publish: 'Publicar en eBay',
      edit: 'Editar Borrador',
      delete: 'Eliminar'
    },
    bulkActions: {
      selected: 'Borradores Seleccionados',
      upload: 'Subir Borradores',
      delete: 'Eliminar',
      schedule: 'Programar',
      changeAccount: 'Cambiar Cuenta de eBay'
    },
    importDialog: {
      title: 'Importar desde ASINs de Amazon',
      subtitle: 'Introduzca un ASIN por línea. Los productos se importarán como borradores para la región seleccionada.',
      region: 'Región',
      targetAccount: 'Cuenta de eBay de Destino',
      startImport: 'Iniciar Importación'
    },
    accountSelector: {
      title: 'Seleccionar Cuenta de eBay',
      label: 'Cuenta de eBay',
      apply: 'Aplicar a Seleccionados'
    },
    notifications: {
      fetchError: 'Error al obtener los borradores',
      importSuccess: 'Se han puesto en cola {count} ASINs para importar con éxito.',
      importError: 'Error en la importación.',
      publishConfirm: 'Esto moverá el producto al inventario y lo subirá a la tienda de eBay en vivo. ¿Continuar?',
      publishLabel: 'Publicar',
      publishStarted: 'Publicación iniciada.',
      publishError: 'Error en la publicación.',
      bulkPublishTitle: 'Publicación masiva',
      bulkPublishConfirm: '¿Publicar {count} productos en eBay?',
      publishAll: 'Publicar Todo',
      bulkPublishStarted: 'Publicación masiva iniciada.',
      deleteConfirmTitle: 'Confirmar eliminación',
      deleteConfirmMsg: '¿Está seguro de que desea eliminar permanentemente {count} borradores?',
      deleteAll: 'Eliminar Todo',
      deleteSuccess: 'Borradores eliminados.',
      accountUpdatedSim: 'Cuenta actualizada para los borradores seleccionados (Simulado)'
    }
  },
  inventory: {
    title: 'Gestión de Inventario',
    subtitle: 'Supervise el rendimiento, optimice los anuncios y gestione los patrocinios.',
    advancedFilters: 'Filtros Avanzados',
    refreshPerformance: 'Actualizar Rendimiento',
    stats: {
      totalListings: 'Anuncios Totales',
      highDws: 'DWS Alto (>30)',
      sponsoredItems: 'Artículos Patrocinados',
      monthlyViews: 'Vistas Mensuales'
    },
    filters: {
      searchPlaceholder: 'Buscar Título, ID de Anuncio...',
      region: 'Región',
      status: 'Estado',
      minViews: 'Vistas Mín.',
      maxDws: 'DWS Máx.',
      sponsoredOnly: 'Solo Patrocinados',
      reset: 'Restablecer',
      apply: 'Aplicar Filtros'
    },
    columns: {
      product: 'Producto y Tienda',
      performance: 'Rendimiento (Mensual)',
      stock: 'Stock',
      price: 'Precio (VENTA)',
      profit: 'Beneficio (Neto/ADV)',
      status: 'Estado',
      actions: 'Acciones'
    },
    metrics: {
      dws: 'DWS',
      views: 'Vistas',
      impressions: 'Imp.',
      net: 'NETO:',
      adv: 'ADV:',
      noSponsorship: 'Sin Patrocinio',
      pending: 'PENDIENTE',
      sponsored: 'PATROCINADO'
    },
    tooltips: {
      sponsor: 'Patrocinar Anuncio',
      edit: 'Editar Detalles',
      delete: 'Eliminar Anuncio'
    },
    bulkActions: {
      selected: 'Artículos Seleccionados',
      sponsor: 'Patrocinio Masivo',
      edit: 'Edición Masiva',
      delete: 'Eliminación Masiva',
      removeSponsor: 'Eliminar Patrocinio'
    },
    sponsorDialog: {
      title: 'Patrocinar Anuncio',
      subtitle: 'Establezca su tasa de anuncios patrocinados de eBay. Este porcentaje se deducirá de su precio de venta tras una venta exitosa a través de la promoción.',
      adRate: 'Tasa de Anuncio (%)',
      hint: 'Recomendado: 2.0% - 10.0%',
      apply: 'Aplicar Patrocinio'
    },
    editDialog: {
      title: 'Editar Detalles del Anuncio',
      fieldTitle: 'Título',
      price: 'Precio de Venta',
      stock: 'Cantidad de Stock',
      description: 'Descripción',
      save: 'Guardar Cambios'
    },
    bulkEditDialog: {
      title: 'Ajuste de Precio Masivo',
      subtitle: 'Ajuste el precio de venta de {count} artículos por un porcentaje o una cantidad fija.',
      type: 'Tipo de Ajuste',
      value: 'Valor',
      apply: 'Aplicar Cambios Masivos',
      options: {
        percent: 'Porcentaje (%)',
        fixed: 'Cantidad Fija (€)'
      }
    },
    notifications: {
      fetchError: 'Error al obtener el inventario',
      applyingSponsor: 'Aplicando patrocinio en eBay...',
      sponsorSuccess: 'Se han patrocinado {count} anuncios con éxito.',
      sponsorError: 'Error al aplicar el patrocinio.',
      deleteConfirm: '¿Está seguro de que desea eliminar "{title}"? Esto intentará eliminar el anuncio de eBay.',
      deleteStarted: 'Eliminación del anuncio en cola.',
      deleteError: 'Error al eliminar el anuncio.',
      bulkDeleteConfirm: '¿Eliminar {count} anuncios del inventario y de eBay?',
      bulkDeleteStarted: 'Eliminación masiva en cola.',
      bulkDeleteError: 'Error en la eliminación masiva.',
      savingSync: 'Guardando cambios y sincronizando con eBay...',
      updateSuccess: 'Anuncio actualizado con éxito.',
      updateError: 'Error al actualizar el anuncio.',
      applyingBulk: 'Aplicando actualizaciones masivas...',
      bulkUpdateSuccess: 'Se han actualizado {count} anuncios masivamente.',
      bulkUpdateError: 'Error en la actualización masiva.',
      removeSponsorConfirm: '¿Eliminar el patrocinio de anuncios promocionados de {count} artículos?',
      removeSponsorStarted: 'Eliminación de patrocinio en cola.',
      removeSponsorError: 'Error al eliminar el patrocinio.'
    }
  },
  orders: {
    title: 'Lista de Pedidos',
    subtitle: 'Vea y gestione todos los pedidos de los clientes.',
    tabs: {
      all: 'Todos',
      pending: 'Pendientes',
      ordered: 'Pedido',
      shipped: 'Enviado',
      delivered: 'Entregado',
      cancelled: 'Cancelado'
    },
    filters: {
      searchPlaceholder: 'Buscar pedidos...',
      updateOrders: 'Actualizar Pedidos'
    },
    columns: {
      product: 'Producto',
      status: 'Estado',
      priceProfit: 'Precio y Beneficio',
      itemIds: 'IDs de Artículos',
      orderDate: 'Fecha del Pedido',
      actions: 'Acciones'
    },
    details: {
      noTitle: 'Sin Título Disponible',
      sku: 'SKU:',
      qty: 'Cant:',
      trackingIssue: 'Problema de Seguimiento',
      sell: 'VENTA:',
      buy: 'COMPRA:',
      profit: 'BENEFICIO:',
      est: 'Est:',
      viewDetails: 'Ver Detalles',
      fulfillOrder: 'Cumplir Pedido',
      messageBuyer: 'Mensaje al Comprador',
      cancelOrder: 'Cancelar Pedido'
    },
    modal: {
      orderNum: 'Pedido #{id}',
      items: 'Artículos',
      itemId: 'ID de Artículo:',
      quantity: 'Cantidad:',
      statusHistory: 'Historial de Estados',
      noHistory: 'No hay historial disponible',
      historySubtitle: 'El historial de estados aparecerá aquí a medida que el pedido avance.',
      buyerInfo: 'Información del Comprador',
      name: 'Nombre:',
      username: 'Usuario:',
      phone: 'Teléfono:',
      shippingAddress: 'Dirección de Envío',
      financialSummary: 'Resumen Financiero',
      totalSell: 'Total del Pedido (Venta)',
      costBuy: 'Coste de Compra (Compra)',
      ebayFees: 'Comisiones de eBay',
      estProfit: 'Beneficio Estimado'
    },
    notifications: {
      fetchCountError: 'Error al obtener el recuento de pedidos pendientes:',
      fetchOrdersError: 'Error al obtener los pedidos.',
      syncSuccess: 'Pedidos sincronizados con éxito.',
      fulfillStarted: 'Iniciando cumplimiento para el Pedido: {id}',
      openingMessenger: 'Abriendo mensajero para: {id}',
      cancelConfirm: '¿Está seguro de que desea cancelar el pedido #{id}? Esto también intentará cancelarlo en eBay.',
      cancelSent: 'Solicitud de cancelación enviada para el pedido #{id}'
    }
  }
}
