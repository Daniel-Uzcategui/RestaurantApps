<template lang="pug">
.example(:style="position")
    .block
        .side(:style="{ 'background-image': `url(${imageUrl})`, ...styles}").-main
        .side(:style="{ 'background-image': `url(${imageUrl})`, ...styles, filter: `brightness(${50}%)`}").-left
    .block
        .side(:style="{ 'background-image': `url(${imageUrl})`, ...styles}").-main
        .side(:style="{ 'background-image': `url(${imageUrl})`, ...styles, filter: `brightness(${50}%)`}").-left
    .block
        .side(:style="{ 'background-image': `url(${imageUrl})`, ...styles}").-main
        .side(:style="{ 'background-image': `url(${imageUrl})`, ...styles, filter: `brightness(${50}%)`}").-left
</template>
<script>
export default {
  props: {
    imageUrl: String,
    styles: Object,
    position: Object
  }
}
</script>
<style lang="scss" scoped>

.example {
    position: relative;
    width: 80%;
    padding-top: 50%;

    > .block {
        position: absolute;
        height: 100%;
        width: 30%;
        perspective: 1000px;

        &:nth-of-type(1) {
            height: 80%;
            top: 10%;
            left: 17%;
            width: 15%;
        }

        &:nth-of-type(2) {
            top: 0;
            left: 35%;
        }

        &:nth-of-type(3) {
            height: 80%;
            top: 10%;
            left: 64%;
            width: 15%;
        }
    }

    > .block > .side {
        position: absolute;
        top: 0;
        left: 0;
        background-size: auto 100%;
        box-shadow: -1vw .5vw 1vw rgba(0, 0, 0, .3);

        &.-main {
            height: 100%;
            width: 100%;
            transform: rotateY(30deg);
            transform-origin: 0 50%;
        }

        &.-left {
            height: 100%;
            width: 20%;
            transform-origin: 0 50%;
            transform: rotateY(-60deg) translateX(-100%);
            filter: brightness(40%);
        }
    }

    > .block:nth-of-type(1) > .side {
        &.-main {
            background-position: 4% 50%;
            background-size: auto 130%;
        }

        &.-left {
            background-position: 0 50%;
            background-size: auto 130%;
        }
    }

    > .block:nth-of-type(2) > .side {
        &.-main {
            background-position: 50% 0;
        }

        &.-left {
            background-position: 28.5% 0;
        }
    }

    > .block:nth-of-type(3) > .side {
        &.-main {
            background-position: 96% 50%;
            background-size: auto 130%;
        }

        &.-left {
            background-position: 78% 50%;
            background-size: auto 130%;
        }
    }
}
</style>
