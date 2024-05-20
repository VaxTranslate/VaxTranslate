import React from "react";

const Features = () => {
  return (
    <section className="py-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h4 className="card-title">Latest Camera</h4>
                <p className="card-text">Description of camera</p>
              </div>
            </div>
          </div>
          <div className="col-lg-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h4 className="card-title">Processor</h4>
                <p className="card-text">Description of processor</p>
              </div>
            </div>
          </div>
          <div className="col-lg-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h4 className="card-title">RAM</h4>
                <p className="card-text">Description of RAM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;