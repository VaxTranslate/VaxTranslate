import React, { useState } from 'react';
import '../styles/login.css';
import '../App.css';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  }

  return (
    <section className="vh-100 d-flex align-items-center justify-content-center login-background">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 text-black">
            <div className="text-center mb-4">
              <i className="fas fa-crow fa-2x" style={{ color: '#709085' }}></i>
            </div>
            <div className="card shadow-lg p-4" style={{ borderRadius: '20px' }}>
              <form>
                <h3 className="fw-normal mb-3 pb-3" style={{ letterSpacing: '1px' }}>
                  {isLogin ? 'Log in' : 'Sign up'}
                </h3>
                {!isLogin && (
                  <div data-mdb-input-init className="form-outline mb-4">
                    <input type="text" id="form3Example1" className="form-control form-control-lg" />
                    <label className="form-label" htmlFor="form3Example1">Full Name</label>
                  </div>
                )}
                <div data-mdb-input-init className="form-outline mb-4">
                  <label className="form-label" htmlFor={isLogin ? "form2Example18" : "form3Example2"}>Email address</label>
                  <input type="email" id={isLogin ? "form2Example18" : "form3Example2"} className="form-control form-control-lg" />
                  
                </div>
                <div data-mdb-input-init className="form-outline mb-4">
                  <label className="form-label" htmlFor={isLogin ? "form2Example28" : "form3Example3"}>Password</label>
                  <input type="password" id={isLogin ? "form2Example28" : "form3Example3"} className="form-control form-control-lg" />
                  
                </div>
                <div className="pt-1 mb-4">
                  <button
                    data-mdb-button-init
                    data-mdb-ripple-init
                    className="btn custom-btn-info btn-lg btn-block" 
                    type="button"
                    style={{ borderRadius: '15px' }}
                  >
                    {isLogin ? 'Login' : 'Sign up'}
                  </button>
                </div>
                {isLogin ? (
                  <p className="small mb-5 pb-lg-2"><a className="text-muted" href="#!">Forgot password?</a></p>
                ) : null}
                <p>
                  {isLogin ? "Don't have an account?" : 'Already have an account?'}
                  <a href="#!" className="link-info" onClick={toggleForm}>
                    {isLogin ? ' Register here' : ' Log in here'}
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;
