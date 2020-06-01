<template>
    <div>
      
    </div>
</template>
<script>
export default {
  data() {
    return {
      secret: ""
    }
  },
  created() {
    let secret = this.$route.params.secret;
  }
}
</script>
<style lang="scss" scoped>
</style>