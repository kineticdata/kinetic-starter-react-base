import { takeEvery, call, put } from 'redux-saga/effects';
import { fetchForm } from '@kineticdata/react';

import { actions, types } from '../modules/forms';

export function* fetchFormRequestSaga({
  payload: { kappSlug, formSlug } = {},
}) {
  if (!kappSlug || !formSlug) {
    return;
  }

  const { form, error } = yield call(fetchForm, {
    include: 'details,authorization',
    kappSlug,
    formSlug,
  });

  if (error) {
    yield put(actions.fetchFormFailure({ kappSlug, formSlug }));
  } else {
    yield put(actions.fetchFormSuccess({ kappSlug, formSlug, form }));
  }
}

export function* watchForms() {
  yield takeEvery(types.FETCH_FORM_REQUEST, fetchFormRequestSaga);
}
