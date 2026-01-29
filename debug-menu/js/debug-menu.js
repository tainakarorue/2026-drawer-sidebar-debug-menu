/**
 * Debug Menu - 既存サイトにコピペで移植できるメニュー
 * グローバル汚染を最小限に抑えた実装
 */
;(function () {
  'use strict'

  class DebugMenu {
    /**
     * @param {Object} options
     * @param {string} options.toggleId - トグルボタンのID
     * @param {string} options.menuId - メニューカードのID
     * @param {Object} options.trigger - トリガー設定
     * @param {boolean} options.trigger.button - ボタンクリックで開閉
     * @param {boolean} options.trigger.keyboard - キーボードで開閉
     * @param {string} options.trigger.key - トリガーキー（デフォルト: 'Escape'）
     * @param {boolean} options.closeOnClickOutside - 外側クリックで閉じる
     */
    constructor(options = {}) {
      const defaults = {
        toggleId: 'debug-menu-toggle',
        menuId: 'debug-menu-card',
        trigger: {
          button: true,
          keyboard: true,
          key: 'Escape',
        },
        closeOnClickOutside: true,
      }

      this.config = { ...defaults, ...options }
      this.config.trigger = { ...defaults.trigger, ...options.trigger }

      this.toggle = document.getElementById(this.config.toggleId)
      this.menu = document.getElementById(this.config.menuId)
      this.isOpen = false

      this.init()
    }

    init() {
      if (!this.toggle || !this.menu) {
        console.error('DebugMenu: 必要な要素が見つかりません')
        return
      }

      // ボタントリガー
      if (this.config.trigger.button) {
        this.toggle.addEventListener('click', (e) => {
          e.stopPropagation()
          this.toggleMenu()
        })
      }

      // キーボードトリガー
      if (this.config.trigger.keyboard) {
        document.addEventListener('keydown', (e) => this.handleKeydown(e))
      }

      // 外側クリックで閉じる
      if (this.config.closeOnClickOutside) {
        document.addEventListener('click', (e) => this.handleClickOutside(e))
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

      // 修飾キーとの組み合わせは無視
      if (e.ctrlKey || e.metaKey || e.altKey) return

      if (e.key.toLowerCase() === this.config.trigger.key.toLowerCase()) {
        e.preventDefault()
        this.toggleMenu()
      }
    }

    handleClickOutside(e) {
      if (!this.isOpen) return

      const isClickInsideMenu = this.menu.contains(e.target)
      const isClickOnToggle = this.toggle.contains(e.target)

      if (!isClickInsideMenu && !isClickOnToggle) {
        this.close()
      }
    }

    toggleMenu() {
      this.isOpen ? this.close() : this.open()
    }

    open() {
      this.isOpen = true
      this.menu.classList.add('is-open')
      this.toggle.classList.add('is-active')
      this.toggle.setAttribute('aria-expanded', 'true')
    }

    close() {
      this.isOpen = false
      this.menu.classList.remove('is-open')
      this.toggle.classList.remove('is-active')
      this.toggle.setAttribute('aria-expanded', 'false')
    }
  }

  // グローバルに公開（必要に応じて）
  window.DebugMenu = DebugMenu
})()
