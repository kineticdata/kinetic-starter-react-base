import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { push } from 'connected-react-router';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import { compose, withState } from 'recompose';
import { ErrorMessage, TableComponents } from '@kineticdata/bundle-common';
import { PageTitle } from './shared/PageTitle';
import { I18n, FormTable } from '@kineticdata/react';

const TableNameCell = ({ row, value, tableOptions }) => (
  <td>
    <Link
      to={`/kapps/${tableOptions.kappSlug}/forms/${row.get(
        'slug',
      )}/submissions`}
    >
      {value}
    </Link>
    <br />
    <small>{row.get('slug')}</small>
  </td>
);

const TableActionsCell = ({ profile }) => ({ row, value, tableOptions }) => (
  <td className="text-right" style={{ width: '1%' }}>
    <UncontrolledDropdown className="more-actions">
      <DropdownToggle tag="button" className="btn btn-sm btn-link">
        <span className="sr-only">More Actions</span>
        <span className="fa fa-chevron-down fa-fw" role="presentation" />
      </DropdownToggle>
      <DropdownMenu right positionFixed>
        <Link
          to={`/kapps/${tableOptions.kappSlug}/forms/${row.get('slug')}`}
          className="dropdown-item"
        >
          <I18n>Create Submission</I18n>
        </Link>
        <Link
          to={`/kapps/${tableOptions.kappSlug}/forms/${row.get(
            'slug',
          )}/submissions`}
          className="dropdown-item"
        >
          <I18n>View Submissions</I18n>
        </Link>
        {profile &&
          profile.spaceAdmin && (
            <a
              href={`/app/builder/#/${tableOptions.kappSlug}/forms/${row.get(
                'slug',
              )}/builder`}
              target="_blank"
              rel="noopener noreferrer"
              className="dropdown-item"
            >
              <I18n>Form Builder</I18n>
            </a>
          )}
      </DropdownMenu>
    </UncontrolledDropdown>
  </td>
);

export const KappComponent = ({
  authenticated,
  kappSlug,
  kapp,
  profile,
  filterOpen,
  setFilterOpen,
}) => {
  const EmptyBodyRow = TableComponents.generateEmptyBodyRow({
    loadingMessage: 'Loading Forms...',
    noSearchResultsMessage:
      'No forms were found - please modify your search criteria',
    noItemsMessage: 'There are no forms to display.',
  });

  const FilterFormLayout = TableComponents.generateFilterFormLayout({
    isOpen: filterOpen,
    toggle: () => setFilterOpen(open => !open),
  });

  return (
    <Fragment>
      <div className="page-container">
        <div className="page-panel">
          <PageTitle
            parts={[(kapp && kapp.name) || kappSlug]}
            title={(kapp && kapp.name) || kappSlug}
            subtitle="Forms"
          />
          {!!kapp ? (
            <FormTable
              key={`form-list-${kappSlug}`}
              tableKey={`form-list-${kappSlug}`}
              uncontrolled={true}
              kappSlug={kapp.slug}
              components={{
                EmptyBodyRow,
                FilterFormLayout,
                FilterFormButtons: TableComponents.FilterFormButtons,
              }}
              columnSet={[
                'name',
                'description',
                'type',
                'updatedAt',
                'createdAt',
                'status',
                'actions',
              ]}
              defaultSortColumn="name"
              defaultSortDirection="asc"
              addColumns={[
                { value: 'description', title: 'Description', sortable: false },
                {
                  value: 'actions',
                  title: ' ',
                  sortable: false,
                  components: {
                    BodyCell: TableActionsCell({ profile }),
                  },
                  className: 'text-right',
                },
              ]}
              alterColumns={{
                updatedAt: {
                  components: { BodyCell: TableComponents.TimeAgoCell },
                },
                createdAt: {
                  components: { BodyCell: TableComponents.TimeAgoCell },
                },
                name: { components: { BodyCell: TableNameCell } },
                status: {
                  components: {
                    BodyCell: TableComponents.StatusBadgeCell,
                  },
                },
              }}
              filterSet={['name', 'type', 'status']}
              onSearch={() => () => setFilterOpen(false)}
            >
              {({
                pagination,
                table,
                filter,
                appliedFilters,
                filterFormKey,
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
            </FormTable>
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

export const mapStateToProps = state => {
  return {
    kappSlug: state.app.kappSlug,
    kapp: state.app.kapp,
    authenticated: state.app.authenticated,
    profile: state.app.profile,
  };
};

export const mapDispatchToProps = { push };

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withState('filterOpen', 'setFilterOpen', false),
);

export const Kapp = enhance(KappComponent);
