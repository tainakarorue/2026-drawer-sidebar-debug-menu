/**
 * GSAP アニメーション名前空間
 */
var GsapAnimations = window.GsapAnimations || {}

/**
 * セクションのスクロールアニメーション
 * - 共通アニメーション（全セクション）
 * - セクション固有のアニメーション
 * - タイムライン、スクロールトリガー、stagger 等のサンプル
 */
GsapAnimations.sections = function () {
  // ========================================
  // 共通アニメーション: 全セクションのタイトル
  // ========================================
  gsap.utils.toArray('.section-title').forEach(function (title) {
    gsap.fromTo(
      title,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: title,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      },
    )
  })

  // ========================================
  // Section 1: stagger（複数要素を順番にアニメーション）
  // ========================================
  var section1Boxes = document.querySelectorAll('#section-1 .box')
  if (section1Boxes.length) {
    gsap.fromTo(
      section1Boxes,
      { opacity: 0, y: 50, scale: 0.8 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: 'back.out(1.7)',
        stagger: 0.15, // 0.15秒ずつずらして実行
        scrollTrigger: {
          trigger: '#section-1',
          start: 'top 60%',
          toggleActions: 'play none none reverse',
        },
      },
    )
  }

  // ========================================
  // Section 2: timeline（複数アニメーションを連続実行）
  // ========================================
  var section2 = document.querySelector('#section-2')
  if (section2) {
    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#section-2',
        start: 'top 60%',
        toggleActions: 'play none none reverse',
      },
    })

    // 中央の円がスケールイン
    tl.fromTo(
      '#section-2 .circle',
      { opacity: 0, scale: 0 },
      { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' },
    )
      // 円が回転しながら色が変わる
      .to('#section-2 .circle', {
        rotation: 360,
        backgroundColor: '#60a5fa',
        duration: 0.8,
        ease: 'power2.inOut',
      })
      // 周囲のドットが広がる
      .fromTo(
        '#section-2 .dot',
        { opacity: 0, scale: 0 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          stagger: 0.1,
          ease: 'power2.out',
        },
        '-=0.3', // 前のアニメーションと重ねる
      )
  }

  // ========================================
  // Section 3: scrub（スクロール量に連動）
  // ========================================
  var section3 = document.querySelector('#section-3')
  if (section3) {
    // 横スクロール風の動き（スクロールに連動）
    gsap.to('#section-3 .horizontal-box', {
      x: function (i) {
        return (i + 1) * 100 // 各要素で移動量を変える
      },
      rotation: function (i) {
        return (i + 1) * 90
      },
      scrollTrigger: {
        trigger: '#section-3',
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1, // スクロールに1秒遅れて追従
      },
    })

    // パララックス効果（背景要素がゆっくり動く）
    gsap.to('#section-3 .parallax-bg', {
      y: -100,
      ease: 'none',
      scrollTrigger: {
        trigger: '#section-3',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })
  }
}
