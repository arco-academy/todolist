import React, { useCallback, useContext, useState } from 'react';

import { v4 as uuid } from 'uuid'

import { CSSTransition, TransitionGroup } from 'react-transition-group'

import Logo from '../../components/Logo';
import TodoForm from '../../components/TodoForm';
import TodoFormContext from '../../components/TodoForm/context';
import TodoItem, { TodosProps } from '../../components/TodoItem';

import { Container } from './styles';

import { getStorage, setStorage } from '../../services/useStorage';

type Todos = Omit<TodosProps, 'onClick'>;

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState(() => {
    const storage = getStorage();

    return storage as Todos[];
  });

  const context = useContext(TodoFormContext);

  context.add = (e) => {
    const newTodo: Todos = {
      id: uuid(),
      title: e,
      date: new Date(),
      done: false,
    }
    
    const rewriteTodos = [...todos, newTodo];

    setStorage(rewriteTodos);

    setTodos(rewriteTodos)
  }

  const handleCompleted = useCallback((id) => {
    
    const findAndCompleted = todos.map(todo => {
      if(todo.id === id) {
        return {
          ...todo,
          done: !todo.done
        }
      }

      return todo;
    });

    setStorage(findAndCompleted);

    setTodos(findAndCompleted)

  },[todos])

  return (
    <Container>
      <div className="round-bg"></div>
      <Logo  style={{ maxWidth: 70 }}/>

      <div className="todo-list">
        <TodoForm />

        <TransitionGroup className="todo-group">
          {todos?.map((todo, index) =>  (
            <CSSTransition
              key={index}
              timeout={{
                enter: 500,
                exit: 300,
                appear: 240
              }}
              classNames="move"
            >
              <TodoItem key={index} onClick={handleCompleted} {...todo}/>
            </CSSTransition>
          ))}
        </TransitionGroup>
      </div>
    </Container>
  );
}

export default TodoList;