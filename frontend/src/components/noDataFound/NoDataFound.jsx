import React from "react";
import "./style.scss";

import ContentWrapper from "../contentWrapper/ContentWrapper";

const NoDataFound = () => {
  return (
    <div className="pageNotFound">
      <ContentWrapper>
        <span className="bigText">404</span>
        <span className="smallText">
          Explore Movies and TV Shows and add your favorite shows here!
        </span>
      </ContentWrapper>
    </div>
  );
};

export default NoDataFound;
