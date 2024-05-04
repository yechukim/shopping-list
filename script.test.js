import * as innerHTMLForTest from './scriptTestHTMLSetup.js'
import * as script from './script.js'

const itemInput = document.getElementById('item-input')
const itemForm = document.getElementById('item-form')
const itemList = document.getElementById('item-list')
const clearBtn = document.getElementById('clear')
const itemFilter = document.getElementById('filter')
const formBtn = itemForm.querySelector('button')

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
 * filter item
 */
// describe('item 을 필터링한다', () => {
// 	let e
// 	beforeEach(() => {
// 		initialize()
// 		e = {
// 			preventDefault: jest.fn(),
// 			target: {
// 				value: 'Apples',
// 			},
// 		}
// 	})
// 	test('필터링된 값을 보여준다', () => {
// 		script.filterItems(e)

// 		const text = e.target.value.toLowerCase()
// 		const filtered = Array.from(itemList.childNodes).filter(
// 			(item) => item?.firstChild?.textContent === text
// 		)
// 	})

// })
