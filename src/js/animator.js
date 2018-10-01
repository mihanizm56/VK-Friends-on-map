
class Animator {
  constructor(element, statePreffixStr) {

    if (typeof element === 'string') {
      console.warn('Animator expects HTML DOM Nodes', this)
      console.log('animator from bundle')
      this._element = document.querySelector(element)
    } else {
      this._element = element
    }
    this.statePreffix = (statePreffixStr && ' ' + statePreffixStr) || ' state_'
    this.originClass = this._element.className;
    this.stateIndex;
  }
  set(num) {
    this._element.className = this.originClass + this.statePreffix + num;
    this.stateIndex = num;
  }
  get() {
    return +this.stateIndex;
  }
};

module.exports = Animator;