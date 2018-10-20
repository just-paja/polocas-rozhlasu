import {
  composeActionType,
  createAction,
  createRoutineActions,
} from '../actions/routines';

export const ADD = 'ADD';
export const REMOVE = 'REMOVE';
export const CLEAR = 'CLEAR';
export const LIST_ACTIONS = 'listActions';
export const LIST_IDENTIFIER = 'listIdentifier';

export const createListAction = identifierName => actionName => (identifier, payload) => ({
  type: actionName,
  meta: { [identifierName]: identifier },
  payload,
});

export const createListActionsRoutine = (baseName, actions = [], identifierName = 'uuid') => {
  const listRoutineActions = createRoutineActions(
    baseName,
    actions,
    createListAction(identifierName)
  );
  return {
    ...listRoutineActions,
    [LIST_ACTIONS]: actions.map(extraAction => composeActionType(baseName, extraAction)),
    [LIST_IDENTIFIER]: identifierName,
  };
};

export const createListRoutine = (baseName, actions = [], identifierName = 'uuid') => {
  const routineActions = createRoutineActions(
    baseName,
    [ADD, REMOVE, CLEAR],
    createAction
  );
  return {
    ...routineActions,
    ...createListActionsRoutine(baseName, actions, identifierName),
  };
};
