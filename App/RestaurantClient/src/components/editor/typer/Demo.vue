<template lang='pug'>
app-layout.demo
  hero-header(slot='header')

  template(slot='main-playground-output')
    //- h3.demo-typer-container
    //-   vue-typer.demo-typer(
    //-     :text='text',
    //-     :repeat='repeat',
    //-     :shuffle='shuffle',
    //-     :initial-action='initialAction',
    //-     :pre-type-delay='preTypeDelay',
    //-     :type-delay='typeDelay',
    //-     :pre-erase-delay='preEraseDelay',
    //-     :erase-delay='eraseDelay',
    //-     :erase-style='eraseStyle',
    //-     :erase-on-complete='eraseOnComplete',
    //-     :caret-animation='caretAnimation')

  template(slot='main-playground-text')
    .form-group.text-bold
      label(for='text') Listado de palabras a escribir:
      q-input(id='text', v-model='textModel', placeholder='text', type='textarea', filled)

  template(slot='main-playground-config')
    .row
      #general-config.col-xs-12.col-lg-6
        form-input(v-model.number='fontSize', label='Tamaño de fuente', type='number')
        form-select(v-model='fontFamily', label='Tipo de Letra', :options="fontOptions")
        form-input(v-model.number='repeatModel', label='repeat', type="number")
        form-check(v-model='shuffle', label='shuffle')
        form-check.shrink-text(v-model='eraseOnComplete', label='eraseOnComplete')
        form-radio(v-model='initialAction', :model='initialAction', label='initialAction',
          :options='["typing", "erasing"]')

      #delay-config.col-xs-12.col-lg-6
        form-input(v-model.number='preTypeDelay', label='preTypeDelay', type='number')
        form-input(v-model.number='typeDelay', label='typeDelay', type='number')
        form-input(v-model.number='preEraseDelay', label='preEraseDelay', type='number')
        form-input(v-model.number='eraseDelay', label='eraseDelay', type='number')

      #erase-style-config.col-xs-12.col-lg-6
        form-radio(v-model='eraseStyle', :model='eraseStyle', label='eraseStyle',
          :options='["backspace", "select-back", "select-all", "clear"]')

      #caret-config.col-xs-12.col-lg-6
        form-radio(v-model='caretAnimation', :model='caretAnimation', label='caretAnimation',
          :options='["solid", "blink", "smooth", "phase", "expand"]')

  //- template(slot='main-playground-code')
  //-   code-block(:code='playgroundDemoCode', language='html')

  //- template(slot='style-showcase-panel-1')
  //-   h4.text-xs-center
  //-     vue-typer.state-typer(
  //-       text='Katniss Everdeen',
  //-       :pre-type-delay='1000',
  //-       :type-delay='160',
  //-       :pre-erase-delay='2000',
  //-       :erase-delay='80',
  //-       erase-style='select-back',
  //-       caret-animation='solid'
  //-     )
  //-   code-block(:code='stateDemoStyleCode', language='css')

  //- template(slot='style-showcase-panel-2')
  //-   h4.text-xs-center
  //-     vue-typer.code-typer(
  //-       text='Katniss Everdeen',
  //-       :pre-type-delay='1000',
  //-       :type-delay='160',
  //-       :pre-erase-delay='2000',
  //-       :erase-delay='1280',
  //-       erase-style='select-all',
  //-       caret-animation='blink'
  //-     )
  //-   code-block(:code='codeDemoStyleCode', language='css')

  //- template(slot='style-showcase-panel-3')
  //-   h4.card-title.text-xs-center
  //-     vue-typer.ghost-typer(
  //-       text='Katniss Everdeen',
  //-       :pre-type-delay='1000',
  //-       :type-delay='160',
  //-       :pre-erase-delay='2000',
  //-       :erase-delay='80',
  //-       erase-style='select-back'
  //-     )
  //-   code-block(:code='ghostDemoStyleCode', language='css')

  //- copyright-footer(slot='footer')
</template>

<script>
import { VueTyper } from 'vue-typer'
import AppLayout from './components/AppLayout'
import HeroHeader from './components/HeroHeader'
import CopyrightFooter from './components/CopyrightFooter'
import FormCheck from './components/FormCheck'
import FormInput from './components/FormInput'
import FormSelect from './components/FormSelect'
import FormRadio from './components/FormRadio'
import CodeBlock from './components/CodeBlock'

export default {
  components: { VueTyper, AppLayout, HeroHeader, CopyrightFooter, FormCheck, FormInput, FormSelect, FormRadio, CodeBlock },
  props: ['value'],
  data() {
    return {
      fontOptions: [
{ label: 'default', value: 'default' },
{ value:  'Arial', label: `<font face='Arial'>Arial</font>` },
{ value:  'Arial Black', label: `<font face='Arial Black'>Arial Black</font>` },
{ value:  'Comic Sans MS', label: `<font face='Comic Sans MS'>Comic Sans MS</font>` },
{ value:  'Courier New', label: `<font face='Courier New'>Courier New</font>` },
{ value:  'Lucida Grande', label: `<font face='Lucida Grande'>Lucida Grande</font>` },
{ value:  'Times New Roman', label: `<font face='Times New Roman'>Times New Roman</font>` },
{ value:  'Verdana', label: `<font face='Verdana'>Verdana</font>` },
{ value:  'emoji', label: `<font face='emoji'>emoji</font>` },
{ value:  'Impact', label: `<font face='Impact>Impact</font>` },
 ],
      textModel: ['E-commerce hecho Fácil', 'Atractivo para tus clientes', 'Simplifica tu Trabajo', 'Progressive WebApp'].join('\n'),
      repeatModel: Infinity,
      shuffle: false,
      initialAction: 'typing',
      typeDelay: 70,
      preTypeDelay: 70,
      eraseDelay: 250,
      preEraseDelay: 2000,
      eraseStyle: 'select-all',
      eraseOnComplete: false,
      caretAnimation: 'blink',
      fontSize: 28,
      fontColor: 'white',
      fontFamily: ''
    }
  },
  computed: {
    properties() {
      return `${this.text} ${this.repeat} ${this.shuffle} ${this.initialAction} ${this.preTypeDelay} ${this.typeDelay} ${this.preEraseDelay} ${this.eraseDelay} ${this.eraseStyle} ${this.eraseOnComplete} ${this.caretAnimation} ${this.fontSize} ${this.fontColor} ${this.fontFamily}`
    },
    text() {
      return this.textModel.split('\n')
    },
    repeat() {
      const repeatValue = parseInt(this.repeatModel)
      return Number.isNaN(repeatValue) ? Infinity : repeatValue
    },
    playgroundDemoCode() {
      const printableTextArray = '[' + this.text.map(word => `"${word}"`) + ']'
      return `
        <vue-typer
          :text='${printableTextArray}'
          :repeat='${this.repeat}'
          :shuffle='${this.shuffle}'
          initial-action='${this.initialAction}'
          :pre-type-delay='${this.preTypeDelay}'
          :type-delay='${this.typeDelay}'
          :pre-erase-delay='${this.preEraseDelay}'
          :erase-delay='${this.eraseDelay}'
          erase-style='${this.eraseStyle}'
          :erase-on-complete='${this.eraseOnComplete}'
          caret-animation='${this.caretAnimation}'
        ></vue-typer>
      `
    },
    stateDemoStyleCode() {
      return `
        @keyframes rocking {
          0%,100% {transform: rotateZ(-10deg);},
          50%     {transform: rotateZ(10deg);}
        }

        .vue-typer {
          font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;
        }
        .vue-typer .custom.char.typed {
          color: #009688;
        }
        .vue-typer .custom.char.selected {
          color: #E91E63;
        }

        .vue-typer .custom.caret {
          animation: rocking 1s ease-in-out 0s infinite;
        }
        .vue-typer .custom.caret.typing {
          background-color: #009688;
        }
        .vue-typer .custom.caret.selecting {
          display: inline-block;
          background-color: #E91E63;
        }
      `
    },
    codeDemoStyleCode() {
      return `
        .vue-typer {
          font-family: monospace;
        }

        .vue-typer .custom.char {
          color: #D4D4BD;
          background-color: #1E1E1E;
        }
        .vue-typer .custom.char.selected {
          background-color: #264F78;
        }

        .vue-typer .custom.caret {
          width: 10px;
          background-color: #3F51B5;
        }
      `
    },
    ghostDemoStyleCode() {
      return `
        .vue-typer {
          font-family: Copperplate, 'Copperplate Gothic Light', fantasy;
        }

        .vue-typer .custom.char.typed {
          color: #607D8B;
        }
        .vue-typer .custom.char.selected {
          color: #607D8B;
          background-color: transparent;
          text-decoration: line-through;
        }

        .vue-typer .custom.caret {
          display: none;
        }
      `
    }
  },
  watch: {
    properties () {
      this.$emit('input', {
        text: this.text,
        // repeat: this.repeat,
        shuffle: this.shuffle,
        'initial-action': this.initialAction,
        'pre-type-delay': this.preTypeDelay,
        'type-delay': this.typeDelay,
        'pre-erase-delay': this.preEraseDelay,
        'erase-delay': this.eraseDelay,
        'erase-style': this.eraseStyle,
        'erase-on-complete': this.eraseOnComplete,
        'caret-animation': this.caretAnimation,
        customText: {
          fontSize: this.fontSize,
          fontColor: this.fontColor,
          fontFamily: this.fontFamily
        }
      })
    }
  },
  mounted () {
    if (this.value) {
        this.textModel = this.value.text.join('\n'),
        // this.repeatModel = this.value.repeat,
        this.shuffle = this.value.shuffle,
        this.initialAction = this.value['initial-action'],
        this.preTypeDelay = this.value['pre-type-delay'],
        this.typeDelay = this.value['type-delay'],
        this.preEraseDelay = this.value['pre-erase-delay'],
        this.eraseDelay = this.value['erase-delay'],
        this.eraseStyle = this.value['erase-style'],
        this.eraseOnComplete = this.value['erase-on-complete'],
        this.caretAnimation = this.value['caret-animation']
        if (this.value.customText) {
          this.fontSize = this.value.customText.fontSize,
          this.fontColor = this.value.customText.fontColor,
          this.fontFamily = this.value.customText.fontFamily
        }
        this.$forceUpdate()
    } else {
      this.$emit('input', {
          text: this.text,
          // repeat: this.repeat,
          shuffle: this.shuffle,
          'initial-action': this.initialAction,
          'pre-type-delay': this.preTypeDelay,
          'type-delay': this.typeDelay,
          'pre-erase-delay': this.preEraseDelay,
          'erase-delay': this.eraseDelay,
          'erase-style': this.eraseStyle,
          'erase-on-complete': this.eraseOnComplete,
          'caret-animation': this.caretAnimation,
          customText: {
          fontSize: this.fontSize,
          fontColor: this.fontColor,
          fontFamily: this.fontFamily
        }
        })
    }
  }
}
</script>

<style scoped lang='scss'>
.demo {
  // #output-panel {
  //   .demo-typer-container {
  //     height: 100%;
  //   }
  // }

  #text-panel {
    .form-group {
      margin-bottom: initial;

      textarea {
        width: 100%;
      }
    }
  }

  .shrink-text {
    font-size: 0.9rem;
  }
}
</style>
<style lang='scss'>
// @keyframes rocking {
//   0%, 100% { transform: rotateZ(-10deg); },
//   50%      { transform: rotateZ(10deg); }
// }

main {
  .state-typer {
    font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;

    .custom.char {
      &.typed {
        color: #009688;
      }
      &.selected {
        color: #E91E63;
      }
    }
    .custom.caret {
      animation: rocking 1s ease-in-out 0s infinite;

      &.typing {
        background-color: #009688;
      }
      &.selecting {
        display: inline-block;
        background-color: #E91E63;
      }
    }
  }

  .code-typer {
    font-family: monospace;

    .custom.char {
      color: #D4D4BD;
      background-color: #1E1E1E;

      &.selected {
        background-color: #264F78;
      }
    }
    .custom.caret {
      width: 10px;
      background-color: #3F51B5;
    }
  }

  .ghost-typer {
    font-family: Copperplate, 'Copperplate Gothic Light', fantasy;

    .custom.char {
      &.typed {
        color: #607D8B;
      }
      &.selected {
        color: #607D8B;
        background-color: transparent;
        text-decoration: line-through;
      }
    }
    .custom.caret {
      display: none;
    }
  }
}
</style>
