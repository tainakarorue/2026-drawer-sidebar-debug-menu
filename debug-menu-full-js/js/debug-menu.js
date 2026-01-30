/**
 * Debug Menu - メニューアイテムをJSで動的生成
 * グローバル汚染を最小限に抑えた実装
 */
;(function () {
  'use strict'

  class DebugMenu {
    /**
     * @param {Object} options
     * @param {string} options.containerId - コンテナを挿入する親要素のセレクタ（デフォルト: body末尾）
     * @param {string} options.menuTitle - メニューのタイトル
     * @param {Array} options.items - メニューアイテムの配列
     * @param {string} options.items[].label - 表示ラベル（必須）
     * @param {string} options.items[].href - リンク先（必須）
     * @param {string} options.items[].icon - アイコン画像のsrc（オプション）
     * @param {string} options.items[].target - リンクのtarget属性（オプション）
     * @param {boolean} options.items[].separator - この項目の後に区切り線を入れるか（オプション）
     * @param {Object} options.trigger - トリガー設定
     * @param {boolean} options.trigger.button - ボタンクリックで開閉
     * @param {boolean} options.trigger.keyboard - キーボードで開閉
     * @param {string} options.trigger.key - トリガーキー（デフォルト: 'Escape'）
     * @param {boolean} options.closeOnClickOutside - 外側クリックで閉じる
     */
    constructor(options = {}) {
      const defaults = {
        containerId: null,
        menuTitle: 'Menu',
        items: [],
        trigger: {
          button: true,
          keyboard: true,
          key: 'Escape',
        },
        closeOnClickOutside: true,
      }

      this.config = { ...defaults, ...options }
      this.config.trigger = { ...defaults.trigger, ...options.trigger }

      this.isOpen = false
      this.toggle = null
      this.menu = null

      this.init()
    }

    init() {
      this.createElements()
      this.bindEvents()
    }

    createElements() {
      // コンテナを作成
      this.container = document.createElement('div')
      this.container.className = 'debug-menu-container'

      // トグルボタンを作成
      this.toggle = document.createElement('button')
      this.toggle.className = 'debug-menu-toggle'
      this.toggle.setAttribute('aria-expanded', 'false')
      this.toggle.setAttribute('aria-controls', 'debug-menu-card')
      this.toggle.setAttribute('aria-label', 'メニューを開く')
      this.toggle.innerHTML = `
        <span class="debug-menu-toggle-icon">
          <span></span>
          <span></span>
          <span></span>
        </span>
      `

      // メニューカードを作成
      this.menu = document.createElement('nav')
      this.menu.className = 'debug-menu-card'
      this.menu.id = 'debug-menu-card'
      this.menu.setAttribute('aria-label', 'デバッグメニュー')

      // ヘッダーを作成
      const header = document.createElement('div')
      header.className = 'debug-menu-header'
      header.textContent = this.config.menuTitle

      // リストを作成
      const list = document.createElement('ul')
      list.className = 'debug-menu-list'

      // メニューアイテムを生成
      this.config.items.forEach((item) => {
        const li = document.createElement('li')
        const a = document.createElement('a')
        a.href = item.href

        if (item.target) {
          a.target = item.target
        }

        // アイコンがある場合
        if (item.icon) {
          a.className = 'has-icon'
          const img = document.createElement('img')
          img.src = item.icon
          img.alt = ''
          img.className = 'debug-menu-icon'
          a.appendChild(img)
        }

        // ラベルを追加
        const labelSpan = document.createElement('span')
        labelSpan.className = 'debug-menu-label'
        labelSpan.textContent = item.label
        a.appendChild(labelSpan)

        li.appendChild(a)
        list.appendChild(li)

        // セパレーターを追加
        if (item.separator) {
          const separator = document.createElement('li')
          separator.className = 'debug-menu-separator'
          separator.setAttribute('role', 'separator')
          list.appendChild(separator)
        }
      })

      // 組み立て
      this.menu.appendChild(header)
      this.menu.appendChild(list)
      this.container.appendChild(this.toggle)
      this.container.appendChild(this.menu)

      // DOMに挿入
      if (this.config.containerId) {
        const parent = document.querySelector(this.config.containerId)
        if (parent) {
          parent.appendChild(this.container)
        } else {
          document.body.appendChild(this.container)
        }
      } else {
        document.body.appendChild(this.container)
      }
    }

    bindEvents() {
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

    // メニューアイテムを動的に追加
    addItem(item) {
      this.config.items.push(item)
      this.refresh()
    }

    // メニューを再描画
    refresh() {
      this.container.remove()
      this.createElements()
      this.bindEvents()
    }

    // メニューを破棄
    destroy() {
      this.container.remove()
    }
  }

  // グローバルに公開
  window.DebugMenu = DebugMenu
})()
