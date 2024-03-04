import React from "react";

// An expandable search bar, intended to be used in the header.
// Search funstionality and display not included.
export const ExpandingSearchBar = () => {

    return (
        <div className='search-box'>
              <input className="search-text" type="text" placeholder="Search Kinetic Data" />
              <div className="search-btn">
                <i className='fa fa-search' aria-hidden="true"></i>
              </div>
        </div>
    );
};