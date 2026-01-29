# シンプルドロワーメニュー

左サイドにスティッキーなドロワーメニュー、右にスクロール可能なメインコンテンツを配置するレイアウトです。

## 要件

- メニュー横幅：CSSカスタムプロパティで自由に設定
- トグル操作：ボタン / キーボード / 両方対応（設定で選択可能）
- 誤操作防止：スマートフォンのスワイプ等による意図しない開閉を考慮
- レイアウト：Flexbox使用（メニュー: shrink-0、コンテンツ: flex-1）
- メニュー：スクロール追従（sticky）、ビューポート高さを超えない
- ヘッダー対応：将来的なヘッダー追加に対応できる構造

## ファイル構成

```
.
├── index.html      # HTMLマークアップ
├── style.css       # スタイル定義
├── drawer.js       # ドロワー制御ロジック
└── README.md
```

## 実装の流れ

### Step 1: HTML構造の作成（index.html）

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Drawer Menu</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <!-- 将来的なヘッダー用スペース -->
  <!-- <header class="site-header">ヘッダー</header> -->

  <div class="layout">
    <!-- ドロワーメニュー -->
    <aside class="drawer" id="drawer" aria-hidden="true">
      <nav class="drawer__nav">
        <ul>
          <li><a href="#section1">セクション1</a></li>
          <li><a href="#section2">セクション2</a></li>
          <li><a href="#section3">セクション3</a></li>
        </ul>
      </nav>
    </aside>

    <!-- メインコンテンツ -->
    <main class="content">
      <button class="drawer-toggle" id="drawerToggle" aria-expanded="false" aria-controls="drawer">
        メニュー
      </button>

      <section id="section1">
        <h2>セクション1</h2>
        <p>コンテンツ...</p>
      </section>
      <!-- 他のセクション -->
    </main>
  </div>

  <script src="drawer.js"></script>
</body>
</html>
```

**ポイント:**
- `aria-hidden`、`aria-expanded`、`aria-controls` でアクセシビリティ対応
- ヘッダーを追加しても `.layout` 部分は独立して動作

---

### Step 2: CSS設計（style.css）

```css
:root {
  /* カスタマイズ可能な変数 */
  --drawer-width: 250px;
  --header-height: 0px; /* ヘッダー追加時に変更 */
  --transition-duration: 0.3s;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ヘッダー（将来用） */
.site-header {
  height: var(--header-height);
  background: #333;
  color: #fff;
  flex-shrink: 0;
}

/* メインレイアウト */
.layout {
  display: flex;
  flex: 1;
  min-height: calc(100vh - var(--header-height));
}

/* ドロワーメニュー */
.drawer {
  width: var(--drawer-width);
  flex-shrink: 0;
  background: #f5f5f5;
  border-right: 1px solid #ddd;

  /* スクロール追従 */
  position: sticky;
  top: var(--header-height);
  height: calc(100vh - var(--header-height));
  overflow-y: auto;

  /* 閉じた状態 */
  margin-left: calc(-1 * var(--drawer-width));
  transition: margin-left var(--transition-duration) ease;
}

/* 開いた状態 */
.drawer.is-open {
  margin-left: 0;
}

/* メインコンテンツ */
.content {
  flex: 1;
  min-width: 0; /* flex子要素のオーバーフロー対策 */
  padding: 20px;
}

/* トグルボタン */
.drawer-toggle {
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 100;
  padding: 12px 16px;
  background: #333;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
```

**ポイント:**
- `--drawer-width` で横幅を一元管理
- `--header-height` でヘッダー高さを考慮（初期値0）
- `position: sticky` + `height: calc(100vh - var(--header-height))` でスクロール追従
- 負の `margin-left` で閉じる（レイアウトシフトでコンテンツが広がる）

---

### Step 3: JavaScript実装（drawer.js）

```javascript
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
      toggleId: 'drawerToggle',
      trigger: {
        button: true,
        keyboard: true,
        key: 'm',
      },
    };

    this.config = { ...defaults, ...options };
    this.config.trigger = { ...defaults.trigger, ...options.trigger };

    this.drawer = document.getElementById(this.config.drawerId);
    this.toggle = document.getElementById(this.config.toggleId);
    this.isOpen = false;

    this.init();
  }

  init() {
    if (!this.drawer || !this.toggle) {
      console.error('Drawer: 必要な要素が見つかりません');
      return;
    }

    // ボタントリガー
    if (this.config.trigger.button) {
      this.toggle.addEventListener('click', () => this.toggleDrawer());
    }

    // キーボードトリガー
    if (this.config.trigger.keyboard) {
      document.addEventListener('keydown', (e) => this.handleKeydown(e));
    }
  }

  handleKeydown(e) {
    // 入力フィールドでは無効化（誤操作防止）
    const activeEl = document.activeElement;
    const isInputFocused =
      activeEl.tagName === 'INPUT' ||
      activeEl.tagName === 'TEXTAREA' ||
      activeEl.isContentEditable;

    if (isInputFocused) return;

    // 修飾キーとの組み合わせは無視（既存ショートカットとの衝突防止）
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    if (e.key.toLowerCase() === this.config.trigger.key.toLowerCase()) {
      e.preventDefault();
      this.toggleDrawer();
    }
  }

  toggleDrawer() {
    this.isOpen = !this.isOpen;
    this.drawer.classList.toggle('is-open', this.isOpen);
    this.drawer.setAttribute('aria-hidden', !this.isOpen);
    this.toggle.setAttribute('aria-expanded', this.isOpen);
  }

  open() {
    this.isOpen = true;
    this.drawer.classList.add('is-open');
    this.drawer.setAttribute('aria-hidden', 'false');
    this.toggle.setAttribute('aria-expanded', 'true');
  }

  close() {
    this.isOpen = false;
    this.drawer.classList.remove('is-open');
    this.drawer.setAttribute('aria-hidden', 'true');
    this.toggle.setAttribute('aria-expanded', 'false');
  }
}

// 初期化
document.addEventListener('DOMContentLoaded', () => {
  // 使用例：ボタンのみ
  // const drawer = new DrawerMenu({ trigger: { button: true, keyboard: false } });

  // 使用例：キーボードのみ（Escキー）
  // const drawer = new DrawerMenu({ trigger: { button: false, keyboard: true, key: 'Escape' } });

  // デフォルト：両方対応
  const drawer = new DrawerMenu();
});
```

**ポイント:**
- `trigger` オプションでボタン/キーボード/両方を選択可能
- 入力フィールドフォーカス時はキーボードトリガー無効（誤操作防止）
- Ctrl/Cmd/Alt との組み合わせは無視（既存ショートカット保護）

---

## カスタマイズ例

### メニュー幅を変更

```css
:root {
  --drawer-width: 300px;
}
```

### ヘッダーを追加した場合

```css
:root {
  --header-height: 60px;
}
```

### キーボードトリガーを変更

```javascript
const drawer = new DrawerMenu({
  trigger: {
    keyboard: true,
    key: 'Escape', // Escキーで開閉
  },
});
```

### ボタンのみ対応（キーボード無効）

```javascript
const drawer = new DrawerMenu({
  trigger: {
    button: true,
    keyboard: false,
  },
});
```

---

## 実装チェックリスト

- [ ] Step 1: index.html 作成
- [ ] Step 2: style.css 作成
- [ ] Step 3: drawer.js 作成
- [ ] 動作確認：ボタンクリックで開閉
- [ ] 動作確認：キー入力で開閉
- [ ] 動作確認：入力フィールドフォーカス時にキー無効
- [ ] 動作確認：メニューがスクロール追従
- [ ] 動作確認：ビューポート高さを超えた場合のメニュースクロール
