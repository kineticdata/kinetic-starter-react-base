import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Layout as DefaultLayout } from './Layout';
import { Header as DefaultHeader } from './Header';
import { Sidebar as DefaultSidebar } from './Sidebar';
import { EmptyMessage } from '@kineticdata/bundle-common';

export default props => {
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
  } = props;

  // Sidebar state: 1 = open, 0 = closing, -1 = closed
  const [sidebarOpen, setSidebarOpen] = useState(
    mobile || shouldSuppressSidebar ? -1 : 1,
  );
  // Refs for main dom elements
  const bodyRef = useRef(null);
  const headerRef = useRef(null);
  const sidebarRef = useRef(null);

  // Handle scroll event to show header at the top of the page whenever the user
  // scrolls up
  useEffect(
    () => {
      if (
        !headerRef ||
        !headerRef.current ||
        headerRef.current.classList.contains('app-header--sticky') ||
        !bodyRef ||
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
    },
    [bodyRef, headerRef],
  );

  // Handle the resize event to make sidebar groups scrollable when needed.
  useEffect(
    () => {
      if (!sidebarRef || !sidebarRef.current) {
        return;
      }

      const sidebarEl = sidebarRef.current;

      const handleResize = () => {
        [...sidebarEl.children].forEach(el => {
          if (el.scrollHeight > el.clientHeight) {
            el.classList.add('scrollable');
          } else {
            el.classList.remove('scrollable');
          }
        });
      };

      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    },
    [sidebarRef],
  );

  // Handle changing the sidebar state to closed after it is set to closing
  useEffect(
    () => {
      if (sidebarOpen === 0) {
        if (mobile) {
          setSidebarOpen(-1);
        } else {
          setTimeout(() => setSidebarOpen(-1), 300);
        }
      }
    },
    [sidebarOpen, mobile],
  );

  // Handler for toggling the sidebar open or closed
  const toggleSidebar = useCallback(
    () => {
      setSidebarOpen(sidebarOpen > 0 ? 0 : 1);
    },
    [sidebarOpen, setSidebarOpen],
  );

  // Header content to render
  const header = !shouldHideHeader ? (
    <Header toggleSidebar={toggleSidebar} mobile={mobile} />
  ) : null;
  // Sidebar content to render
  const sidebar = !shouldHideSidebar ? (
    <Sidebar toggleSidebar={toggleSidebar} mobile={mobile} />
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
      mobile={mobile}
      sidebarOpen={sidebarOpen}
      toggleSidebar={toggleSidebar}
    />
  );
};
