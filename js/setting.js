'use strict';
document.addEventListener('DOMContentLoaded', () => {
  const nameInput = document.getElementById('name');
  const birthdayInput = document.getElementById('birthday');
  const fontSelect = document.getElementById('font');
  const colorPicker = document.getElementById('color-picker');
  const iconUpload = document.getElementById('icon-upload');
  const iconPreview = document.getElementById('icon-preview');
  const resetBtn = document.getElementById('reset-btn');

  // 自動復元
  nameInput.value = localStorage.getItem('setting-name') || '';
  birthdayInput.value = localStorage.getItem('setting-birthday') || '';
  fontSelect.value = localStorage.getItem('setting-font') || 'Pacifico';
  colorPicker.value = localStorage.getItem('setting-color') || '#FAEDFA';
  const savedIcon = localStorage.getItem('setting-icon');
  if (savedIcon && savedIcon.startsWith('data:image/')) {
    iconPreview.src = savedIcon;
  }

  // 自動保存
  nameInput.addEventListener('input', () => {
    localStorage.setItem('setting-name', nameInput.value);
  });

  birthdayInput.addEventListener('input', () => {
    localStorage.setItem('setting-birthday', birthdayInput.value);
  });

  fontSelect.addEventListener('change', () => {
    localStorage.setItem('setting-font', fontSelect.value);
    document.body.style.fontFamily = `'${fontSelect.value}', cursive`;
  });

  colorPicker.addEventListener('input', () => {
    localStorage.setItem('setting-color', colorPicker.value);
  });

  iconUpload.addEventListener('change', () => {
    const file = iconUpload.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const base64 = e.target.result;
        iconPreview.src = base64;
        localStorage.setItem('setting-icon', base64);
      };
      reader.readAsDataURL(file);
    }
  });

  resetBtn.addEventListener('click', () => {
    localStorage.clear();
    window.location.reload();
  });

  const savedFont = localStorage.getItem('setting-font');
  if (savedFont) {
    document.body.style.fontFamily = `'${savedFont}', cursive`;
  }
});

// アイコン選択時に即時プレビュー
document.getElementById('icon-upload').addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function () {
      document.getElementById('icon-preview').src = reader.result;
    };
    reader.readAsDataURL(file);
  }
});

document.getElementById('settings-form').addEventListener('submit', function (e) {
  e.preventDefault();

  // 画像ファイルの取得
  const file = document.getElementById('icon-upload').files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function () {
      // 画像のBase64文字列を保存
      localStorage.setItem('userIcon', reader.result);

      alert('設定が保存されました！');
      // メニューに戻る or 任意の処理
      window.location.href = 'menu.html';
    };
    reader.readAsDataURL(file);
  } else {
    // 画像選ばれてない場合でも保存（旧画像のまま）
    alert('画像が選ばれていませんが、他の設定は保存されました。');
    window.location.href = 'menu.html';
  }
});

