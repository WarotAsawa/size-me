import React from 'react';
import "./Cover.css";

function CoverSmall(prop) {
  return(
    <div className="section-fade-out pt-3 custom-cover">
      <div className="container">
        <div className="row">
          <div className="col-md-6 my-2 text-lg-left text-center align-self-center">
            <h1 className="display-2"><i className="fa fa-fw fa-cube"></i>SIZE ME</h1>
            <p className="lead">Coolest way to create a sizing for your Virtualization and Container environment.</p>
            <div className="row mt-2"></div>
          </div>
          <div className="col-lg-6">
            <img className="img-fluid d-block mx-auto p-5" src={prop.img} alt="Home Page Cover" width="400"></img>
          </div>
        </div>
      </div>  
    </div>
    
  );
}
export default CoverSmall;