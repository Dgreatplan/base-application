<template>
  <div class="background">
    <div class="overlay">
      <div class="login-form">
        <a-card style="width: 450px">
          <a-form-model :model="form" :rules="rules" ref="form">
            <div class="login-header">
              <!-- <img src="@/assets/images/logo.png" alt="Logo"> -->
            </div>
            <a-divider />
            <h2>Login to continue</h2>
            <a-form-model-item label="Username" prop="username">
              <a-input :disabled="loading" size="large" v-model="form.username" @keypress.enter="validate">
                <a-icon slot="prefix" type="user" style="color: #555" />
              </a-input>
            </a-form-model-item>
            <a-form-model-item label="Password" prop="password">
              <a-input-password :disabled="loading" size="large" v-model="form.password" @keypress.enter="validate">
                <a-icon slot="prefix" type="lock" style="color: #555" />
              </a-input-password>
              <a-button type="link" :disabled="loading">Forgot password?</a-button>
            </a-form-model-item>
            <a-button type="primary" size="large" @click="validate" icon="login" block :disabled="isDisabled" :loading="loading">Sign In</a-button>
            <a-divider>or</a-divider>
            <div class="center">
              <a-button type="link" :disabled="loading">Register here</a-button>
            </div>
          </a-form-model>
        </a-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {},
      loading: false
    }
  },
  computed: {
    isDisabled() {
      return !this.form.username || !this.form.password;
    },
    rules() {
      return this.ruleSetter(['username', 'password']);
    }
  },
  methods: {
    validate() {
      this.$refs.form.validate(async valid => {
        if(valid) {
          await this.login();
        } else this.$notification.error({
          message: "Error",
          description: "Fill up required fields"
        });
      });
    },
    async login() {
      try {
        this.loading = true;
        await this.$auth.loginWith('local', { data: this.form });

        this.$notification.success({
          message: "Login successful",
          description: `You are logged in as of ${this.formatDate(new Date(), 'datetime')}`
        });

        this.$router.push('/app');
      } catch (error) {
        this.catchError(error);
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>
<style>
* {
  margin: 0;
  padding: 0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  box-sizing: border-box;
  user-select: none;
}
body {
  margin: 0;
  padding: 0;
  height: 100vh;
}
.background {
  position: relative;
  height: 100vh;
  /* background: url('@/assets/images/bg.gif') center/cover no-repeat; */
}
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
}
.login-form {
  display: grid;
  place-items: center;
  height: 100vh;
}
.login-form .login-header, .login-form h2, .center {
  text-align: center;
}
.login-form img {
  height: 100px;
  width: 100px;
  padding: 10px;
  background: #44484a;
  border-radius: 50%;
}
</style>