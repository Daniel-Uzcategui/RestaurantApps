<template lang='pug'>
.app-layout

  main.container
    section#playground.row

      //- #output-panel.card.col-xs-12.col-lg-12
      //-   slot(name='main-playground-output')

      #text-panel.card.col-xs-12.col-lg-12
        slot(name='main-playground-text')

      #config-panel.card.col-xs-12.col-lg-12.text-bold
        slot(name='main-playground-config')

        //- #code-panel.card.col-xs-12.col-lg-12
        //-   slot(name='main-playground-code')

</template>

<style scoped lang='scss'>

$section-vertical-spacer: 4rem;

.app-layout {
  main {
    margin-bottom: $section-vertical-spacer * 2;

    #playground {
      margin-bottom: $section-vertical-spacer;
    }
    .card {
      padding: 1em;
      margin-bottom: initial;
    }
  }
}
</style>
