import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, withProps } from 'recompose';
import { selectQueueKapp, ActivityFeed } from '@kineticdata/bundle-common';
import { searchSubmissions, defineKqlQuery } from '@kineticdata/react';
import { QueueCard } from '@kineticdata/bundle-queue';
import { Link } from 'react-router-dom';

const buildSearch = username => {
  const searcher = defineKqlQuery();
  searcher
    .in('values[Status]', 'status')
    .equals(`values[Assigned Individual]`, 'username')
    .end();
  return {
    q: searcher.end()({
      status: ['Open', 'Pending'],
      username,
    }),
    include: ['details', 'values', 'form', 'form.kapp'],
  };
};

const QueueActivityComponent = ({ hidePaging = true, ...props }) => (
  <ActivityFeed
    feedKey={props.feedKey}
    pageSize={props.pageSize || 5}
    joinByDirection="DESC"
    joinBy="createdAt"
    dataSources={props.dataSources}
    contentProps={{
      hidePaging: hidePaging,
      emptyMessage: {
        title: 'No actions found.',
        message: 'Actions assigned to you will appear here.',
      },
    }}
  />
);

export const QueueActivity = compose(
  connect((state, props) => ({
    kapp: selectQueueKapp(state),
    username: state.app.profile.username,
  })),
  withHandlers({
    buildActionCard: props => record => (
      <QueueCard
        key={record.id}
        submission={record}
        path={`/kapps/${props.kapp.slug}/list/Mine/item/${record.id}`}
        components={{ Link }}
      />
    ),
  }),
  withProps(props => ({
    // The sources for the data shown in the activity feed
    dataSources: {
      actions: {
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
        component: props.buildActionCard,
      },
    },
  })),
)(QueueActivityComponent);
