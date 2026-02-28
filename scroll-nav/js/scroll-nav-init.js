/**
 * ScrollNav Init
 * Lenis + GSAP ScrollTrigger の初期化
 */
;(function () {
  'use strict'

  // グローバル名前空間
  window.ScrollNavApp = window.ScrollNavApp || {}

  let lenis = null
  let rafId = null

  /**
   * Lenis と ScrollTrigger を初期化
   * @param {Object} options - Lenis のオプション
   * @returns {Lenis} Lenis インスタンス
   */
  function init(options = {}) {
    if (lenis) {
      console.warn('ScrollNavApp: Already initialized')
      return lenis
    }

    // GSAP ScrollTrigger を登録
    gsap.registerPlugin(ScrollTrigger)

    // Lenis インスタンス生成
    const defaultOptions = {
      duration: 1.1,
      easing: function (t) {
        return Math.min(1, 1.001 - Math.pow(2, -10 * t))
      },
    }

    lenis = new Lenis(Object.assign({}, defaultOptions, options))

    // ScrollTrigger と同期
    lenis.on('scroll', ScrollTrigger.update)

    // RAF ループ
    function raf(time) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    // ScrollTrigger リフレッシュ時に Lenis をリサイズ
    function onRefresh() {
      lenis.resize()
    }
    ScrollTrigger.addEventListener('refresh', onRefresh)
    ScrollTrigger.refresh()

    // クリーンアップ用に保持
    window.ScrollNavApp._onRefresh = onRefresh

    return lenis
  }

  /**
   * Lenis インスタンスを取得
   * @returns {Lenis|null}
   */
  function getLenis() {
    return lenis
  }

  /**
   * 破棄
   */
  function destroy() {
    if (rafId) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
    if (window.ScrollNavApp._onRefresh) {
      ScrollTrigger.removeEventListener('refresh', window.ScrollNavApp._onRefresh)
    }
    if (lenis) {
      lenis.destroy()
      lenis = null
    }
  }

  // 公開 API
  window.ScrollNavApp.init = init
  window.ScrollNavApp.getLenis = getLenis
  window.ScrollNavApp.destroy = destroy
})()
