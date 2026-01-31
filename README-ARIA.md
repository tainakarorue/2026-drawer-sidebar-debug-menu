# ARIA属性ガイド

ARIA（Accessible Rich Internet Applications）は、Webコンテンツやアプリケーションをアクセシブルにするための仕様です。スクリーンリーダーなどの支援技術がコンテンツを正しく解釈できるようにします。

---

## このプロジェクトで使用しているARIA属性

### 1. aria-hidden

要素を支援技術から隠すかどうかを指定します。

```html
<aside class="drawer" id="drawer" aria-hidden="true">
```

| 値 | 説明 |
|---|------|
| `true` | 支援技術から隠す（読み上げられない） |
| `false` | 支援技術に公開する（読み上げられる） |

**使用場面:**
- ドロワーメニューが閉じている時は `true`
- 開いている時は `false` に動的に変更

```javascript
this.drawer.setAttribute('aria-hidden', !this.isOpen);
```

---

### 2. aria-expanded

トグルボタンなどの要素が、関連するコンテンツを展開しているかどうかを示します。

```html
<button class="drawer-toggle" aria-expanded="false">
```

| 値 | 説明 |
|---|------|
| `true` | 関連コンテンツが展開されている |
| `false` | 関連コンテンツが折りたたまれている |

**使用場面:**
- メニュートグルボタン
- アコーディオン
- ドロップダウン

```javascript
this.toggle.setAttribute('aria-expanded', this.isOpen);
```

---

### 3. aria-controls

この要素が制御する対象要素のIDを指定します。

```html
<button aria-controls="drawer" aria-expanded="false">
  メニュー
</button>

<aside id="drawer">...</aside>
```

**効果:**
- ボタンと制御対象の関係を明示
- 支援技術がこの関連を認識し、ユーザーに伝える

---

### 4. aria-label

要素に対して、視覚的なラベルがない場合にアクセシブルな名前を提供します。

```html
<button aria-label="メニューを開く">
  <span class="icon">☰</span>
</button>

<nav aria-label="デバッグメニュー">...</nav>
```

**使用場面:**
- アイコンのみのボタン
- 複数の `<nav>` 要素を区別する場合
- 視覚的なテキストがない要素

---

## その他の主要なARIA属性

### aria-labelledby

別の要素のIDを参照してラベルを設定します。

```html
<h2 id="dialog-title">設定</h2>
<div role="dialog" aria-labelledby="dialog-title">
  ...
</div>
```

**aria-label との違い:**
- `aria-label`: 直接テキストを指定
- `aria-labelledby`: 別要素のテキストを参照

---

### aria-describedby

要素の追加説明を別の要素から参照します。

```html
<input type="password" aria-describedby="password-hint">
<p id="password-hint">8文字以上で入力してください</p>
```

---

### aria-live

動的に変化するコンテンツを支援技術に通知します。

```html
<div aria-live="polite">
  <!-- ここの内容が変わると読み上げられる -->
</div>
```

| 値 | 説明 |
|---|------|
| `off` | 通知しない（デフォルト） |
| `polite` | 現在の読み上げ完了後に通知 |
| `assertive` | 即座に割り込んで通知（緊急時のみ） |

**使用場面:**
- 通知メッセージ
- フォームバリデーションエラー
- 読み込み状態の変化

---

### aria-current

現在のアイテムを示します（ナビゲーションなど）。

```html
<nav>
  <a href="/" aria-current="page">ホーム</a>
  <a href="/about">会社概要</a>
  <a href="/contact">お問い合わせ</a>
</nav>
```

| 値 | 説明 |
|---|------|
| `page` | 現在のページ |
| `step` | 現在のステップ（ウィザードなど） |
| `location` | 現在の位置（パンくずなど） |
| `true` | 現在のアイテム（汎用） |

---

### aria-disabled

要素が無効化されていることを示します（操作不可）。

```html
<button aria-disabled="true">送信</button>
```

**`disabled`属性との違い:**
- `disabled`: フォーカス不可、イベント発火しない
- `aria-disabled`: フォーカス可能、カスタム動作が可能

---

### aria-required

フォームフィールドが必須であることを示します。

```html
<input type="email" aria-required="true">
```

---

### aria-invalid

フォームフィールドの値が無効であることを示します。

```html
<input type="email" aria-invalid="true" aria-describedby="email-error">
<p id="email-error">有効なメールアドレスを入力してください</p>
```

---

### aria-pressed

トグルボタンの現在の状態を示します。

```html
<button aria-pressed="false">ダークモード</button>
```

| 値 | 説明 |
|---|------|
| `true` | 押された状態（ON） |
| `false` | 押されていない状態（OFF） |
| `mixed` | 一部ON/OFF混在 |

---

### aria-selected

リストやタブで選択されたアイテムを示します。

```html
<div role="tablist">
  <button role="tab" aria-selected="true">タブ1</button>
  <button role="tab" aria-selected="false">タブ2</button>
</div>
```

---

### aria-haspopup

要素がポップアップ（メニュー、ダイアログなど）を持つことを示します。

```html
<button aria-haspopup="menu" aria-expanded="false">
  オプション
</button>
```

| 値 | 説明 |
|---|------|
| `menu` | メニューが開く |
| `listbox` | リストボックスが開く |
| `dialog` | ダイアログが開く |
| `true` | 汎用ポップアップ |

---

## role属性

ARIA属性と一緒に使用する`role`属性。要素の役割を明示します。

```html
<!-- ボタンとして振る舞うdiv -->
<div role="button" tabindex="0">クリック</div>

<!-- ダイアログ -->
<div role="dialog" aria-modal="true" aria-labelledby="title">
  <h2 id="title">確認</h2>
  ...
</div>

<!-- アラート -->
<div role="alert">エラーが発生しました</div>

<!-- ナビゲーション -->
<div role="navigation" aria-label="メインメニュー">...</div>
```

### 主要なrole値

| role | 説明 |
|------|------|
| `button` | ボタン |
| `dialog` | ダイアログ/モーダル |
| `alert` | 警告メッセージ（自動読み上げ） |
| `alertdialog` | 警告ダイアログ |
| `menu` | メニュー |
| `menuitem` | メニュー項目 |
| `tab` | タブ |
| `tablist` | タブリスト |
| `tabpanel` | タブパネル |
| `navigation` | ナビゲーション |
| `main` | メインコンテンツ |
| `banner` | ヘッダー/バナー |
| `contentinfo` | フッター |
| `search` | 検索領域 |
| `complementary` | 補足コンテンツ |

---

## ベストプラクティス

### 1. セマンティックHTMLを優先する

```html
<!-- 良い例：ネイティブ要素を使用 -->
<button>送信</button>

<!-- 避けるべき例：divにroleを付与 -->
<div role="button" tabindex="0">送信</div>
```

### 2. 状態変化を動的に更新する

```javascript
// メニュー開閉時にARIA属性を更新
function toggleMenu() {
  const isOpen = menu.classList.toggle('is-open');
  button.setAttribute('aria-expanded', isOpen);
  menu.setAttribute('aria-hidden', !isOpen);
}
```

### 3. フォーカス管理を行う

```javascript
// モーダルを開いた時にフォーカスを移動
function openModal() {
  modal.setAttribute('aria-hidden', 'false');
  modal.querySelector('button').focus();
}
```

### 4. キーボード操作に対応する

```javascript
// Escapeキーでモーダルを閉じる
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && isModalOpen) {
    closeModal();
  }
});
```

---

## テストツール

- **axe DevTools**: Chrome/Firefox拡張機能
- **WAVE**: Webアクセシビリティ評価ツール
- **Lighthouse**: Chrome DevToolsのアクセシビリティ監査
- **NVDA / VoiceOver**: スクリーンリーダーでの実機テスト

---

## 参考リンク

- [WAI-ARIA 1.2 仕様](https://www.w3.org/TR/wai-aria-1.2/)
- [MDN ARIA ガイド](https://developer.mozilla.org/ja/docs/Web/Accessibility/ARIA)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
