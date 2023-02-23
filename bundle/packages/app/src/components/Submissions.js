import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { push } from 'connected-react-router';
import { compose, lifecycle, withState } from 'recompose';
import {
  ErrorMessage,
  TableComponents,
  TimeAgo,
} from '@kineticdata/bundle-common';
import { PageTitle } from './shared/PageTitle';
import { I18n, SubmissionTable } from '@kineticdata/react';
import { actions } from '../redux/modules/forms';

const TableLabelCell = ({ row, value, tableOptions }) => (
  <td>
    <Link
      to={`/kapps/${tableOptions.kappSlug}/forms/${
        tableOptions.formSlug
      }/submissions/${row.get('id')}`}
    >
      {value}
    </Link>
    <br />
    <small>
      {row.get('handle')} • {row.get('id')}
    </small>
  </td>
);

const SubmittedCell = ({ row, value }) => (
  <td>
    {value ? (
      <>
        <TimeAgo timestamp={value} /> <I18n>by</I18n> {row.get('submittedBy')}
      </>
    ) : (
      ''
    )}
  </td>
);

const CreatedCell = ({ row, value }) => (
  <td>
    {value ? (
      <>
        <TimeAgo timestamp={value} /> <I18n>by</I18n> {row.get('createdBy')}
      </>
    ) : (
      ''
    )}
  </td>
);

export const SubmissionsComponent = ({
  authenticated,
  kappSlug,
  kapp,
  formSlug,
  form,
  formLoading,
  filterOpen,
  setFilterOpen,
}) => {
  const EmptyBodyRow = TableComponents.generateEmptyBodyRow({
    loadingMessage: 'Loading Submissions...',
    noSearchResultsMessage:
      'No submissions were found - please modify your search criteria',
    noItemsMessage: 'There are no submissions to display.',
    errorMessage: (error, translate) => (
      <>
        <div>
          {translate(
            'There was a problem loading information from the server!',
          )}
        </div>
        <code>{error.message}</code>
      </>
    ),
  });

  const FilterFormLayout = TableComponents.generateFilterFormLayout({
    isOpen: filterOpen,
    toggle: () => setFilterOpen(open => !open),
    fieldsLayout: [
      ['startDate', 'endDate'],
      'coreState',
      'submittedBy',
      'values',
    ],
  });

  return (
    <Fragment>
      <div className="page-container">
        <div className="page-panel">
          <PageTitle
            parts={[
              (form && form.name) || (!formLoading ? formSlug : ''),
              (kapp && kapp.name) || kappSlug,
            ]}
            breadcrumbs={[
              {
                label: (kapp && kapp.name) || kappSlug,
                to: `/kapps/${kappSlug}`,
              },
            ]}
            title={(form && form.name) || (!formLoading ? formSlug : '')}
            subtitle="Submissions"
            actions={[
              {
                label: 'Create Submission',
                to: `/kapps/${kappSlug}/forms/${formSlug}`,
              },
              form &&
                form.authorization &&
                form.authorization.Modification && {
                  label: 'Form Builder',
                  href: `/app/builder/#/${kappSlug}/forms/${formSlug}/builder`,
                  menu: true,
                },
            ]}
          />
          {!!kapp ? (
            <SubmissionTable
              tableKey={`submission-list-${kappSlug}-${formSlug}`}
              uncontrolled={true}
              kappSlug={kapp.slug}
              formSlug={formSlug}
              components={{
                EmptyBodyRow,
                FilterFormLayout,
                FilterFormButtons: TableComponents.FilterFormButtons,
              }}
              columnSet={['label', 'coreState', 'submittedAt', 'createdAt']}
              defaultSortColumn="createdAt"
              defaultSortDirection="desc"
              alterColumns={{
                submittedAt: {
                  title: 'Submitted',
                  components: { BodyCell: SubmittedCell },
                },
                createdAt: {
                  title: 'Created',
                  components: { BodyCell: CreatedCell },
                },
                label: {
                  title: 'Label • Handle • Id',
                  components: { BodyCell: TableLabelCell },
                },
                coreState: {
                  components: {
                    BodyCell: TableComponents.CoreStateBadgeCell,
                  },
                },
              }}
              filterSet={[
                'startDate',
                'endDate',
                'submittedBy',
                'coreState',
                'values',
              ]}
              onSearch={() => () => setFilterOpen(false)}
            >
              {({
                pagination,
                table,
                filter,
                appliedFilters,
                filterFormKey,
                ...rest
              }) => {
                return (
                  <div>
                    <div className="text-right mb-2">{filter}</div>
                    <TableComponents.FilterPills
                      filterFormKey={filterFormKey}
                      appliedFilters={appliedFilters}
                    />
                    <div className="scroll-wrapper-h">{table}</div>
                    {pagination}
                  </div>
                );
              }}
            </SubmissionTable>
          ) : (
            <ErrorMessage
              title="Kapp Not Found"
              message={`The kapp with slug '${kappSlug}' could not be found.`}
            />
          )}
        </div>
      </div>
    </Fragment>
  );
};

export const mapStateToProps = (state, props) => {
  return {
    kappSlug: state.app.kappSlug,
    kapp: state.app.kapp,
    formSlug: props.match.params.formSlug,
    form: state.forms.getIn([state.app.kappSlug, props.match.params.formSlug]),
    formLoading:
      state.forms.getIn([state.app.kappSlug, props.match.params.formSlug]) ===
      null,
    authenticated: state.app.authenticated,
  };
};

export const mapDispatchToProps = { push, fetchForm: actions.fetchFormRequest };

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withState('filterOpen', 'setFilterOpen', false),
  lifecycle({
    componentDidMount() {
      if (!this.props.form && !this.props.formLoading) {
        this.props.fetchForm({
          kappSlug: this.props.kappSlug,
          formSlug: this.props.formSlug,
        });
      }
    },
    componentDidUpdate(prevProps) {
      if (
        this.props.formSlug !== prevProps.formSlug &&
        !this.props.form &&
        !this.props.formLoading
      ) {
        this.props.fetchForm({
          kappSlug: this.props.kappSlug,
          formSlug: this.props.formSlug,
        });
      }
    },
  }),
);

export const Submissions = enhance(SubmissionsComponent);
