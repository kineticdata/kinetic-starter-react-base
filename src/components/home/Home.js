import React from 'react';
import { connect } from 'react-redux';
import { compose, lifecycle, withProps, withState } from 'recompose';
import { Link } from 'react-router-dom';
import { PageTitle } from '../shared/PageTitle';
import {
  selectQueueKapp,
  selectServicesKapp,
  selectSurveyKapp,
  selectTechBarKapp,
  Card,
  CardRow,
  CardCol,
} from '@kineticdata/bundle-common';
import { I18n } from '@kineticdata/react';
import { CategoryCard, CategoryHelper } from '@kineticdata/bundle-services';
import { ServicesActivity } from './ServicesActivity';
import { QueueActivity } from './QueueActivity';

export const HomeComponent = ({
  space,
  kapp,
  forms,
  visibleKapps,
  profile,
  pathname,
  servicesKapp,
  rootCategories,
  featuredServices,
  queueKapp,
}) => (
  <div className="page-container">
    <div className="page-panel">
      <PageTitle
        parts={['Home']}
        title="Welcome"
        subtitle="What can we help you with today?"
        hero={true}
        image={true}
        withCard={!!featuredServices}
        center={true}
      >
        {!!featuredServices &&
          featuredServices.map(form => (
            <Card
              key={form.slug}
              to={`/kapps/${servicesKapp.slug}/forms/${form.slug}`}
              color="white"
              style={{ maxHeight: '6rem' }}
            >
              <CardRow>
                <CardCol type={['prepend', 'icon']}>
                  <span
                    className={`fa fa-${(form.icon || 'arrow-right').replace(
                      /^fa-/i,
                      '',
                    )} fa-fw`}
                  />
                </CardCol>
                <CardCol>
                  <CardRow type="subtitle">
                    <I18n>{form.name}</I18n>
                  </CardRow>
                </CardCol>
              </CardRow>
            </Card>
          ))}
      </PageTitle>

      <div className="column-container">
        <div className="column-panel column-panel--two-thirds">
          {!!servicesKapp && (
            <>
              <div className="section__title">
                <span className="title">
                  <I18n>Recent Requests</I18n>
                </span>
                <Link
                  className="btn btn-link"
                  to={`/kapps/${servicesKapp.slug}/requests`}
                >
                  <I18n>View All</I18n>
                </Link>
              </div>
              <div className="cards">
                <ServicesActivity />
              </div>
            </>
          )}
          {!!queueKapp && (
            <>
              <div className="section__title">
                <span className="title">
                  <I18n>Queue Actions</I18n>
                </span>
                <Link
                  className="btn btn-link"
                  to={`/kapps/${queueKapp.slug}`}
                >
                  <I18n>View All</I18n>
                </Link>
              </div>
              <div className="cards">
                <QueueActivity />
              </div>
            </>
          )}
        </div>

        {rootCategories && (
          <div className="column-panel column-panel--thirds">
            <div className="section__title">
              <span className="title">
                <I18n>Categories</I18n>
              </span>
              <Link
                className="btn btn-link"
                to={`/kapps/${servicesKapp.slug}/categories`}
              >
                <I18n>View All</I18n>
              </Link>
            </div>
            <div className="cards">
              {rootCategories.map(category => (
                <CategoryCard
                  key={category.slug}
                  category={category}
                  path={`/kapps/${servicesKapp.slug}/categories/${
                    category.slug
                  }`}
                  countOfMatchingForms={category.getTotalFormCount()}
                  components={{ Link }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

export const mapStateToProps = state => {
  return {
    space: state.app.space,
    kapps: state.app.kapps,
    queueKapp: selectQueueKapp(state),
    servicesKapp: selectServicesKapp(state),
    surveyKapp: selectSurveyKapp(state),
    techBarKapp: selectTechBarKapp(state),
    profile: state.app.profile,
    pathname: state.router.location.pathname,
  };
};

export const Home = compose(
  connect(mapStateToProps),
  withState(
    'servicesCategories',
    'setServicesCategories',
    props =>
      props.servicesKapp
        ? CategoryHelper(props.servicesKapp.categories, true)
        : null,
  ),
  withProps(props => {
    if (props.servicesCategories) {
      const featuredCategory = props.servicesCategories.getCategory(
        'featured-services',
      );
      return {
        rootCategories: props.servicesCategories
          .getRootCategories()
          .filterNot(c => c.hidden || c.isEmpty()),
        featuredServices:
          featuredCategory && featuredCategory.allForms.size > 0
            ? featuredCategory.allForms.slice(0, 2)
            : null,
      };
    } else {
      return {};
    }
  }),
  lifecycle({
    componentDidMount() {},
    componentDidUpdate(prevProps) {
      if (this.props.servicesKapp && !prevProps.servicesKapp) {
        this.props.setServicesCategories(
          CategoryHelper(this.props.servicesKapp.categories, true),
        );
      }
    },
  }),
)(HomeComponent);
