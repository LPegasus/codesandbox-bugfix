import React from "react";

export type TodoStruct = {
  name: string;
  done: boolean;
};

export const Todo = React.memo(function Row(props: {
  data: TodoStruct;
  index: number;
  actions: any;
}) {
  const { data, index, actions } = props;
  return (
    <tr>
      <td>No.{index}</td>
      <td>
        <input
          value={data.name}
          onChange={e => actions.changeName(e.target.value, index)}
        />
      </td>
      <td>
        <div
          onClick={e => actions.toggleDone(index)}
          style={{ width: 100, backgroundColor: "#efefec" }}
        >
          <input type="checkbox" checked={data.done} onChange={noop} />
        </div>
      </td>
    </tr>
  );
});
function noop() {}
