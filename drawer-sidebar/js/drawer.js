class DrawerMenu {
  /**
   * @param {Object} options
   * @param {string} options.drawerId - ドロワー要素のID
   * @param {string} options.toggleId - トグルボタンのID
   * @param {Object} options.trigger - トリガー設定
   * @param {boolean} options.trigger.button - ボタンクリックで開閉
   * @param {boolean} options.trigger.keyboard - キーボードで開閉
   * @param {string} options.trigger.key - トリガーキー（デフォルト: 'm'）
   */

  constructor(options = {}) {
    const defaults = {
      drawerId: 'drawer',
      toggleId: 'drawer-toggle',
      trigger: {
        button: true,
        keyboard: true,
        key: 'm',
      },
    }

    this.config = { ...defaults, ...options }
    this.config.trigger = {
      ...defaults.trigger,
      ...options.trigger,
    }

    this.drawer = document.getElementById(this.config.drawerId)
    this.toggle = document.getElementById(this.config.toggleId)
    this.isOpen = false

    this.init()
  }

  init() {
    if (!this.drawer || !this.toggle) {
      console.error('Drawer: 必要な要素が見つかりません')
      return
    }
    // ボタントリガー
    if (this.config.trigger.button) {
      this.toggle.addEventListener('click', () => this.toggleDrawer())
    }

    // キーボードトリガー
    if (this.config.trigger.keyboard) {
      document.addEventListener('keydown', (e) => this.handleKeydown(e))
    }
  }

  handleKeydown(e) {
    // 入力フィールドでは無効化（誤操作防止）
    const activeEl = document.activeElement
    const isInputFocused =
      activeEl.tagName === 'INPUT' ||
      activeEl.tagName === 'TEXTAREA' ||
      activeEl.isContentEditable
    if (isInputFocused) return

    // 修飾キーとの組み合わせは無視（既存ショートカットとの衝突防止）

    if (e.ctrlKey || e.metaKey || e.altKey) return

    if (e.key.toLowerCase() === this.config.trigger.key.toLowerCase()) {
      e.preventDefault()
      this.toggleDrawer()
    }
  }

  toggleDrawer() {
    this.isOpen = !this.isOpen

    this.drawer.classList.toggle('is-open', this.isOpen)
    this.drawer.setAttribute('aria-hidden', !this.isOpen)
    this.toggle.setAttribute('aria-expanded', this.isOpen)
  }

  open() {
    this.isOpen = true
    this.drawer.classList.add('is-open')
    this.drawer.setAttribute('aria-hidden', 'false')
    this.toggle.setAttribute('aria-expanded', 'true')
  }

  close() {
    this.isOpen = false
    this.drawer.classList.remove('is-open')
    this.drawer.setAttribute('aria-hidden', 'true')
    this.toggle.setAttribute('aria-expanded', 'false')
  }
}
