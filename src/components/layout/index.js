import React, { useState, useRef, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { Layout as DefaultLayout } from './Layout';
import { Header as DefaultHeader } from './Header';
import { Sidebar as DefaultSidebar } from './Sidebar';
import { EmptyMessage } from '@kineticdata/bundle-common';
import { actions } from '../../redux/modules/layout';

const INITIAL_ASIDE_WIDTH = 376;
const MIN_ASIDE_WIDTH = 224;
const MAX_ASIDE_BUFFER = 448;
const MIN_CONTENT_WIDTH = 1400;

const defineWidthAndOverlap = rawWidth => {
  // Make sure width is between min and max values
  const width = Math.max(
    Math.min(rawWidth, document.body.clientWidth - MAX_ASIDE_BUFFER),
    MIN_ASIDE_WIDTH,
  );
  return [
    width,
    // Calculate how much the aside will overlap the content
    Math.min(
      Math.max(MIN_CONTENT_WIDTH - (document.body.clientWidth - width), 0),
      width,
    ),
  ];
};

export default connect(
  state => ({
    sidebarOpen: state.layout.sidebarOpen,
  }),
  { setSidebarOpen: actions.setSidebarOpen },
)(props => {
  const {
    components: {
      Layout = DefaultLayout,
      Sidebar = DefaultSidebar,
      Header = DefaultHeader,
      Main,
    } = {},
    main: mainContent,
    shouldHideHeader,
    shouldHideSidebar,
    shouldSuppressSidebar,
    mobile,
    sidebarOpen,
    setSidebarOpen,
  } = props;

  // Sidebar state: 1 = open, 0 = closing, -1 = closed
  // const [sidebarOpen, setSidebarOpen] = useState(
  //   mobile || shouldSuppressSidebar ? -1 : 1,
  // );
  // Refs for main dom elements
  const bodyRef = useRef(null);
  const headerRef = useRef(null);
  const sidebarRef = useRef(null);
  const asideRef = useRef(null);
  const asideX = useRef(null);
  const [asideWidth, setAsideWidth] = useState(
    defineWidthAndOverlap(INITIAL_ASIDE_WIDTH),
  );

  // Handle scroll event to show header at the top of the page whenever the user
  // scrolls up
  useEffect(() => {
    if (
      !headerRef.current ||
      headerRef.current.classList.contains('app-header--sticky') ||
      !bodyRef.current
    ) {
      return;
    }

    let previousScrollTop = 0;
    const bodyEl = bodyRef.current,
      headerEl = headerRef.current;

    const handleBodyScroll = () => {
      const scrollingUp = bodyEl.scrollTop < previousScrollTop;
      if (scrollingUp) {
        const headerRects = headerEl.getClientRects()[0];
        // Add scrolled class to header if its floating below the top to add a drop-shadow
        if (bodyEl.scrollTop > 0) {
          headerEl.classList.add('scrolled');
        } else {
          headerEl.classList.remove('scrolled');
        }
        // If header isn't visible, move it into view
        if (headerRects.bottom < 0) {
          headerEl.style.top = `${previousScrollTop - headerRects.height}px`;
        }
        // If header is straddling the top, scroll with the page
        else if (headerRects.top < 0) {
          headerEl.style.top = `${headerEl.style.top + previousScrollTop}px`;
        }
        // If header is below the top, keep it locked at the top
        else {
          headerEl.style.top = `${bodyEl.scrollTop}px`;
        }
      }
      previousScrollTop = bodyEl.scrollTop;
    };

    bodyEl.addEventListener('scroll', handleBodyScroll, {
      passive: true,
    });
    return () => bodyEl.removeEventListener('scroll', handleBodyScroll);
  }, []);

  // Handle the resize event to make sidebar groups scrollable when needed,
  // and also to resize aside when it's open and the window is resized.
  useEffect(() => {
    if (!sidebarRef.current && !asideRef.current) {
      return;
    }

    const sidebarEl = sidebarRef.current;
    const asideEl = asideRef.current;

    const handleResize = () => {
      // CHeck if any of the sidebar children overflow
      if (sidebarEl) {
        [...sidebarEl.children].forEach(el => {
          if (el.scrollHeight > el.clientHeight) {
            el.classList.add('scrollable');
          } else {
            el.classList.remove('scrollable');
          }
        });
      }

      // Check aside width to make sure it isn't too large due to the window resize
      if (asideEl && asideEl.parentElement.classList.contains('aside--open')) {
        setAsideWidth(w => defineWidthAndOverlap(w[0]));
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle changing the sidebar state to closed after it is set to closing,
  // and setting the initial sidebar state
  useEffect(
    () => {
      if (sidebarOpen === 0) {
        if (mobile) {
          setSidebarOpen(-1);
        } else {
          setTimeout(() => setSidebarOpen(-1), 300);
        }
      } else if (sidebarOpen === null) {
        setSidebarOpen(mobile || shouldSuppressSidebar ? -1 : 1);
      }
    },
    [sidebarOpen, setSidebarOpen, mobile, shouldSuppressSidebar],
  );

  // Handler for toggling the sidebar open or closed
  const toggleSidebar = useCallback(
    () => {
      setSidebarOpen(sidebarOpen > 0 ? 0 : 1);
    },
    [sidebarOpen, setSidebarOpen],
  );

  // Handler for toggling sidebar after a link it it was clicked
  const onSidebarAction = useCallback(
    () => {
      console.log('onSidebarAction', mobile, sidebarOpen < 0);
      if (mobile) {
        setSidebarOpen(-1);
      } else if (sidebarOpen < 0) {
        setSidebarOpen(0);
      }
    },
    [mobile, sidebarOpen, setSidebarOpen],
  );

  //Event handler for mouseMove that sets the width of the aside
  const onResizeAside = useCallback(
    e => {
      if (!asideRef.current) {
        asideX.current = e.x;
        return;
      }

      // Do not resize is mouse is outside min/max width
      if (
        e.x >= MAX_ASIDE_BUFFER &&
        e.x <= document.body.clientWidth - MIN_ASIDE_WIDTH
      ) {
        const dx = asideX.current - e.x;
        setAsideWidth(defineWidthAndOverlap(asideWidth[0] + dx));
      }
    },
    [asideX, asideWidth, setAsideWidth],
  );

  // Event handler for mouseUp of mouseLeave for ending the aside resize
  const onResizeAsideEnd = () => {
    asideRef.current.parentElement.classList.remove('aside--resizing');
    document.body.removeEventListener('mousemove', onResizeAside);
  };

  // Event handler for mouseDown for starting the aside resize
  const resizeAside = e => {
    if (
      !asideRef.current.parentElement.classList.contains('aside--collapsed')
    ) {
      asideX.current = e.clientX;
      asideRef.current.parentElement.classList.add('aside--resizing');
      document.body.addEventListener('mousemove', onResizeAside);
      document.body.addEventListener('mouseup', onResizeAsideEnd, {
        once: true,
      });
    }
  };

  // Toggle collapsed state of the aside
  const toggleAside = e => {
    if (asideRef.current) {
      if (
        asideRef.current.parentElement.classList.contains('aside--collapsed')
      ) {
        asideRef.current.parentElement.classList.remove('aside--collapsed');
      } else if (
        asideRef.current.parentElement.classList.contains('aside--open')
      ) {
        asideRef.current.parentElement.classList.add('aside--collapsed');
      }
    }
  };

  // Header content to render
  const header = !shouldHideHeader ? (
    <Header toggleSidebar={toggleSidebar} mobile={mobile} />
  ) : null;
  // Sidebar content to render
  const sidebar = !shouldHideSidebar ? (
    <Sidebar
      toggleSidebar={toggleSidebar}
      onSidebarAction={onSidebarAction}
      mobile={mobile}
    />
  ) : null;
  // Main content to render
  const main = Main ? (
    <Main />
  ) : (
    mainContent || <EmptyMessage title="There's nothing here." />
  );

  return (
    <Layout
      sidebar={sidebar}
      header={header}
      main={main}
      sidebarRef={sidebarRef}
      headerRef={headerRef}
      bodyRef={bodyRef}
      asideRef={asideRef}
      mobile={mobile}
      sidebarOpen={sidebarOpen}
      toggleSidebar={toggleSidebar}
      resizeAside={resizeAside}
      toggleAside={toggleAside}
      asideWidth={asideWidth}
    />
  );
});
