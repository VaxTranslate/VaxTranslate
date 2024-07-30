import React from "react";
import ListComponent from "./List";

function Home() {
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12 text-left">
          <h1 className="text-center">VaxTranslate</h1>
          <ListComponent />
        </div>
      </div>
    </div>
  );
}

export default Home;