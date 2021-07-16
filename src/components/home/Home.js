import React, { Fragment } from 'react';
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

const titleProps = {};

const pageContent = (
  <div>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
    non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
    doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
    veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim
    ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
    consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque
    porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur,
    adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et
    dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis
    nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid
    ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea
    voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem
    eum fugiat quo voluptas nulla pariatur?
  </div>
);

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
        overlayColor="rgba(9,84,130,0.9)"
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
              <div className="nav nav-tabs mb-3">
                <span className="nav-item">
                  <span className="nav-link active h5 m-0">
                    <I18n>Recent Requests</I18n>
                  </span>
                </span>
                <div className="ml-auto d-flex align-items-center">
                  <Link
                    className="btn btn-link"
                    to={`/kapps/${servicesKapp.slug}/requests`}
                  >
                    <I18n>View All</I18n>
                  </Link>
                </div>
              </div>
              <div className="cards">
                <ServicesActivity />
              </div>
            </>
          )}
          {!!queueKapp && (
            <>
              <div className="nav nav-tabs mt-5 mb-3">
                <span className="nav-item">
                  <span className="nav-link active h5 m-0">
                    <I18n>Queue Actions</I18n>
                  </span>
                </span>
                <div className="ml-auto d-flex align-items-center">
                  <Link
                    className="btn btn-link"
                    to={`/kapps/${queueKapp.slug}/requests`}
                  >
                    <I18n>View All</I18n>
                  </Link>
                </div>
              </div>
              <div className="cards">
                <QueueActivity />
              </div>
            </>
          )}
        </div>

        {rootCategories && (
          <div className="column-panel column-panel--thirds">
            <div className="nav nav-tabs mb-3">
              <span className="nav-item">
                <span className="nav-link active h5 m-0">
                  <I18n>Categories</I18n>
                </span>
              </span>
              <div className="ml-auto d-flex align-items-center">
                <Link
                  className="btn btn-link"
                  to={`/kapps/${servicesKapp.slug}/categories`}
                >
                  <I18n>View All</I18n>
                </Link>
              </div>
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
