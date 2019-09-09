import React, { useEffect } from "react";
import { useModel } from "./useModel";

export function Parent() {
  const [state, actions] = useModel({
    state: {
      visible: false
    },
    reducers: {
      toggleVisible(visible) {
        this.visible = visible;
      }
    }
  });

  return (
    <>
      <button onClick={() => actions.toggleVisible(!state.visible)}>
        anniu
      </button>
      <Child visible={state.visible} toggleVisible={actions.toggleVisible} />
    </>
  );
}

function Child(props: {
  visible: boolean;
  toggleVisible: (v: boolean) => any;
}) {
  const [state, actions] = useModel(
    {
      state: {
        visible: props.visible
      },
      reducers: {
        doSomething(v) {
          props.toggleVisible(v);
        },
        setVisible(v) {
          this.visible = v;
        }
      }
    },
    true
  );

  useEffect(() => {
    actions.setVisible(props.visible);
    if (props.visible) {
      const id = setTimeout(() => {
        console.log("dosomething");
        actions.doSomething(false);
      }, 3000);
      return () => {
        clearTimeout(id);
      };
    }
  }, [props.visible]);

  console.log(`state: ${state.visible}`, `props: ${props.visible}`);
  return state.visible ? <h1>123123123123</h1> : <h1>321321321</h1>;
}
