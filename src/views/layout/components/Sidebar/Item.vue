<template>
  <span>
    <svg-icon :icon-class="icon"/>
    <span slot="title">{{ title }}</span>
    <el-badge :value="count" type="primary" class="count-badge" />
  </span>
</template>

<script>
export default {
  name: 'Item',
  props: {
    count: {
      type: String,
      default: null
    },
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { icon, title } = context.props
    const vnodes = []

    if (icon) {
      vnodes.push(<i class={icon}/>)
    }

    if (title) {
      vnodes.push(<span slot='title'>{(title)}</span>)
    }
    return vnodes
  }
}
</script>

<style rel='stylesheet/scss' lang='scss' scoped>
.count-badge {
  margin-left: 5px;
  height: 48px;
}
</style>
