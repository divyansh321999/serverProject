import express from 'express'
import { addMultipleTodos, addTodo, checkResult, deleteTodo, getTodo, login, logout, register, updateTodo } from '../controllers/user.controller.js'
import userMiddleware from '../middleware/user.middleware.js'

const router = express.Router()


router.post('/login', login)
router.post('/register', register)
router.post('/add-todo', userMiddleware, addTodo)
router.delete('/delete-todo', userMiddleware, deleteTodo)
router.put('/update-todo', userMiddleware, updateTodo)
router.get('/get-todo', userMiddleware, getTodo)
router.post('/bulk-adding', userMiddleware, addMultipleTodos)
router.get('/test', userMiddleware, checkResult)
router.get('/logout', logout)


export default router