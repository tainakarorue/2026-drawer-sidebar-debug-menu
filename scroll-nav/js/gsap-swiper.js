/**
 * GSAP アニメーション名前空間
 */
var GsapAnimations = window.GsapAnimations || {}

/**
 * GSAP + Swiper スライダーの初期化
 */
GsapAnimations.slider = function () {
  var sliderEl = document.querySelector('.gsap-slider')
  if (!sliderEl) return

  function animateSlide(swiper) {
    var activeSlide = swiper.slides[swiper.activeIndex]
    var title = activeSlide.querySelector('.slide-title')
    var description = activeSlide.querySelector('.slide-description')

    var tl = gsap.timeline()

    tl.fromTo(
      title,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
    ).fromTo(
      description,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.5 },
      '-=0.3',
    )
  }

  new Swiper('.gsap-slider', {
    speed: 0,
    slidesPerView: 1,
    spaceBetween: 0,
    loop: false,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    on: {
      init: function () {
        animateSlide(this)
      },
      slideChangeTransitionStart: function () {
        animateSlide(this)
      },
    },
  })
}
