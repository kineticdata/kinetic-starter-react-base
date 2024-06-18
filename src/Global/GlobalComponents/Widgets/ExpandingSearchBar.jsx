import React from "react";

// Included optional expandable search bar, intended to be used in the header.
// Search funstionality and display not included.
export const ExpandingSearchBar = () => {

    return (
        <div className='search-box'>
              <input className="search-text" type="text" placeholder="Search Kinetic Data" />
              <div className="search-btn">
                <i className='las la-search standard-icon-size' aria-hidden="true"></i>
              </div>
        </div>
    );
};