document.addEventListener('DOMContentLoaded', function () {
  // Lenis + ScrollTrigger を初期化
  ScrollNavApp.init()

  // ナビゲーションを初期化（HTML で作成したナビに機能を付与）
  ScrollNavApp.initNav({
    // navSelector: '[data-scroll-target]',  // ナビアイテムのセレクタ（デフォルト）
    // activeClass: 'is-active',             // アクティブ時のクラス（デフォルト）
  })

  // GSAP アニメーションの初期化
  GsapAnimations.slider()
  GsapAnimations.sections()
})
