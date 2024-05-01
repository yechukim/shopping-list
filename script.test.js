import * as innerHTMLForTest from './scriptTestHTMLSetup.js';
import * as script from './script.js';

window.alert = jest.fn()

function initialize() {
  // 테스트 시작하기 전에 다른 테스트에서 설정한 값을 초기화하는 작업
  script.clearItems();
}

describe('Add Item 버튼이 눌렸을 때, 입력값이 없으면', () => {
    let e;
    beforeEach(() => {
        initialize();
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
      initialize();
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
      initialize();
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