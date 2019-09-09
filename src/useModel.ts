/* eslint-disable no-loop-func */
import { useState, useMemo, useRef } from "react";
import produce from "immer";

type ModelConfig<S, R, E, C> = {
  state: S;
  computed?: C & ThisType<Readonly<S>>;
  reducers?: R & ThisType<S>;
  effects?: E & ThisType<Readonly<S> & Readonly<R> & Readonly<E>>;
};

type ExtractComputed<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => infer B ? B : never
};
export function useModel<S, R, E, C>(
  model: ModelConfig<S, R, E, C>,
  log: boolean = false
): [Readonly<S & ExtractComputed<C>>, R & E] {
  const {
    state: stateInModel,
    reducers: reducersInModel = {} as R,
    effects: effectsInModel = {} as E,
    computed: computedInModels = {} as C
  } = model;
  const [state, setState] = useState(stateInModel);
  const stateRef = useRef(state);
  const onceRef = useRef(false);
  const contextRef: any = useRef({ ...stateRef.current });

  const { current: actions } = useRef(
    (() => {
      if (onceRef.current) {
        return;
      }
      onceRef.current = true;
      const reducers: any = {};
      for (const [key, reducerFn] of Object.entries(reducersInModel)) {
        reducers[key] = (...args: any[]) => {
          if (log) {
            console.log(`current: ${stateRef.current.visible}`);
          }
          const next = produce(stateRef.current, (draft: any) => {
            reducerFn.apply(draft, args);
          });
          if (log) {
            console.log(`next: ${next.visible}`);
          }
          stateRef.current = next;
          Object.assign(contextRef.current, next);
          setState(next);
          return next;
        };
      }
      Object.assign(contextRef.current, reducers);
      const effects: any = {};
      for (const [key, effectFn] of Object.entries(effectsInModel)) {
        effects[key] = (...args: any[]) => {
          return effectFn.apply(contextRef.current, args);
        };
      }
      Object.assign(contextRef.current, reducers, effects);
      return { ...reducers, ...effects } as any;
    })()
  ); // eslint-disable-line

  const stateAndComputed: S & ExtractComputed<C> = useMemo(() => {
    const computed: any = {};
    for (const [key, computeFn] of Object.entries(computedInModels)) {
      computed[key] = computeFn.call(state);
    }
    return { ...state, ...computed } as any;
  }, [state]); // eslint-disable-line

  return [stateAndComputed, actions];
}
