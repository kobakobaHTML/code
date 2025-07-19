const codeArea = document.getElementById("codeArea");
const preview = document.getElementById("preview");
const displayBtn = document.getElementById("displayBtn");

function updatePreview() {
  preview.srcdoc = codeArea.value;
}

displayBtn.addEventListener("click", updatePreview);

// void要素リスト
const voidElements = [
  "area", "base", "br", "col", "embed", "hr", "img",
  "input", "link", "meta", "source", "track", "wbr"
];

// オートクローズとリアルタイムプレビュー
codeArea.addEventListener("input", () => {
  const value = codeArea.value;
  const cursorPos = codeArea.selectionStart;

  const openTagMatch = value.slice(0, cursorPos).match(/<([a-zA-Z][a-zA-Z0-9]*)>$/);

  if (openTagMatch) {
    const tagName = openTagMatch[1].toLowerCase();

    if (!voidElements.includes(tagName)) {
      const insertText = `</${tagName}>`;

      if (value.slice(cursorPos, cursorPos + insertText.length) !== insertText) {
        const newValue = value.slice(0, cursorPos) + insertText + value.slice(cursorPos);
        codeArea.value = newValue;
        codeArea.selectionStart = codeArea.selectionEnd = cursorPos;
      }
    }
  }

  updatePreview();
});

// ⬇️ 自動インデント処理（Enterキー対応）
codeArea.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault(); // デフォルトの改行を無効化

    const start = codeArea.selectionStart;
    const value = codeArea.value;

    // 現在の行を取得
    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    const currentLine = value.slice(lineStart, start);

    // 現在行のインデント（先頭の空白）を取得
    const indentMatch = currentLine.match(/^\s*/);
    const indent = indentMatch ? indentMatch[0] : "";

    // 新しい値を挿入
    const insertText = "\n" + indent;
    const newValue = value.slice(0, start) + insertText + value.slice(start);

    codeArea.value = newValue;

    // カーソル位置をインデント後の位置に移動
    const newCursorPos = start + insertText.length;
    codeArea.selectionStart = codeArea.selectionEnd = newCursorPos;

    updatePreview();
  }
});

// 最初のプレビュー表示
updatePreview();
