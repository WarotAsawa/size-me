import React from 'react';
import history from './history';

function HomeContent() {
  return(
    <div className="py-5">
      <div className="container">
        <div className="row py-5" >
          <div className="col-md-5 order-2 order-md-1 animate-in-left">
            <img className="img-fluid d-block mx-auto" src="/assets/img/vm-cover.svg" alt="Stateless Cover" height="100%"></img> 
          </div>
          <div className="col-md-7 align-self-center order-1 order-md-2 my-3 text-md-left text-center">
            <h2>VIRTUALIZATION SIZER</h2>
            <p className="my-4">Simply imput your Virtualization resources requirement, node specification and cluster size and this tool will recommend the right sizing for you.</p>
            <a className="btn btn-secondary text-dark" onClick={() => history.push('/vm-sizer')}>SIZE NOW</a>
          </div>
        </div>
        <div className="row pt-5">
          <div className="align-self-center col-lg-7 text-md-left text-center">
            <h2>CONTAINER SIZER</h2>
            <p className="my-4">Simply imput your application resources requirement, node specification and cluster size and this tool will recommend the right sizing for you.&nbsp;</p>
            <a className="btn btn-primary text-dark" onClick={() => history.push('/container-sizer')}>SIZE NOW</a>
          </div>
          <div className="align-self-center mt-5 col-lg-5 animate-in-right">
						<img className="img-fluid d-block mx-auto" src="/assets/img/container-cover.svg" alt="Stateful Cover" height="100%"></img> 
          </div>
        </div>
      </div>
    </div>
  );
}
export default HomeContent;