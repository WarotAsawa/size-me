import React from 'react';
import Container from 'react-bootstrap/Container';
import { Row } from 'react-bootstrap';
import CoverSmall from './CoverSmall';
import ContainerSizerForm from './ContainerSizerForm';

function ContainerSizer() {
  return(
    <div>
      <CoverSmall img="/assets/img/container-cover.svg"></CoverSmall>
      <Container>
        <Row className="my-5">
          <h3 className="display-4">Container Sizer</h3>
          <p className="lead">Simply imput your application resources requirement, node specification and cluster size and this tool will recommend the right sizing for you.</p>
        </Row>
        <Row className="my-5">
          <ContainerSizerForm></ContainerSizerForm>
        </Row>
      </Container>
    </div>
  );
}
export default ContainerSizer;