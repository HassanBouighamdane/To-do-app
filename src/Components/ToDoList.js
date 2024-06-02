import React, { useState,useEffect } from 'react';
import axios from 'axios';
const API_URL="https://cfcjfe67lj.execute-api.us-east-1.amazonaws.com/API/todos";
function TodoList() { 
    const [todos, setTodos] = useState([]);
    const [inputValue, setInputValue] = useState('');
  
    useEffect(() => {
      fetchTodos();
    }, []);
  
    const fetchTodos = async () => {
      try {
        const response = await axios.get(API_URL);
        setTodos(response.data.body.Items)
       
      } catch (error) {
        console.error("Error fetching todos:", error);
        console.log(todos);
        
      }
    };
  
    const handleChange = (e) => {
      setInputValue(e.target.value);
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const newTodo = { todoID: Date.now().toString(), toDoTask: inputValue,isComplete:false};
        await axios.put(`${API_URL}/one`, { body: JSON.stringify(newTodo) });
        setTodos([...todos, newTodo]);
        setInputValue('');
      } catch (error) {
        console.error("Error adding todo:", error);
      }
    };
  
    const handleDelete = async (id) => {
      try {
        const todoID=id.S;
        await axios.delete(`${API_URL}/one`, { data: { body: JSON.stringify({ todoID }) } });
        setTodos(todos.filter(todo => todo.todoID !== todoID));
      } catch (error) {
        console.error("Error deleting todo:", error);
      }
    };
  
    const handleToggleComplete = async (id) => {
      try {
        const todoID=id.S;
        const todo1=  await axios.post(`${API_URL}/one`,{body:JSON.stringify({todoID})});
        
        const isComplete=todo1.data.body.Item.isComplete.BOOL;
        const newIsComplete=!isComplete;
        await axios.patch(`${API_URL}/one`, { body: JSON.stringify({ todoID,isComplete:newIsComplete}) });
        setTodos(todos.map(todo => todo.todoID === todoID ? { ...todo, isComplete: newIsComplete } : todo));
      } catch (error) {
        console.error("Error completing todo:", error);
      }
    };
  
    const handleEdit = async (todoID, newText) => {
      try {
        await axios.put(`${API_URL}/one`, { body: JSON.stringify({ todoID, toDoTask: newText }) });
        setTodos(todos.map(todo => todo.todoID === todoID ? { ...todo, toDoTask: newText } : todo));
      } catch (error) {
        console.error("Error editing todo:", error);
      }
    };
  
    return (
      <div>
        <h1>Todo List</h1>
        <form onSubmit={handleSubmit}>
          <input type="text" value={inputValue} onChange={handleChange} />
          <button type="submit">Add Todo</button>
        </form>
        <ul>
          {todos.map((todo, index) => (
            <li key={index} style={{ textDecoration: todo.
            isComplete ? 'line-through' : 'none' }}>
              <input 
                type="text" 
                value={todo.toDoTask.S} 
                onChange={(e) => handleEdit(todo.todoID, e.target.value)}
                style={{ textDecoration: todo.isComplete.BOOL ? 'line-through' : 'none' }}
              />
              <button onClick={() => handleToggleComplete(todo.todoID)}>
                {todo.isComplete.BOOL ? 'Finished' : 'Unfinish'}
              </button>
              <button onClick={() => handleDelete(todo.todoID)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  export default TodoList;  