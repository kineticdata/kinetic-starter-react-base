import React from 'react';
import { CoreForm } from '@kineticdata/react';
import { Utils } from '@kineticdata/bundle-common';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose, withHandlers } from 'recompose';
import { I18n } from '@kineticdata/react';
import { actions } from '../../redux/modules/alerts';
import { PageTitle } from '../shared/PageTitle';

const AlertComponent = ({
  match: {
    params: { id },
  },
  alertsFormSlug,
  handleCreateOrUpdate,
  values,
}) => {
  const editing = id !== 'new';
  const submissionId = id;
  return (
    <div className="page-container page-container--space-alerts-form">
      <div className="page-panel page-panel--space-alerts-form">
        <PageTitle
          parts={[editing ? 'Edit Alert' : 'New Alert', 'Alerts']}
          breadcrumbs={[
            { label: 'Home', to: '/' },
            { label: 'Alerts', to: '/alerts' },
          ]}
          title={`${editing ? 'Edit' : 'New'} Alert`}
        />

        <I18n context={`kapps.datastore.forms.${alertsFormSlug}`}>
          {editing ? (
            <div>
              <CoreForm
                submission={submissionId}
                updated={handleCreateOrUpdate}
              />
            </div>
          ) : (
            <div>
              <CoreForm
                kapp="datastore"
                form={alertsFormSlug}
                created={handleCreateOrUpdate}
                updated={handleCreateOrUpdate}
                values={values}
              />
            </div>
          )}
        </I18n>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  spaceName: state.app.space.name,
  alertsFormSlug: Utils.getAttributeValue(
    state.app.space,
    'Alerts Form Slug',
    'alerts',
  ),
});

const handleCreateOrUpdate = props => response => {
  props.fetchAlertsRequest();
  props.push(`/alerts`);
};

const mapDispatchToProps = {
  push,
  fetchAlertsRequest: actions.fetchAlertsRequest,
};

export const Alert = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withHandlers({ handleCreateOrUpdate }),
)(AlertComponent);
