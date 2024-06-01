<template>
    <div>
        dashboard
    </div>
</template>
<script>
export default {
    layout: 'app-layout',
    fetch() {
        console.log('loggedIn :>> ', this.$auth.user);
    }
}
</script>
<style>
    
</style>