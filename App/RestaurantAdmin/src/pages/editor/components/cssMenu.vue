<template>
<div>
  <q-card>
    <q-card-section>
      <q-input v-model="getStyles[style]" @input="(e) => setCss(e, style)" :label="style" v-for="(style, index) in Object.keys(getStyles)" :key="index" />
    </q-card-section>
  </q-card>
</div>
</template>
<script>
export default {
  data () {
    return {
      keyscss: [
        'background',
        'backgroundAttachment',
        'backgroundColor',
        'backgroundImage',
        'backgroundPosition',
        'backgroundRepeat',
        'border',
        'borderBottom',
        'borderBottomColor',
        'borderBottomStyle',
        'borderBottomWidth',
        'borderColor',
        'borderLeft',
        'borderLeftColor',
        'borderLeftStyle',
        'borderLeftWidth',
        'borderRight',
        'borderRightColor',
        'borderRightStyle',
        'borderRightWidth',
        'borderStyle',
        'borderTop',
        'borderTopColor',
        'borderTopStyle',
        'borderTopWidth',
        'borderWidth',
        'clear',
        'clip',
        'color',
        'cursor',
        'display',
        'filter',
        'cssFloat',
        'font',
        'fontFamily',
        'fontSize',
        'fontVariant',
        'fontWeight',
        'height',
        'left',
        'letterSpacing',
        'lineHeight',
        'listStyle',
        'listStyleImage',
        'listStylePosition',
        'listStyleType',
        'margin',
        'marginBottom',
        'marginLeft',
        'marginRight',
        'marginTop',
        'overflow',
        'padding',
        'paddingBottom',
        'paddingLeft',
        'paddingRight',
        'paddingTop',
        'pageBreakAfter',
        'pageBreakBefore',
        'position',
        'strokeDasharray',
        'strokeDashoffset',
        'textAlign',
        'textDecoration',
        'textIndent',
        'textTransform',
        'top',
        'verticalAlign',
        'visibility',
        'width',
        'zIndex'
      ]
    }
  },
  props: [ 'value' ],
  computed: {
    selector () {
      return this.value
    },
    getStyles: {
      get () {
        let obj = {}
        let styles = document.querySelector(this.selector).style
        for (let its of this.keyscss) {
          obj[its] = styles[its]
        }
        return obj
      }
    }
  },
  methods: {
    setCss (e, f) {
      let styles = document.querySelectorAll(this.selector)
      for (let st of styles) {
        st.style[f] = e
      }
    }
  },
  created () {
    console.log({ val: this.value })
  }
}
</script>
