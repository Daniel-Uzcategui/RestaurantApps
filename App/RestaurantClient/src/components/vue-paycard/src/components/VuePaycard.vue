<template>
  <div
    class="card-item"
    :class="{ '-active': isCardFlipped }"
    v-if="labels && inputFields"
  >
    <div class="card-item__side -front">
      <div
        :class="{ '-active': focusElementStyle }"
        :style="focusElementStyle"
        class="card-item__focus"
        ref="focusElement"
      ></div>
      <div class="card-item__cover" :aria-label="imageCover">
        <img
          v-if="currentCardBackground"
          :src="currentCardBackground"
          class="card-item__bg"
          alt="Background image"
        />
      </div>
      <div class="card-item__wrapper">
        <div class="card-item__top">
          <img v-if="credit" src="../assets/images/chip.png" class="card-item__chip" alt="Card chip image" />
          <div class="card-item__type">
            <transition name="slide-fade-up">
              <img
                v-if="cardType"
                :src="getCreditCardImage"
                :key="cardType"
                :alt="`${cardType} brand image`"
                class="card-item__typeImg"
              />
            </transition>
          </div>
        </div>
        <label
          :for="inputFields.cardNumber"
          :ref="inputFields.cardNumber"
          aria-label="Card number"
          class="card-item__number"
        >
          <template>
            <span v-for="(n, $index) in currentPlaceholder" :key="$index">
              <transition name="slide-fade-up">
                <div
                  v-if="getIsNumberMasked($index, n)"
                  class="card-item__numberItem"
                >
                  *
                </div>
                <div
                  v-else-if="valueFields.cardNumber.length > $index"
                  :class="{ '-active': n.trim() === '' }"
                  :key="currentPlaceholder"
                  class="card-item__numberItem"
                >
                  {{ valueFields.cardNumber[$index] }}
                </div>
                <div
                  v-else
                  :class="{ '-active': n.trim() === '' }"
                  :key="currentPlaceholder + 1"
                  class="card-item__numberItem"
                >
                  {{ n }}
                </div>
              </transition>
            </span>
          </template>
        </label>
        <div class="card-item__content">
          <div class="card-item__date" ref="cardDate">
            <label :for="inputFields.cardMonth" class="card-item__dateTitle" aria-label="Expiration date">{{
              labels.cardExpires || "Expires"
            }}</label>
            <label :for="inputFields.cardMonth" class="card-item__dateItem" aria-label="Card month">
              <transition name="slide-fade-up">
                <span
                  v-if="valueFields.cardMonth"
                  :key="valueFields.cardMonth"
                  >{{ valueFields.cardMonth }}</span
                >
                <span v-else key="2">{{ labels.cardMonth || "MM" }}</span>
              </transition>
            </label>
            /
            <label :for="inputFields.cardYear" class="card-item__dateItem" aria-label="Card year">
              <transition name="slide-fade-up">
                <span v-if="valueFields.cardYear" :key="valueFields.cardYear">{{
                  String(valueFields.cardYear).slice(2, 4)
                }}</span>
                <span v-else key="2">{{ labels.cardYear || "YY" }}</span>
              </transition>
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="card-item__side -back">
      <div class="card-item__cover" style="  background-image: linear-gradient(147deg, #354fce 0%, #0c296b 74%);" :aria-label="imageCover">
      </div>
      <div class="card-item__band"></div>
      <div class="card-item__cvv">
        <label :for="inputFields.cardCvv" aria-label="Card CVV">
          <div class="card-item__cvvTitle">{{ labels.cardCvv }}</div>
          <div class="card-item__cvvBand">
            <span>{{ valueFields.cardCvv }}</span>
          </div>
        </label>
        <div class="card-item__type">
          <img
            v-if="cardType"
            :src="getCreditCardImage"
            class="card-item__typeImg"
            alt="Dark bar image"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VuePaycard',
  props: {
    valueFields: {
      type: Object,
      required: true
    },
    credit: {
      type: Boolean,
      default: () => false
    },
    inputFields: {
      type: Object,
      default: () => ({
        cardNumber: 'v-card-number',
        cardName: 'v-card-name',
        cardMonth: 'v-card-month',
        cardYear: 'v-card-year',
        cardCvv: 'v-card-cvv'
      })
    },
    labels: {
      type: Object,
      default: () => ({
        cardName: 'Full Name',
        cardHolder: 'Card Holder',
        cardMonth: 'MM',
        cardYear: 'YY',
        cardExpires: 'Expires',
        cardCvv: 'CVV'
      })
    },
    isCardNumberMasked: {
      type: Boolean,
      default: true
    },
    hasRandomBackgrounds: {
      type: Boolean,
      default: true
    },
    backgroundImage: {
      type: [String, Number],
      default: ''
    }
  },
  data: () => ({
    focusElementStyle: null,
    currentFocus: null,
    isFocused: false,
    isCardFlipped: false,
    amexCardPlaceholder: '#### ###### #####',
    dinersCardPlaceholder: '#### ###### ####',
    defaultCardPlaceholder: '#### #### #### ####',
    currentPlaceholder: '#### #### #### ####'
  }),
  watch: {
    currentFocus () {
      if (this.currentFocus) {
        this.changeFocus()
      } else {
        this.focusElementStyle = null
      }
    },
    cardType () {
      this.changePlaceholder()
    }
  },
  mounted () {
    this.init()
    if (this.credit) {
      this.defaultCardPlaceholder = '#### #### #### ####'
      this.currentPlaceholder = '#### #### #### ####'
    }
  },
  beforeDestroy () {
    this.destroy()
  },
  computed: {
    getCreditCardImage () {
      return require(`../assets/images/${this.cardType}.png`)
    },
    cardType () {
      const number = this.valueFields.cardNumber.replace(/\s+/g, '')

      let re = new RegExp('^4(026|17500|405|508|844|91[37])')
      if (number.match(re)) return 'visaelectron'

      re = new RegExp('^4')
      if (number.match(re)) return 'visa'

      re = new RegExp('^((509091)|(636368)|(636297)|(504175)|(438935)|(40117[8-9])|(45763[1-2])|(457393)|(431274)|(50990[0-2])|(5099[7-9][0-9])|(50996[4-9])|(509[1-8][0-9][0-9])|(5090(0[0-2]|0[4-9]|1[2-9]|[24589][0-9]|3[1-9]|6[0-46-9]|7[0-24-9]))|(5067(0[0-24-8]|1[0-24-9]|2[014-9]|3[0-379]|4[0-9]|5[0-3]|6[0-5]|7[0-8]))|(6504(0[5-9]|1[0-9]|2[0-9]|3[0-9]))|(6504(8[5-9]|9[0-9])|6505(0[0-9]|1[0-9]|2[0-9]|3[0-8]))|(6505(4[1-9]|5[0-9]|6[0-9]|7[0-9]|8[0-9]|9[0-8]))|(6507(0[0-9]|1[0-8]))|(65072[0-7])|(6509(0[1-9]|1[0-9]|20))|(6516(5[2-9]|6[0-9]|7[0-9]))|(6550(0[0-9]|1[0-9]))|(6550(2[1-9]|3[0-9]|4[0-9]|5[0-8])))')
      if (number.match(re)) return 'elo'

      re = new RegExp('^(34|37)')
      if (number.match(re)) return 'amex'

      re = new RegExp('^5[1-5]')
      if (number.match(re)) return 'mastercard'

      re = new RegExp('^6011')
      if (number.match(re)) return 'discover'

      re = new RegExp('^62')
      if (number.match(re)) return 'unionpay'

      re = new RegExp('^9792')
      if (number.match(re)) return 'troy'

      re = new RegExp('^3(?:0([0-5]|9)|[689]\\d?)\\d{0,11}')
      if (number.match(re)) return 'dinersclub'

      re = new RegExp('^35(2[89]|[3-8])')
      if (number.match(re)) return 'jcb'

      return ''
    },
    imageCover () {
      return !this.hasRandomBackgrounds && parseInt(this.backgroundImage)
        ? 'Image cover'
        : ''
    },
    isBackgroundImageFromAssets () {
      const numberImage = parseInt(this.backgroundImage)

      return Number.isFinite(numberImage) && parseInt(numberImage) < 26 && parseInt(numberImage) > 0
    },
    currentCardBackground () {
      const numberImage = parseInt(this.backgroundImage)

      if (this.isBackgroundImageFromAssets) {
        return require(`../assets/images/mercantil.jpg`)
      }

      if (this.backgroundImage && !Number.isFinite(numberImage)) {
        return this.backgroundImage
      }

      if (this.hasRandomBackgrounds) {
        const random = Math.floor(Math.random() * 25 + 1)

        return require(`../assets/images/${random}.jpg`)
      }

      return null
    }
  },
  methods: {
    addOrRemoveFieldListeners (event = 'addEventListener') {
      const self = this
      const fields = document.querySelectorAll('[data-card-field]')
      fields.forEach(element => {
        element[event]('focus', () => {
          this.isFocused = true
          if (element.id === this.inputFields.cardYear || element.id === this.inputFields.cardMonth) {
            this.currentFocus = 'cardDate'
          } else {
            this.currentFocus = element.id
          }
          this.isCardFlipped = element.title === 'CVV'
        })
        element[event]('blur', () => {
          this.isCardFlipped = !element.id === this.inputFields.cardCvv
          const timeout = setTimeout(() => {
            if (!self.isFocused) {
              self.currentFocus = null
            }
            clearTimeout(timeout)
          }, 300)
          self.isFocused = false
        })
      })
    },
    init () {
      this.addOrRemoveFieldListeners()
    },
    destroy () {
      this.addOrRemoveFieldListeners('removeEventListener')
    },
    changeFocus () {
      const target = this.$refs[this.currentFocus]
      this.focusElementStyle = target
        ? {
          width: `${target.offsetWidth}px`,
          height: `${target.offsetHeight}px`,
          transform: `translateX(${target.offsetLeft}px) translateY(${target.offsetTop}px)`
        }
        : null
    },
    getIsNumberMasked (index, n) {
      const numbers = this.cardType === 'amex' ? 13 : 14

      return (
        index < numbers &&
        this.valueFields.cardNumber.length > index &&
        n.trim() !== '' &&
        this.isCardNumberMasked
      )
    },
    changePlaceholder () {
      const cardsPlaceholder = {
        amex: this.amexCardPlaceholder,
        dinersclub: this.dinersCardPlaceholder
      }

      this.currentPlaceholder = cardsPlaceholder[this.cardType] || this.defaultCardPlaceholder
      this.$nextTick(() => {
        this.changeFocus()
      })
    }
  }
}
</script>

<style src="../assets/css/style.css" scoped></style>
