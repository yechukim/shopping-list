document.body.innerHTML = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/css/all.min.css"
      integrity="sha512-1sCRPdkRXhBV2PBLUdRb4tMg1w2YPf37qatUFeS7zlBy7jJI8Lf4VHwWfZZfpXtYSLy85pkm9GaYVYMfw5BC1A=="
      crossorigin="anonymous"
      referrerpolicy="no-referrer"
    />
    <link rel="stylesheet" href="style.css" />
    <title>Shopping List</title>
  </head>
  <body>
    <div class="container">
      <header>
        <img src="images/note.png" alt="" />
        <h1>Shopping List</h1>
      </header>
      <form id="item-form">
        <div class="form-control">
          <input
            type="text"
            class="form-input"
            id="item-input"
            name="item"
            placeholder="Enter Item"
          />
        </div>
        <div class="form-control">
          <button type="submit" class="btn">
            <i class="fa-solid fa-plus"></i> Add Item
          </button>
        </div>
      </form>

      <div class="filter">
        <input
          type="text"
          class="form-input-filter"
          id="filter"
          placeholder="Filter Items"
        />
      </div>

      <ul id="item-list" class="items">
        <!-- <li>
          Apples
          <button class="remove-item btn-link text-red">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </li>
        <li>
          Orange Juice
          <button class="remove-item btn-link text-red">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </li>
        <li>
          Oreos
          <button class="remove-item btn-link text-red">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </li>
        <li>
          Milk
          <button class="remove-item btn-link text-red">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </li> -->
      </ul>

      <button id="clear" class="btn-clear">Clear All</button>
    </div>

    <script src="script.js"></script>
  </body>
</html>
  `;

const script = require('./script');

describe('Add Item 버튼이 눌렸을 때, 입력값이 없으면', () => {
    let e;
    beforeEach(() => {
        e = {
            preventDefault: jest.fn(), // preventDefault 메서드를 가짐
            target: { value: 'Sample Value' } // target 속성을 가짐
        };
  
        // HTML 요소를 생성하여 테스트에 사용합니다.
        document.getElementById('item-input').value = '';
    });

    test('아이템을 저장하지 않는다', () => {
        script.onAddItemSubmit(e);
        expect(localStorage.getItem('items')).toBe(null);
    });
});

describe('Add Item 버튼이 눌렸을 때, 입력값이 있고 기존에 없는 값이면', () => {
    let e;
    beforeEach(() => {
        e = {
            preventDefault: jest.fn(), // preventDefault 메서드를 가짐
            target: { value: 'Sample Value' } // target 속성을 가짐
        };
  
        // HTML 요소를 생성하여 테스트에 사용합니다.
        document.getElementById('item-input').value = 'item1';
        localStorage.setItem('items', JSON.stringify(['item2', 'item3']));
    });

    test('아이템을 저장한다', () => {
        script.onAddItemSubmit(e);

        const items = JSON.parse(localStorage.getItem('items'));
        expect(items).toContain('item1');
    });

    test("입력값을 지운다.", () => {
        script.onAddItemSubmit(e);
        expect(document.getElementById('item-input').value).toBe('');
    });
});

describe('Add Item 버튼이 눌렸을 때, 입력값이 있고 동일한 아이템이 이미 존재하면', () => {
    let e;
    beforeEach(() => {
        e = {
            preventDefault: jest.fn(), // preventDefault 메서드를 가짐
            target: { value: 'Sample Value' } // target 속성을 가짐
        };
  
        // HTML 요소를 생성하여 테스트에 사용합니다.
        document.getElementById('item-input').value = 'item1';
        localStorage.setItem('items', JSON.stringify(['item1']));
    });

    test('아이템을 중복 저장하지 않는다', () => {
        script.onAddItemSubmit(e);

        const items = JSON.parse(localStorage.getItem('items'));
        const filteredItems = items.filter(item => item === 'item1');
        expect(filteredItems).toHaveLength(1);
    });

    test("입력값을 지우지 않는다", () => {
        script.onAddItemSubmit(e);
        expect(document.getElementById('item-input').value).not.toBe('');
    });
});