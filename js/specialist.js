const columnOrder = ['A', 'KA', 'SA', 'TA', 'NA', 'HA', 'MA', 'YA', 'RA', 'WA', 'Adviser'];
const container = document.getElementById("specialist-container");

let specialistMap = {};

const createSpecialistList = (column, specialists) => {
  const ul = document.createElement("ul");
  ul.classList.add('specialist-list');
  ul.dataset.column = column;

  specialists.forEach(data => {
    const item = document.createElement("li");
    item.className = "specialist-item gap16";
    item.innerHTML = `
      <div class="specialist-item-head">
        <img src="/image/explain/specialist/${data.image}" alt="${data.name}" class="specialist-item-img">
        <h4 class="title-explain font-rounded specialist-item-title">
          ${data.name}<span>${data.ruby}</span>
        </h4>
      </div>
      <div>
        <h5 class="specialist-item-contents-title">自己紹介</h5>
        <p class="specialist-item-contents-text">${Array.isArray(data.intro) ? data.intro.join("<br>") : data.intro}</p>
      </div>
      <div>
        <h5 class="specialist-item-contents-title">メッセージ</h5>
        <p class="specialist-item-contents-text">${Array.isArray(data.message) ? data.message.join("<br>") : data.message}</p>
      </div>
      ${data.audio ? `
        <div class="button-wrap specialist-item-button-wrap">
          <a class="button button-red button-blank button-small2" href="${data.audio}" target="_blank" rel="noopener">
            サンプル音声（vimeoで聴く）
          </a>
        </div>` : ''}
    `;
    ul.appendChild(item);
  });

  return ul;
}

const initSpecialists = async () => {
  try {
    const response = await fetch('/json/specialists.json');
    const data = await response.json();
    specialistMap = data;

    const tabButtons = document.querySelectorAll('.specialist-tab-button[data-tab]');

    tabButtons.forEach(button => {
      const column = button.dataset.tab;
      const specialists = specialistMap[column];

      if (!specialists || specialists.length === 0) {
        button.disabled = true;
        return;
      };

      button.addEventListener('click', () => {

        // タブのスタイル切り替え
        tabButtons.forEach(t => t.classList.remove('active'));
        button.classList.add('active');

        // 表示内容差し替え
        container.innerHTML = '';
        const list = createSpecialistList(column, specialists);
        container.appendChild(list);
      });
    });

    // 初期表示（最初のタブ）
    const defaultColumn = columnOrder[0];
    const defaultSpecialists = data[defaultColumn];
    if (defaultSpecialists) {
      const defaultList = createSpecialistList(defaultColumn, defaultSpecialists);
      container.appendChild(defaultList);
      document.querySelector(`[data-tab="${defaultColumn}"]`)?.classList.add('active');
    }
  } catch (e) {
    window.alert('予期せぬエラーが発生しました。ページを再読み込みしてください。');
  }
}

initSpecialists();
