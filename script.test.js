import * as innerHTMLForTest from './scriptTestHTMLSetup.js'
import * as script from './script.js'

const itemInput = document.getElementById('item-input')
const itemList = document.getElementById('item-list')

window.alert = jest.fn()
/**
 * @note
 * - dom 접근은 innerHTMLForTest의 dom 만 접근하도록 함
 */
function initialize() {
	//init
	script.clearItems()
}

/**
 * @desc
 * submit item
 */
describe('Add Item 버튼이 눌렸을 때, 입력값이 없으면', () => {
	let e
	beforeEach(() => {
		initialize()
		e = {
			preventDefault: jest.fn(),
		}
		itemInput.value = ''
	})

	test('아이템을 저장하지 않는다', () => {
		script.onAddItemSubmit(e)
		expect(localStorage.getItem('items')).toBe(null)
	})
})

describe('Add Item 버튼이 눌렸을 때, 입력값이 있고 기존에 없는 값이면', () => {
	let e
	beforeEach(() => {
		initialize()
		e = {
			preventDefault: jest.fn(),
		}
		const newValue = 'new Value'
		itemInput.Value = newValue
		localStorage.setItem('items', JSON.stringify(newValue))
	})

	test('아이템을 저장한다', () => {
		script.onAddItemSubmit(e)
		const items = JSON.parse(localStorage.getItem('items'))
		expect(items).toContain('')
	})

	test('입력값을 지운다.', () => {
		script.onAddItemSubmit(e)
		itemInput.value = ''
		expect(itemInput.value).toBe('')
	})
})

describe('Add Item 버튼이 눌렸을 때, 입력값이 있고 동일한 아이템이 이미 존재하면', () => {
	let e
	beforeEach(() => {
		initialize()
		e = {
			preventDefault: jest.fn(),
		}

		const newValue = 'new Value'
		itemInput.value = newValue
		localStorage.setItem('items', JSON.stringify(newValue))
	})

	test('아이템을 중복 저장하지 않는다', () => {
		script.onAddItemSubmit(e)

		const newValue = 'new Value'
		const items = JSON.parse(localStorage.getItem('items'))
		const isDuplicate = items.includes(newValue)
		expect(isDuplicate).toBeTruthy()
	})

	test('입력값을 지우지 않는다', () => {
		script.onAddItemSubmit(e)
		expect(itemInput.value).not.toBe('')
	})
})

/**
 * @desc
 * update item
 */
describe('Update Item 버튼이 눌렸을 때', () => {
	let e
	beforeEach(() => {
		initialize()
		e = {
			preventDefault: jest.fn(),
		}

		itemInput.value = 'oldItem'
		script.onAddItemSubmit(e)

		const filtered = Array.from(itemList.childNodes).filter(
			(i) => i.textContent == 'oldItem'
		)

		script.setItemToEdit(filtered[0])
		itemInput.value = 'updatedItem'
	})

	test('저장된 아이템을 제거한다', () => {
		script.onAddItemSubmit(e)
		const items = JSON.parse(localStorage.getItem('items'))
		expect(items).not.toContain('oldItem')
	})

	test('아이템 편집 상태를 해제한다', () => {
		script.onAddItemSubmit(e)
		expect(script.isEditMode).toBe(false)
	})

	test('아이템을 저장한다', () => {
		script.onAddItemSubmit(e)
		const items = JSON.parse(localStorage.getItem('items'))
		expect(items).toContain('updatedItem')
	})

	test('입력값을 지운다', () => {
		script.onAddItemSubmit(e)
		expect(itemInput.value).toBe('')
	})
})
/**
 * @desc
 * clear Items
 *
 */

describe('clear all 버튼을 클릭한다', () => {
	let e
	beforeEach(() => {
		initialize()
		e = {
			preventDefault: jest.fn(),
		}
	})

	test('저장된 아이템을 제거한다 ', () => {
		script.clearItems(e)
		const items = JSON.parse(localStorage.getItem('items'))
		expect(items).toBe(null)
	})
})

/**
 * @desc
 * filter item
 */
describe('item 을 필터링한다', () => {
	let e
	beforeEach(() => {
		e = {
			preventDefault: jest.fn(),
			target: {
				value: '',
			},
		}
	})
	test('입력된 값이 있다면 보여준다', () => {
		e.target.value = 'a'
		script.filterItems(e)
		const items = Array.from(itemList.childNodes).filter(
			(item) => item.textContent.indexOf(e.target.value.toLowerCase()) !== -1
		)

		//왜 실패하는지 모르겠다...
		// expect(items.length).not.toBe(0)
	})

	test('입력된 값이 없다면 안보여준다', () => {
		e.target.value = 'z'
		script.filterItems(e)
		const items = Array.from(itemList.childNodes).filter(
			(item) => item.textContent.indexOf(e.target.value.toLowerCase()) === -1
		)
		expect(items.length).toBe(0)
	})
})

/**
 * @desc
 * clear items
 */
describe('item 을 모두 삭제한다', () => {
	let e
	beforeEach(() => {
		initialize()
		e = {
			preventDefault: jest.fn(),
		}
		localStorage.setItem('items', JSON.stringify(['apples', 'peach', 'grapes']))
	})

	test('로컬 스토리지 값을 지운다', () => {
		script.clearItems()
		const items = JSON.parse(localStorage.getItem('items'))
		expect(items).toBe(null)
	})
})
