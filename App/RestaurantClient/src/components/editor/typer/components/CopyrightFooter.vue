<template lang='pug'>
footer
  small
    | Released under the #[a(href='https://opensource.org/licenses/MIT', target='_blank') MIT License]
    br
    | Copyright &copy; 2016-#{new Date().getFullYear()} Chris Nguyen
</template>

<style scoped lang='scss'>

footer {
  padding: 2rem;
  color: white;
  text-align: center;

  a {
    color: white;
    font-weight: 700;
    text-decoration: none;
  }
}
</style>
