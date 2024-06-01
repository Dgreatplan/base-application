<template>
    <a-layout id="components-layout-demo-top-side-2">
        <a-layout-header class="header">
            <a-row type="flex" align="middle" justify="space-between">
                <a-col>
                    <div style="padding: 20px; display: flex; align-items: center; gap: 14px;">
                        <!-- <img src="@/assets/images/logo.png" height="40" width="40" alt="Logo" style="background: #0d1117; border-radius: 50%; padding: 10px"> -->
                        <h2 style="color: #fff">Base Application</h2>
                    </div>
                </a-col>
                <a-col v-if="$breakpoints.current === 'xs'">
                    <a-icon type="menu" class="menu-icon" @click="showMenu = true" />
                </a-col>
            </a-row>
        </a-layout-header>
        <a-layout>
            <a-layout-sider width="250" class="light" style="background: #fff;" v-model="collapsed" collapsible v-if="$breakpoints.current !== 'xs'">
                <a-row type="flex" justify="center" align="middle" :gutter="10" style="padding: 20px 20px 0 20px;">
                    <a-col>
                        <a-avatar icon="user"></a-avatar>
                    </a-col>
                    <a-col v-if="showTitle">
                        <a-row>
                            <a-col>
                                <h4 style="line-height: 10px; margin-top: 12px;">{{  }}</h4>
                            </a-col>
                            <a-col>
                                <p style="line-height: 8px;">{{ $auth?.user?.role?.name }}</p>
                            </a-col>
                        </a-row>
                    </a-col>
                </a-row>
                <a-divider />
                <a-menu theme="light" :default-selected-keys="selectedMenu" mode="inline" @click="navigate">
                    <a-menu-item v-for="menu in filteredMenu" :key="menu?.path">
                        <a-icon :type="menu?.icon" style="font-size: 16px" />
                        <span>{{ menu?.name }}</span>
                        <!-- <a-badge count="1" v-if="menu.path === '/app/surveys'" /> -->
                    </a-menu-item>
                </a-menu>
            </a-layout-sider>
            <a-layout :style="`${$breakpoints.sSm ? 'padding: 0 10px 10px 10px;' : 'padding: 0 24px 24px'}`">
                <a-breadcrumb style="margin: 16px 0">
                    <a-breadcrumb-item v-for="(breadcrumb, index) in path" :key="index">
                        {{ breadcrumb }}
                    </a-breadcrumb-item>
                </a-breadcrumb>
                <a-layout-content
                    :style="{ minHeight: '280px' }"
                >
                    <nuxt />
                </a-layout-content>
            </a-layout>
        </a-layout>

        <a-drawer :visible="showMenu" @close="showMenu = false" class="menu-drawer">
            <a-row type="flex" justify="center" align="middle" :gutter="10" style="padding: 20px 20px 0 20px;">
                <a-col>
                    <a-avatar icon="user"></a-avatar>
                </a-col>
                <a-col v-if="showTitle">
                    <a-row>
                        <a-col>
                            <h4 style="line-height: 10px; margin-top: 12px;">{{  }}</h4>
                        </a-col>
                        <a-col>
                            <p style="line-height: 8px;">{{ $auth?.user?.role?.name }}</p>
                        </a-col>
                    </a-row>
                </a-col>
            </a-row>
            <a-divider />
            <a-menu theme="light" :default-selected-keys="selectedMenu" mode="inline" @click="navigate">
                <a-menu-item v-for="menu in filteredMenu" :key="menu?.path">
                    <a-icon :type="menu?.icon" style="font-size: 16px" />
                    <span>{{ menu?.name }}</span>
                    <!-- <a-badge count="1" v-if="menu.path === '/app/surveys'" /> -->
                </a-menu-item>
            </a-menu>
        </a-drawer>
  </a-layout>
</template>
<script>
import { MENU } from '@/constants';
export default {
    data() {
        return {
            collapsed: false,
            showMenu: false,
            showTitle: true,
        }
    },
    watch: {
        collapsed(value) {
            if(value === false) {
                setTimeout(() => {
                    this.showTitle = true;
                }, 200);
            } else this.showTitle = false;
        },
        ['$breakpoints.current'](value) {
            this.collapsed = (value === 'sm')
                ? true : false;
            this.showMenu = value != 'xs' && false;
        },
    },
    computed: {
        filteredMenu() {
            let scopes = this.$auth?.user && this.$auth?.user['Scopes'];
            return MENU.filter(x => (scopes || []).includes(x.scope));
        },
        selectedMenu(){
            return [this.$route.path];
        },
        path() {
            let path = this.$route.path.split('/').reverse()[0];
            return path === "app"
                ? ["Home"]
                : ["Home", this.ucwords(path)];
        }
    },
    methods: {
        ucwords(word) {
            if (!word) return word;
            let names = word.split(" "); // Split by space
            let capitalized_name = names
                .map((v) => v.charAt(0).toUpperCase() + v.slice(1))
                .join(" "); // Uppercase the first letter then Join again by space
            return capitalized_name;
        },
        navigate(path) {
            if(path.key === "/app/logout") {
                this.confirmation();
            } else {
                this.$router.push(path.key);
            }
        },
        async logout() {
            try {
                await this.$auth.logout();
                this.$router.push('/');
            } catch (error) {
                this.$notification.error({
                    message: "Error",
                    description: error
                });
            }
        },
        confirmation() {
          this.$warning({
            title: 'Confirmation',
            content: 'Are you sure you want to log out?',
            onOk: () => {
              this.logout();
            },
          });
        }
    }
}
</script>
<style>
#components-layout-demo-top-side-2 {
    height: 100vh;
}
.ant-layout-header {
    background: linear-gradient(45deg, #010409, #0d192e) !important;
    padding: 0 20px;
    line-height: 0;
    height: 80px;
}
.ant-layout-sider-trigger {
    background: #010409;
    color: #fff;
}
.menu-icon {
    cursor: pointer;
    font-size: 30px;
    color: #fff;
}
.menu-drawer .ant-drawer-body {
    padding: 40px 0;
    overflow: hidden;
}
.logo-text {
    filter: invert(1);
}
.ant-form-item-label {
    line-height: 20px;
}
</style>