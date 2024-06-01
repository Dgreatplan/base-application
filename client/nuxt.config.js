export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  router: {
    middleware: ['mw']
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Web Portal',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/logo.png' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'ant-design-vue/dist/antd.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/antd-ui',
    { src: "@/plugins/mixins" }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    'nuxt-breakpoints',
    '@nuxtjs/axios',
    '@nuxtjs/auth'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: process.env.API_BASE_URL || "http://localhost:5001/api",
    headers: {
      common: {
        'token': 's3cretKey',
      },
    },
  },

  auth: {
    redirect: {
      login: '/',
      logout: '/logout',
      home: '/app',
    },
    strategies: {
      local: {
        endpoints: {
          login: { url: '/auth', method: 'post', propertyName: "data.token" },
          logout: false,
          user: { url: '/auth/get-user', method: 'get', propertyName: "data" }
        }
      }
    },
  },

  loading: {
    color: "#f5e342",
    height: "2px",
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },

  breakpoints: {
    xs: 575,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
  },
}
