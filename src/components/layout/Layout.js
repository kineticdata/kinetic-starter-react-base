import React from 'react';
import classNames from 'classnames';

export const Layout = ({
  sidebar,
  header,
  main,
  sidebarRef,
  headerRef,
  bodyRef,
  mobile,
  sidebarOpen,
  toggleSidebar,
}) => {
  return (
    <div className="app-wrapper">
      {!!sidebar && (
        <nav
          className={classNames('app-sidebar', {
            closed: !mobile && sidebarOpen === -1,
            closing: !mobile && sidebarOpen === 0,
            open: mobile && sidebarOpen > 0,
          })}
          ref={sidebarRef}
        >
          {sidebar}
        </nav>
      )}

      <div
        className="app-body"
        ref={bodyRef}
        onClick={
          mobile && !!sidebar && sidebarOpen > 0 ? toggleSidebar : undefined
        }
      >
        {!!header && (
          <header className="app-header app-header--sticky" ref={headerRef}>
            {header}
          </header>
        )}

        <main className="app-main">{main}</main>
      </div>
    </div>
  );
};
