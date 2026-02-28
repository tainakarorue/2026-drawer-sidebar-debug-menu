/**
 * ScrollNav
 * スクロール連動型ナビゲーション
 *
 * HTML で自由にナビを作成し、data-scroll-target 属性でセクション ID を指定します。
 *
 * 使用例:
 * <nav class="scroll-nav">
 *   <button class="scroll-nav__item" data-scroll-target="section-1">Section 1</button>
 *   <a href="#section-2" class="scroll-nav__item" data-scroll-target="section-2">
 *     <i class="icon">🔥</i> Section 2
 *   </a>
 * </nav>
 */
;(function () {
  'use strict'

  window.ScrollNavApp = window.ScrollNavApp || {}

  let activeId = ''
  let navItemElements = []
  let triggers = []
  let activeClass = 'is-active'

  /**
   * ナビゲーションを初期化
   * @param {Object} config - 設定オブジェクト
   * @param {string} config.navSelector - ナビアイテムのセレクタ (default: '[data-scroll-target]')
   * @param {string} config.activeClass - アクティブ時のクラス (default: 'is-active')
   */
  function initNav(config) {
    config = config || {}

    const lenis = window.ScrollNavApp.getLenis()
    if (!lenis) {
      console.error(
        'ScrollNavApp: Lenis not initialized. Call ScrollNavApp.init() first.',
      )
      return
    }

    const navSelector = config.navSelector || '[data-scroll-target]'
    activeClass = config.activeClass || 'is-active'

    // 既存の DOM からナビアイテムを取得
    navItemElements = Array.from(document.querySelectorAll(navSelector))

    if (navItemElements.length === 0) {
      console.warn('ScrollNavApp: No nav items found with selector "' + navSelector + '"')
      return
    }

    // 各ナビアイテムにクリックイベントを設定
    navItemElements.forEach(function (item) {
      const targetId = item.getAttribute('data-scroll-target')

      item.addEventListener('click', function (e) {
        e.preventDefault()
        handleClick(targetId)
      })
    })

    // ScrollTrigger 設定
    setupScrollTriggers()

    // ハッシュ同期
    setupHashSync()
  }

  /**
   * ScrollTrigger を設定
   */
  function setupScrollTriggers() {
    // 既存のトリガーをクリア
    triggers.forEach(function (trigger) {
      trigger.kill()
    })
    triggers = []

    // ユニークなターゲット ID を収集
    const targetIds = []
    navItemElements.forEach(function (item) {
      const id = item.getAttribute('data-scroll-target')
      if (id && targetIds.indexOf(id) === -1) {
        targetIds.push(id)
      }
    })

    targetIds.forEach(function (id) {
      const targetElement = document.getElementById(id)
      if (!targetElement) {
        console.warn('ScrollNavApp: Target element not found: #' + id)
        return
      }

      const trigger = ScrollTrigger.create({
        trigger: '#' + id,
        start: 'top center',
        end: 'bottom center',
        onEnter: function () {
          activate(id)
        },
        onEnterBack: function () {
          activate(id)
        },
      })
      triggers.push(trigger)
    })
  }

  /**
   * アクティブ状態を更新
   */
  function activate(id) {
    activeId = id

    // URL ハッシュを更新
    var pathname = location.pathname
    history.replaceState(null, '', pathname + '#' + id)

    // クラス更新
    navItemElements.forEach(function (item) {
      if (item.getAttribute('data-scroll-target') === id) {
        item.classList.add(activeClass)
      } else {
        item.classList.remove(activeClass)
      }
    })
  }

  /**
   * クリックハンドラ
   */
  function handleClick(id) {
    var lenis = window.ScrollNavApp.getLenis()
    if (!lenis) return

    activate(id)
    lenis.scrollTo('#' + id)
  }

  /**
   * ハッシュ同期を設定
   */
  function setupHashSync() {
    var lenis = window.ScrollNavApp.getLenis()

    function syncFromHash() {
      var hash = location.hash.replace('#', '')
      if (hash) {
        activeId = hash
        updateActiveClass(hash)
        if (lenis) {
          lenis.scrollTo('#' + hash, { immediate: true })
        }
      }
    }

    // 初期ロード時
    syncFromHash()

    // ブラウザバック/フォワード
    window.addEventListener('popstate', syncFromHash)
  }

  /**
   * アクティブクラスを更新
   */
  function updateActiveClass(id) {
    navItemElements.forEach(function (item) {
      if (item.getAttribute('data-scroll-target') === id) {
        item.classList.add(activeClass)
      } else {
        item.classList.remove(activeClass)
      }
    })
  }

  /**
   * 現在のアクティブ ID を取得
   */
  function getActiveId() {
    return activeId
  }

  /**
   * ナビゲーションを破棄（イベントリスナーと ScrollTrigger をクリア）
   */
  function destroyNav() {
    triggers.forEach(function (trigger) {
      trigger.kill()
    })
    triggers = []
    navItemElements = []
    activeId = ''
  }

  // 公開 API
  window.ScrollNavApp.initNav = initNav
  window.ScrollNavApp.getActiveId = getActiveId
  window.ScrollNavApp.destroyNav = destroyNav
})()
