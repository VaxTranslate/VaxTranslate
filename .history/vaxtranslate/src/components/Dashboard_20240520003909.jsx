import React from "react";

const Pricing = () => {
  return (
    <section className="bg-light py-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h4 className="card-title">Basic Version</h4>
                <h1 className="card-text">$200.00</h1>
                <p>Feature 1</p>
                <p>Feature 2</p>
                <p>Feature 3</p>
                <button className="btn btn-primary">Get Started</button>
              </div>
            </div>
          </div>
          <div className="col-lg-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h4 className="card-title">Pro Version</h4>
                <h1 className="card-text">$400.00</h1>
                <p>Feature 1</p>
                <p>Feature 2</p>
                <p>Feature 3</p>
                <button className="btn btn-primary">Get Started</button>
              </div>
            </div>
          </div>
          <div className="col-lg-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h4 className="card-title">Plus Version</h4>
                <h1 className="card-text">$300.00</h1>
                <p>Feature 1</p>
                <p>Feature 2</p>
                <p>Feature 3</p>
                <button className="btn btn-primary">Get Started</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;