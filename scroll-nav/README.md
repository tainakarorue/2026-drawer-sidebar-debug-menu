# ScrollNav 使用マニュアル

スクロール連動型ナビゲーションをバニラ JavaScript で実装するためのライブラリです。

## ファイル構成

```
html/
├── js/
│   ├── scroll-nav-init.js  # Lenis + ScrollTrigger 初期化
│   ├── scroll-nav.js       # ナビゲーション機能
│   ├── gsap-swiper.js      # Swiper + GSAP スライダー
│   ├── gsap-sections.js    # セクションアニメーション
│   └── init.js             # 初期化（各機能を呼び出す）
├── css/
│   ├── scroll-nav.css      # ナビゲーションスタイル
│   └── gsap-slider.css     # スライダースタイル
├── index.html              # サンプルページ
└── README.md               # このファイル
```

## 導入手順

### 1. CDN の読み込み

HTML の `</body>` 直前に以下を追加します。

```html
<!-- GSAP + ScrollTrigger -->
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>

<!-- Lenis -->
<script src="https://cdn.jsdelivr.net/npm/lenis@1.1.18/dist/lenis.min.js"></script>

<!-- Swiper（スライダーを使用する場合） -->
<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
```

### 2. ScrollNav ファイルの読み込み

```html
<!-- ScrollNav -->
<script src="js/scroll-nav-init.js"></script>
<script src="js/scroll-nav.js"></script>

<!-- GSAP アニメーション -->
<script src="js/gsap-swiper.js"></script>
<script src="js/gsap-sections.js"></script>

<!-- 初期化 -->
<script src="js/init.js"></script>
```

### 3. CSS の読み込み

`<head>` 内に追加します。

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css">
<link rel="stylesheet" href="css/scroll-nav.css">
<link rel="stylesheet" href="css/gsap-slider.css">
```

### 4. HTML にセクションを追加

各セクションに一意の `id` を付与します。

```html
<section id="section-1">Section 1</section>
<section id="section-2">Section 2</section>
<section id="section-3">Section 3</section>
```

### 5. HTML にナビゲーションを作成

`data-scroll-target` 属性でターゲットセクションの ID を指定します。
中身は自由にカスタマイズできます（テキスト、アイコン、画像など）。

```html
<nav class="scroll-nav">
  <!-- テキストのみ -->
  <button class="scroll-nav__item" data-scroll-target="section-1">
    Section 1
  </button>

  <!-- アイコン + テキスト -->
  <button class="scroll-nav__item" data-scroll-target="section-2">
    <i class="icon">🔥</i> Section 2
  </button>

  <!-- a タグでも OK -->
  <a href="#section-3" class="scroll-nav__item" data-scroll-target="section-3">
    Section 3
  </a>
</nav>
```

### 6. 初期化

```html
<script>
  document.addEventListener('DOMContentLoaded', function () {
    // Lenis + ScrollTrigger を初期化
    ScrollNavApp.init()

    // ナビゲーションを初期化（HTML で作成したナビに機能を付与）
    ScrollNavApp.initNav()

    // GSAP アニメーションを初期化
    GsapAnimations.slider()
    GsapAnimations.sections()
  })
</script>
```

---

## GSAP アニメーション

GSAP アニメーションは `GsapAnimations` 名前空間で管理されています。

### 名前空間について

グローバルスコープの汚染を防ぐため、すべてのアニメーション関数は `GsapAnimations` オブジェクトにまとめられています。

```js
var GsapAnimations = window.GsapAnimations || {}

GsapAnimations.slider   // スライダーアニメーション
GsapAnimations.sections // セクションアニメーション
```

複数ファイルで同じ名前空間を共有するため、各ファイルの先頭で `window.GsapAnimations || {}` を使用しています。これにより、ファイルの読み込み順序に関係なく、既存の定義を上書きせずに機能を追加できます。

### アクセシビリティ（reduced-motion 対応）

アニメーションを減らす設定を有効にしているユーザーへの配慮として、`prefers-reduced-motion` メディアクエリを使用してアニメーションを無効化できます。

```js
document.addEventListener('DOMContentLoaded', function () {
  ScrollNavApp.init()
  ScrollNavApp.initNav()

  // reduced-motion が有効な場合はアニメーションをスキップ
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    GsapAnimations.slider()
    GsapAnimations.sections()
  }
})
```

### gsap-sections.js

セクションにスクロール連動アニメーションを追加するサンプルです。

#### 使用している GSAP 機能

| 機能 | 説明 | 使用箇所 |
|------|------|----------|
| `scrollTrigger` | スクロール位置でアニメーション発火 | 全セクション |
| `toggleActions` | スクロール方向で再生/逆再生を制御 | タイトル、Section 1, 2 |
| `stagger` | 複数要素を順番にアニメーション | Section 1 |
| `timeline` | 複数アニメーションを連続実行 | Section 2 |
| `scrub` | スクロール量に連動してアニメーション | Section 3 |

#### コード例

**共通アニメーション（全セクションのタイトル）**

```js
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
```

**stagger（複数要素を順番にアニメーション）**

```js
gsap.fromTo(
  '.box',
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
```

**timeline（複数アニメーションを連続実行）**

```js
var tl = gsap.timeline({
  scrollTrigger: {
    trigger: '#section-2',
    start: 'top 60%',
    toggleActions: 'play none none reverse',
  },
})

tl.fromTo('.circle', { scale: 0 }, { scale: 1, duration: 0.5 })
  .to('.circle', { rotation: 360, duration: 0.8 })
  .fromTo('.dot', { scale: 0 }, { scale: 1, stagger: 0.1 }, '-=0.3')
```

**scrub（スクロール量に連動）**

```js
gsap.to('.horizontal-box', {
  x: 100,
  rotation: 90,
  scrollTrigger: {
    trigger: '#section-3',
    start: 'top 80%',
    end: 'bottom 20%',
    scrub: 1, // スクロールに1秒遅れて追従
  },
})
```

### gsap-swiper.js

Swiper と GSAP を連動させたスライダーです。

```js
GsapAnimations.slider = function () {
  new Swiper('.gsap-slider', {
    speed: 0, // Swiperのトランジションを無効化
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
```

---

## API リファレンス

### `ScrollNavApp.init(options)`

Lenis と ScrollTrigger を初期化します。

| パラメータ | 型 | デフォルト | 説明 |
|-----------|-----|-----------|------|
| `options.duration` | number | `1.1` | スクロールアニメーションの長さ |
| `options.easing` | function | exponential | イージング関数 |

```js
ScrollNavApp.init({
  duration: 1.5,
})
```

### `ScrollNavApp.initNav(config)`

HTML で作成したナビゲーションにスクロール連動機能を付与します。

| パラメータ | 型 | デフォルト | 説明 |
|-----------|-----|-----------|------|
| `config.navSelector` | string | `'[data-scroll-target]'` | ナビアイテムのセレクタ |
| `config.activeClass` | string | `'is-active'` | アクティブ時のクラス名 |

```js
ScrollNavApp.initNav({
  navSelector: '[data-scroll-target]',
  activeClass: 'is-active',
})
```

### `ScrollNavApp.getLenis()`

Lenis インスタンスを取得します。

```js
const lenis = ScrollNavApp.getLenis()
lenis.scrollTo('#section-2')
```

### `ScrollNavApp.getActiveId()`

現在アクティブなセクション ID を取得します。

```js
const currentSection = ScrollNavApp.getActiveId()
console.log(currentSection) // 'section-1'
```

### `ScrollNavApp.destroyNav()`

ナビゲーションの機能を破棄します（イベントリスナーと ScrollTrigger をクリア）。

```js
ScrollNavApp.destroyNav()
```

### `ScrollNavApp.destroy()`

Lenis と ScrollTrigger を破棄します。

```js
ScrollNavApp.destroy()
```

## スタイルのカスタマイズ

ナビゲーションは HTML で自由に作成できるため、CSS も自由にカスタマイズできます。

```css
/* ナビコンテナ */
.scroll-nav {
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 50;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* ナビアイテム */
.scroll-nav__item {
  padding: 0.5rem 1rem;
  background-color: #e5e7eb;
  border-radius: 0.25rem;
  color: #000;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.scroll-nav__item:hover {
  background-color: #d1d5db;
}

/* アクティブ状態 */
.scroll-nav__item.is-active {
  background-color: #000;
  color: #fff;
}
```

## 機能

- スクロール位置に応じてナビゲーションのアクティブ状態が自動更新
- ナビクリックでスムーズスクロール
- URL ハッシュとの同期（ブラウザバック対応）
- Lenis によるスムーズなスクロール体験
- HTML でナビを自由にカスタマイズ可能（テキスト、アイコン、画像など）
- GSAP によるセクションアニメーション（stagger, timeline, scrub）

## 動作確認

`index.html` をブラウザで開いて動作を確認できます。
