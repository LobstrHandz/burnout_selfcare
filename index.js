(() => {
  const groups = [
    {
      title: 'Утро',
      items: [
        'Проснуться и встать с кровати',
        'Умыться, почистить зубы',
        'Выпить воды',
        'Позавтракать',
        'Открыть окно или выйти на дневной свет'
      ]
    },
    {
      title: 'В течение дня',
      items: [
        'Пообедать',
        'Попить воды',
        'Немного подвигаться или прогуляться',
        'Сделать паузу между делами',
        'Сделать что-нибудь приятное для себя'
      ]
    },
    {
      title: 'Вечер',
      items: [
        'Поужинать',
        'Позаботиться о гигиене',
        'Вспомнить, что сегодня было хорошего, за что вы благодарны',
        'Уменьшить информационную нагрузку',
        'Подготовиться ко сну'
      ]
    }
  ];

  const KEY = 'selfcare-checks';
  const CUSTOM_KEY = 'selfcare-custom';
  const list = document.querySelector('#list');
  const resetButton = document.querySelector('#resetButton');

  let state, customItems;

  function getSavedData(key, defaultValue) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value || defaultValue
    } catch (error) {
      return defaultValue;
    }
  }

  function putItem(key, newValue) {
    try {
      localStorage.setItem(key, JSON.stringify(newValue))
    } catch (error) {}
  }

  function checkboxHandler(targetElement, rowId) {
    if (targetElement) {
      if (targetElement.checked) {
        state[rowId] = 1;
      } else {
        delete state[rowId];
      }
      
      putItem(KEY, state)
    }
  }

  function deleteButtonHandler(rowId) {
    customItems = customItems.filter(({ id }) => id !== rowId);
    delete state[rowId];
    putItem(KEY, state);
    putItem(CUSTOM_KEY, customItems);
    render();
  }

  function okButtonHandler(groupIndex, inputValue) {
    const trimmedValue = inputValue.trim();
    
    if (!trimmedValue) {
      render();
      return;
    }
    
    customItems.push({
      id: 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      g: groupIndex,
      t: trimmedValue
    });
    
    putItem(CUSTOM_KEY, customItems);
    render();
  }

  function newItemInputHandler(eventKey) {
    switch (eventKey) {
      case 'Enter':
        okButtonHandler();
        break;
      case 'Escape':
        render();
        break;
      default:
        return;
    }
  }

  function addButtonHandler(groupIndex, containerElement) {
    const inputElement = document.createElement('input');
    const okButtonElement = document.createElement('button');

    containerElement.textContent = '';

    inputElement.type = 'text';
    inputElement.className = 'text';
    inputElement.maxLength = 120;
    inputElement.placeholder = 'Например: позвонить подруге';

    okButtonElement.type = 'button';
    okButtonElement.className = 'ok-button';
    okButtonElement.textContent = 'Добавить';

    okButtonElement.addEventListener('click', function() {
      okButtonHandler(groupIndex, inputElement.value);
    });

    inputElement.addEventListener('keydown', function ({ key }) {
      newItemInputHandler(key);
    });

    containerElement.appendChild(inputElement);
    containerElement.appendChild(okButtonElement);

    inputElement.focus()
  }

  function resetButtonHandler() {
    state = {};
    putItem(KEY, state);
    render();
  }

  function createRow(rowId, text, isCustom) {
    const rowElement = document.createElement('div');
    const labelElement = document.createElement('label');
    const labelTextElement = document.createElement('span');
    const checkboxElement = document.createElement('input');

    rowElement.className = 'row';

    checkboxElement.type = 'checkbox';
    checkboxElement.checked = !!state[rowId];
    checkboxElement.addEventListener('change', function (event) {
      checkboxHandler(event.target, rowId);
    });
    
    labelTextElement.textContent = text;

    labelElement.appendChild(checkboxElement);
    labelElement.appendChild(labelTextElement);
    rowElement.appendChild(labelElement);

    if (isCustom) {
      const buttonElement = document.createElement('button');

      buttonElement.type = 'button';
      buttonElement.className = 'delete-button';
      buttonElement.setAttribute('aria-label', 'Удалить пункт');
      buttonElement.textContent = '×';
      buttonElement.addEventListener('click', function () {
        deleteButtonHandler(rowId);
      });

      rowElement.appendChild(buttonElement)
    }

    return rowElement;
  }

  function createAddButton(groupIndex) {
    const containerElement = document.createElement('div');
    const buttonElement = document.createElement('button');

    containerElement.className = 'add-button-container';
    
    buttonElement.type = 'button';
    buttonElement.className = 'add-button';
    buttonElement.textContent = '+ Добавить свой пункт';
    buttonElement.addEventListener('click', function () {
      addButtonHandler(groupIndex, containerElement);
    });

    containerElement.appendChild(buttonElement);
    
    return containerElement;
  }

  function render() {
    list.textContent = '';

    groups.forEach((group, groupIndex) => {
      const sectionElement = document.createElement('section');
      const headerElement = document.createElement('h2');
      
      headerElement.textContent = group.title;
      sectionElement.appendChild(headerElement);

      group.items.forEach((text, groupItemIndex) => {
        sectionElement.appendChild(createRow(groupIndex + '-' + groupItemIndex, text, false));
      });

      customItems.forEach((cunstomItem) => {
        if (cunstomItem.g === groupIndex) {
          sectionElement.appendChild(createRow(cunstomItem.id, cunstomItem.t, true));
        }
      });
      
      sectionElement.appendChild(createAddButton(groupIndex));
      list.appendChild(sectionElement);
    })
  }

  function init() {
    state = getSavedData(KEY, {});
    customItems = getSavedData(CUSTOM_KEY, []);

    resetButton.addEventListener('click', function () {
      resetButtonHandler();
    });

    render();
  }

  init();
})();