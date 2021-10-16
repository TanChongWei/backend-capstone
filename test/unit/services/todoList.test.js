/* eslint-disable no-undef */
const TodoListService = require('../../../src/services/todoList')
const {email, db} = require('../mocks/mocks')
	
const todoListService = TodoListService(db)

describe('Granting list permissions', () => {
  afterEach(() => {
    for (const method in db) {
      db[method].mockClear()
    }
  })
  describe('Given a valid list Id and an emails with no access permissions', () => {
    it('Should return a valid list name and make 3 db calls to update list access', async () => {
      db.verifyListAccess.mockResolvedValue(false)
      const listName = await todoListService.grantListAccess(1, ['user1@test.com', 'user2@test.com', 'user3@test.com'])
      expect(db.allowEditAccess).toBeCalledTimes(3)
      expect(listName).toEqual('test-list')
    })
  })

  describe('Given a valid list Id and an email that already has permissions', () => {
    it('Should return a valid list name without making a DB query', async () => {
      db.verifyListAccess.mockResolvedValue(true)
      const listName = await todoListService.grantListAccess(1, [email])
      expect(db.allowEditAccess).not.toBeCalled()
      expect(listName).toEqual('test-list')
    })
  })

  describe('Given an invalid list Id and a set of 3 emails', () => {
    it('Should return null', async () => {
      db.findListById.mockResolvedValueOnce(null)
      const listName = await todoListService.grantListAccess(253.99, ['user1@test.com', 'user2@test.com', 'user3@test.com'])
      expect(db.allowEditAccess).not.toBeCalled()
      expect(listName).toBeNull()
    })
  })
})

describe('Todo list creation', () => {
  afterEach(() => {
    for (const method in db) {
      db[method].mockClear()
    }
  })

  describe('Given a listname, email and a set of tasks', () => {
    it('Should return the new list', async () => {
      const expected = {
        'listName': 'test-list',
        'author': email,
        'listTasks': [
          {
            'task': 'task1',
            'completed': false,
            'deleted': false
          },
          {
            'task': 'task2',
            'completed': false,
            'deleted': false
          },
          {
            'task': 'task3',
            'completed': false,
            'deleted': false
          },
          {
            'task': 'task4',
            'completed': false,
            'deleted': false
          }
        ],
        'deleted': false,
        'listId': 1
      }
      const newList = await todoListService.createTodoList('test-list', email, ['task1', 'task2', 'task3', 'task4'])
      expect(newList).toEqual(expected)
    })
  })
})

describe('Fetching todo lists by email', () => {
  afterEach(() => {
    for (const method in db) {
      db[method].mockClear()
    }
  })

  describe('Given an email with valid todo lists associated', () => {
    it('Should return the corresponding todo lists', async () => {
      db.findListsByEmail.mockResolvedValueOnce([
        {
          list_id:1,
          list_name:'test-list',
          author: email,
          deleted: false
        }
      ])

      db.getTodoListTasks.mockResolvedValueOnce([
        {
          todo_list_id:1,
          task:'test-task-1',
          completed: false,
          deleted: false
        },
        {
          todo_list_id:2,
          task:'test-task-2',
          completed: false,
          deleted: false
        }
      ])
      const expected = [{
        listName: 'test-list',
        author: email,
        listTasks: [
          'test-task-1',
          'test-task-2',
        ],
        deleted: false,
        listId: 1
      }]
      const todoLists = await todoListService.getTodoListsByEmail(email)
      expect(todoLists).toEqual(expected)
    })
  })

  describe('Given an email with no lists associated', () => {
    it('Should return null', async () => {
      db.findListsByEmail.mockResolvedValueOnce(null)
      const todoLists = await todoListService.getTodoListsByEmail('no-list@gmail.com')
      expect(todoLists).toBeNull()
    })
  })
})

describe('Fetch todo lists by list id', () => {
  afterEach(() => {
    for (const method in db) {
      db[method].mockClear()
    }
  })

  describe('Given a valid list id', () => {
    it('Should return a proper todo list with propagated list tasks', async () => {
      const expected = {
        author: 'test@email.com', 
        deleted: false, 
        listId: 1, 
        listName: 'test-list', 
        listTasks: [
          {'completed': false, 'deleted': false, 'task': 'test-task-1', 'taskId': 1},
          {'completed': false, 'deleted': false, 'task': 'test-task-2', 'taskId': 2}
        ]
      }
      const todoList = await todoListService.getTodoListById(1)
      expect(todoList).toEqual(expected)
    })
  })

  describe('Given an invalid list id', () => {
    it('Should return null', async () => {
      db.findListById.mockResolvedValueOnce(null)
      const todoList = await todoListService.getTodoListById(235.99)
      expect(todoList).toBeNull()
    })
  })
})

describe('Updating todo list by id', () => {
  afterEach(() => {
    for (const method in db) {
      db[method].mockClear()
    }
  })
  describe('Given a valid list id', () => {
    it('Should return the updated list', async () => {
      const expected = {
        list_id:1,
        list_name:'updated-test-list',
        author: email,
        deleted: false
      }
      const updatedList = await todoListService.findListByIdAndUpdate(1, 'updated-test-list')
      expect(db.findListByIdAndUpdate).toBeCalled()
      expect(updatedList).toEqual(expected)
    })
  })

  describe('Given an invalid list id', () => {
    it('Should return null', async () => {
      db.findListByIdAndUpdate.mockResolvedValueOnce(null)
      const updatedList = await todoListService.findListByIdAndUpdate(235.99)
      expect(updatedList).toBeNull()
    })
  })
})

describe('Deleting todo list by id', () => {
  afterEach(() => {
    for (const method in db) {
      db[method].mockClear()
    }
  })
  describe('Given a valid id', () => {
    it('Should return the list with the deleted property updated to be true', async () => {
      const expected = {
        list_id:1,
        list_name:'updated-test-list',
        author: email,
        deleted: true
      }

      const deletedList = await todoListService.findListByIdAndDelete(1)
      expect(db.findListByIdAndDelete).toBeCalled()
      expect(deletedList).toEqual(expected)
    })
  })

  describe('Given an invalid id', () => {
    it('Should return null', async () => {
      db.findListByIdAndDelete.mockResolvedValueOnce(null)
      const deletedList = await todoListService.findListByIdAndDelete(235.99)
      expect(deletedList).toBeNull()
    })
  })
})



