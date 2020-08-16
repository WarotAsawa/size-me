import React from 'react';
import Container from 'react-bootstrap/Container';
import { Row } from 'react-bootstrap';
import CoverSmall from './CoverSmall';
import VMSizerForm from './VMSizerForm';

function VMSizer() {
  return(
    <div>
      <CoverSmall img="/assets/img/vm-cover.svg"></CoverSmall>
      <Container>
        <Row className="my-5">
          <h3 className="display-4">Virtualization Sizer</h3>
          <p className="lead">Simply imput your Virtualization resources requirement, node specification and cluster size and this tool will recommend the right sizing for you.</p>
        </Row>
        <Row className="my-5">
          <VMSizerForm></VMSizerForm>
        </Row>
      </Container>
    </div>
  );
}
export default VMSizer;