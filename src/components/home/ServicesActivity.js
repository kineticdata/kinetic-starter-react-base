import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, withProps } from 'recompose';
import { selectServicesKapp, ActivityFeed } from '@kineticdata/bundle-common';
import { searchSubmissions, defineKqlQuery } from '@kineticdata/react';
import { Constants, Utils, RequestCard } from '@kineticdata/bundle-services';
import { Link } from 'react-router-dom';

const buildSearch = username => {
  const searcher = defineKqlQuery();
  // Add static query parts
  // searcher.equals('type', 'type'); TODO uncomment
  // Add value query parts
  searcher
    .or()
    .equals(`values[${Constants.REQUESTED_FOR_FIELD}]`, 'username')
    .equals(`values[${Constants.REQUESTED_BY_FIELD}]`, 'username')
    .equals('submittedBy', 'username')
    .equals('createdBy', 'username')
    .end();
  return {
    q: searcher.end()({
      type: Constants.SUBMISSION_FORM_TYPE,
      username,
    }),
    include: [
      'details',
      'values',
      'form',
      'form.attributes',
      'form.kapp',
      'form.kapp.attributes',
    ],
  };
};

const ServicesActivityComponent = ({ hidePaging = true, ...props }) => (
  <ActivityFeed
    feedKey={props.feedKey}
    pageSize={props.pageSize || 5}
    joinByDirection="DESC"
    joinBy="createdAt"
    dataSources={props.dataSources}
    contentProps={{
      hidePaging: hidePaging,
      emptyMessage: {
        title: 'No s found.',
        message: 'Submit a service and it will show up here!',
      },
    }}
  />
);

export const ServicesActivity = compose(
  connect((state, props) => ({
    kapp: selectServicesKapp(state),
    username: state.app.profile.username,
  })),
  withHandlers({
    buildRequestCard: props => record => (
      <RequestCard
        key={record.id}
        submission={record}
        path={Utils.getSubmissionPath(`/kapps/${props.kapp.slug}`, record)}
        components={{ Link }}
      />
    ),
  }),
  withProps(props => ({
    // The sources for the data shown in the activity feed
    dataSources: {
      requests: {
        fn: searchSubmissions,
        params: (prevParams, prevResult) =>
          prevParams && prevResult
            ? prevResult.nextPageToken
              ? { ...prevParams, pageToken: prevResult.nextPageToken }
              : null
            : {
                kapp: props.kapp && props.kapp.slug,
                limit: props.chunkSize || 5,
                search: buildSearch(props.username),
              },
        transform: result => ({
          data: result.submissions,
          nextPageToken: result.nextPageToken,
        }),
        component: props.buildRequestCard,
      },
    },
  })),
)(ServicesActivityComponent);
