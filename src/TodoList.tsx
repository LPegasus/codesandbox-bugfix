import * as React from "react";
import { useModel } from "./useModel";
import { TodoStruct, Todo } from "./Todo";

export interface AppPropsType {}

const initialState = {
  todoList: Array(1000)
    .fill(null)
    .map((_, i) => ({ name: `Name ${i}`, done: false })) as TodoStruct[]
};

const App: React.FC<AppPropsType> = () => {
  const [state, actions] = useModel({
    state: initialState,
    reducers: {
      toggleDone(index: number) {
        const done = this.todoList[index].done;
        this.todoList[index].done = !done;
      },
      addTodo(todo: TodoStruct) {
        this.todoList.push(todo);
      },
      delTodo(index: number) {
        this.todoList.splice(index, 1);
      },
      changeName(name: string, index: number) {
        this.todoList[index].name = name;
      }
    },
    computed: {
      totalDone() {
        return this.todoList.filter(d => d.done).length;
      }
    }
  });

  (window as any)._s = state;

  return (
    <table>
      <caption>一共完成: {state.totalDone}</caption>
      <tbody>
        {React.Children.toArray(
          state.todoList.map((datum, index) => {
            return <Todo data={datum} index={index} actions={actions} />;
          })
        )}
      </tbody>
    </table>
  );
};

export default App;
