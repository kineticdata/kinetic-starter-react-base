import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose, withHandlers } from 'recompose';
import { CoreForm } from '@kineticdata/react';
import { addToast } from '@kineticdata/bundle-common';
import { PageTitle } from './shared/PageTitle';
import { parse } from 'query-string';

import { I18n } from '@kineticdata/react';

const Layout = ({ authenticated, kapp, isPublic }) => ({ form, content }) => (
  <>
    {!isPublic && (
      <PageTitle
        parts={['Form']}
        breadcrumbs={[
          { label: 'Home', to: '/' },
          kapp && {
            label: kapp.name,
            to: `/kapps/${kapp.slug}`,
          },
        ]}
        title={form && form.name}
      />
    )}
    {content}
  </>
);

export const FormComponent = ({
  authenticated,
  isPublic,
  match: {
    params: { formSlug, id },
  },
  handleCreated,
  handleCompleted,
  handleLoaded,
  handleDelete,
  values,
  kappSlug,
  Layout,
}) => (
  <Fragment>
    <div className={!isPublic ? 'page-container page-container--lg' : ''}>
      <div className={!isPublic ? 'page-panel' : ''}>
        <PageTitle parts={['Form']} />
        <I18n
          context={`kapps.${kappSlug}.forms.${formSlug}`}
          public={!authenticated}
        >
          <div className="embedded-core-form--wrapper">
            {id ? (
              <CoreForm
                submission={id}
                loaded={handleLoaded}
                completed={handleCompleted}
                public={!authenticated}
                layoutComponent={Layout}
              />
            ) : (
              <CoreForm
                kapp={kappSlug}
                form={formSlug}
                loaded={handleLoaded}
                created={handleCreated}
                completed={handleCompleted}
                values={values}
                public={!authenticated}
                layoutComponent={Layout}
              />
            )}
          </div>
        </I18n>
      </div>
    </div>
  </Fragment>
);

const valuesFromQueryParams = queryParams => {
  const params = parse(queryParams);
  return Object.entries(params).reduce((values, [key, value]) => {
    if (key.startsWith('values[')) {
      const vk = key.match(/values\[(.*?)\]/)[1];
      return { ...values, [vk]: value };
    }
    return values;
  }, {});
};

export const handleCompleted = props => response => {
  if (props.authenticated) {
    // Check if either currentPage is null (pre form consolidation) or
    // displayedPage.type is not 'confirmation' (post form-consolidation)
    // to determine that there is no confirmation page and we should redirect.
    if (
      !response.submission.currentPage ||
      (response.submission.displayedPage &&
        response.submission.displayedPage.type !== 'confirmation')
    ) {
      props.push(`/kapps/${props.kappSlug}`);
      addToast('The form was submitted successfully');
    }
  }
};

export const handleCreated = props => response => {
  // Redirect to route with submission id if submission is not submitted or
  // there is a confirmation page to render, defined as currentPage is set and
  // displayedPage is undefined (pre form consolidation) or displayedPage.type
  // is 'confirmation' (post form-consolidation).
  if (
    response.submission.coreState !== 'Submitted' ||
    (response.submission.currentPage &&
      (!response.submission.displayedPage ||
        response.submission.displayedPage.type === 'confirmation'))
  ) {
    /*
     * Only modify the route if the router location does not
     * contain the embedded & cross_domain parameters. If these
     * headers are present it is an indication that the form
     * will implement it's own submitPage() callback function.
     * This was necessary to support unauthenticated forms inside
     * of iframes when using Safari. Safari will not send cookies
     * to a server if they cookie did not originate in a main parent
     * window request (third party cookies). This includes the
     * JSESSIONID cookie which is used to validate the submitter
     * access with an unauthenticated form.
     */
    if (
      (props.authenticated || (!props.isEmbedded && !props.isCrossDomain)) &&
      props.match
    ) {
      props.push(
        `/kapps/${props.kappSlug}/forms/${
          props.match.params.formSlug
        }/submissions/${response.submission.id}`,
      );
    }
  }
};

export const mapStateToProps = state => {
  const search = parse(state.router.location.search);
  return {
    kappSlug: state.app.kappSlug,
    kapp: state.app.kapp,
    authenticated: state.app.authenticated,
    values: valuesFromQueryParams(state.router.location.search),
    isPublic: search.public !== undefined,
    isEmbedded: search.embedded !== undefined,
    isCrossDomain: search.cross_domain !== undefined,
  };
};

export const mapDispatchToProps = { push };

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withHandlers({ Layout, handleCompleted, handleCreated }),
);

export const Form = enhance(FormComponent);
