<template>
  <el-form :label-position="labelPosition" :label-width="labelWidth">
    <el-form-item :data-search="name === 'instance-panel' ? ':instance_panel' : ':terms_of_services'" class="editor-form-item">
      <span slot="label">
        {{ name === 'instance-panel' ? $t('settings.instancePanel') : $t('settings.termsOfServices') }}
        <el-tooltip :content="$t('settings.removeFromDB')" placement="bottom-end">
          <el-button icon="el-icon-delete" circle size="mini" class="delete-setting-button" @click="removeInstanceDoc"/>
        </el-tooltip>
      </span>
      <div class="editor">
        <editor-menu-bar v-slot="{ commands, isActive }" :editor="editor">
          <div class="menubar">
            <button
              :class="{ 'is-active': isActive.bold() }"
              class="menubar__button"
              @click="commands.bold">
              <svg-icon icon-class="tiptap-bold" />
            </button>
            <button
              :class="{ 'is-active': isActive.italic() }"
              class="menubar__button"
              @click="commands.italic">
              <svg-icon icon-class="tiptap-italic" />
            </button>
            <button
              :class="{ 'is-active': isActive.underline() }"
              class="menubar__button"
              @click="commands.underline">
              <svg-icon icon-class="tiptap-underline" />
            </button>
            <button
              :class="{ 'is-active': isActive.heading({ level: 1 }) }"
              class="menubar__button"
              @click="commands.heading({ level: 1 })">
              H1
            </button>
            <button
              :class="{ 'is-active': isActive.heading({ level: 2 }) }"
              class="menubar__button"
              @click="commands.heading({ level: 2 })">
              H2
            </button>
            <button
              :class="{ 'is-active': isActive.heading({ level: 3 }) }"
              class="menubar__button"
              @click="commands.heading({ level: 3 })">
              H3
            </button>
            <button
              :class="{ 'is-active': isActive.bullet_list() }"
              class="menubar__button"
              @click="commands.bullet_list">
              <svg-icon icon-class="tiptap-ul" />
            </button>
            <button
              :class="{ 'is-active': isActive.ordered_list() }"
              class="menubar__button"
              @click="commands.ordered_list">
              <svg-icon icon-class="tiptap-ol" />
            </button>
            <button
              :class="{ 'is-active': isActive.blockquote() }"
              class="menubar__button"
              @click="commands.blockquote">
              <svg-icon icon-class="tiptap-quote" />
            </button>
            <button
              :class="{ 'is-active': isActive.link() }"
              class="menubar__button"
              @click="commands.link">
              <svg-icon icon-class="tiptap-link" />
            </button>
            <button
              :class="{ 'is-active': isActive.code_block() }"
              class="menubar__button"
              @click="commands.code_block">
              <svg-icon icon-class="tiptap-code" />
            </button>
            <button
              class="menubar__button"
              @click="commands.horizontal_rule">
              <svg-icon icon-class="tiptap-hr" />
            </button>
            <button
              class="menubar__button"
              @click="commands.undo">
              <svg-icon icon-class="tiptap-undo" />
            </button>
            <button
              class="menubar__button"
              @click="commands.redo">
              <svg-icon icon-class="tiptap-redo" />
            </button>
          </div>
        </editor-menu-bar>
        <editor-content :editor="editor" class="editor__content" />
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import {
  Blockquote,
  CodeBlock,
  Heading,
  HorizontalRule,
  OrderedList,
  BulletList,
  ListItem,
  Bold,
  Italic,
  Link,
  Underline,
  History
} from 'tiptap-extensions'

export default {
  name: 'EditorInput',
  components: {
    EditorContent,
    EditorMenuBar
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      editor: null,
      emitAfterOnUpdate: false
    }
  },
  computed: {
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    labelPosition() {
      return this.isMobile ? 'top' : 'right'
    },
    labelWidth() {
      if (this.isMobile) {
        return '120px'
      } else if (this.isTablet) {
        return '200px'
      } else {
        return '280px'
      }
    }
  },
  watch: {
    value(val) {
      if (this.emitAfterOnUpdate) {
        this.emitAfterOnUpdate = false
        return
      }
      if (this.editor) this.editor.setContent(val)
    }
  },
  beforeDestroy() {
    if (this.editor) {
      this.editor.destroy()
    }
  },
  mounted() {
    this.editor = new Editor({
      extensions: [
        new Blockquote(),
        new Bold(),
        new BulletList(),
        new CodeBlock(),
        new Heading({ levels: [1, 2, 3] }),
        new History(),
        new HorizontalRule(),
        new Italic(),
        new Link(),
        new ListItem(),
        new OrderedList(),
        new Underline()
      ],
      content: this.value,
      onUpdate: ({ getHTML }) => {
        this.$emit('input', getHTML())
      }
    })
    this.editor.setContent(this.value)
  },
  methods: {
    async removeInstanceDoc() {
      await this.$store.dispatch('RemoveInstanceDocument', this.name)
      this.editor.setContent(this.value)
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
@import '../../styles/main';
@include tiptap
</style>
