import userModel from '../models/user.model.js'
import todoModel from '../models/todo.model.js'
import bcrypt from 'bcryptjs'
import createToken from '../utils/createToken.util.js'
import hashLogic from '../utils/hashLogic.util.js'

export const login = async (req, res) => {
    try {
        const user = await userModel.findOne({
            email: req.body.email
        })
        if(!user){
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }
        if(!bcrypt.compareSync(req.body.password, user.password)){
            return res.status(403).json({
                success: false,
                message: 'Wroung Cridentials'
            })
        }

        const token = createToken(user._id)

        res.cookie('token', token, {
            httpOnly: true,    
            secure: process.env.NODE_ENV === 'production', 
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', 
          }).status(200).json({
            success: true,
            message: 'Login Successful',
          });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: '500 internal error'
        })
    }
}
export const register = async (req, res) => {
    console.log('hit')
    try {
        const hashPassword = hashLogic(req.body.password)

        const newUser = new userModel({
            ...req.body,
            password: hashPassword
        })

        await newUser.save()

        const token = createToken(newUser._id)

        res.cookie('token', token, {
            httpOnly: true,    
            secure: process.env.NODE_ENV === 'production', 
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', 
        }).status(200).json({
            success: true,
            message: 'Registeration Successful'
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: '500 internal error'
        })
    }
}
export const addTodo = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id)
        if(!user){
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }
        const newTodo = await todoModel({
            ...req.body
        })

        await newTodo.save()

        user.todos.push(newTodo._id)

        await user.save()

        res.status(200).json({
            success: true,
            message: 'New Todo Added',
            todo: newTodo._doc
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: '500 internal error'
        })
    }
}
export const deleteTodo = async (req, res) => {
    try {
        const userId = req.user._id;
        const { todoId } = req.body;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const todoToDelete = await todoModel.findById(todoId);
        if (!todoToDelete) {
            return res.status(404).json({
                success: false,
                message: 'Todo not found'
            });
        }

        user.todo.pull(todoId);
        await user.save();

        await todoToDelete.remove();

        res.status(200).json({
            success: true,
            message: 'Todo deleted successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}
export const updateTodo = async (req, res) => {
    try {
        const userId = req.user._id;
        const { todoId, updates } = req.body;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const todoToUpdate = await todoModel.findById(todoId);
        if (!todoToUpdate) {
            return res.status(404).json({
                success: false,
                message: 'Todo not found'
            });
        }

        Object.assign(todoToUpdate, updates);
        await todoToUpdate.save();

        res.status(200).json({
            success: true,
            message: 'Todo updated successfully',
            todo: todoToUpdate
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}
export const getTodo = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await userModel.findById(userId)
            .populate({
                path: 'todos',
                options: { sort: { deadline: 1 } } 
            });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Todos retrieved successfully',
            todos: user.todos 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};


export const addMultipleTodos = async (req, res) => {
    try {
        const userId = req.user._id; 
        const todos = req.body; 

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const newTodos = [];
        for (const todoData of todos) {
            const newTodo = new todoModel(todoData);
            await newTodo.save();
            newTodos.push(newTodo._id); 
        }

        user.todo.push(...newTodos);
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Todos added successfully',
            todos: newTodos
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}
export const checkResult = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: 'session revived',
            isLoggedIn: true
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            isLoggedIn: false
        });
    }
}
export const logout = (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
        }).status(200).json({
            success: true,
            message: 'Logout Successful',
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: '500 internal error',
        });
    }
};