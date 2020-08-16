import React from 'react';
import { Card, ListGroup, CardGroup } from 'react-bootstrap';

export function SpecToolTip(prop) {
    return(
        <ListGroup variant="flush">
            <ListGroup.Item className='d-flex justify-content-between align-items-center'>
                {"Your sizing is enough without over subscription"}
                {<span className="badge badge-info badge-pill">SAFE</span>}
            </ListGroup.Item>
            <ListGroup.Item className='d-flex justify-content-between align-items-center'>
	    	    {"Your sizing is enough and meet your targetted utilization"}
	    		{<span className="badge badge-success badge-pill">PASS</span>}
	    	</ListGroup.Item>
            <ListGroup.Item className='d-flex justify-content-between align-items-center'>
	    	    {"Your sizing is enough but not for your targetted utilization"}
	    		{<span className="badge badge-warning badge-pill">CAUT</span>}
	    	</ListGroup.Item>
            <ListGroup.Item className='d-flex justify-content-between align-items-center'>
	    	    {"Your sizing is not enough! Please follow the recommendations."}
	    		{<span className="badge badge-danger badge-pill">FAIL</span>}
	    	</ListGroup.Item>
        </ListGroup>
    );
}
export function RecommendToolTip(prop) {
    return(
        <ListGroup variant="flush">
            <ListGroup.Item className='d-flex justify-content-between align-items-center'>
			    {"Your sizing is better than the workloads. The number indicates oversized value."}
				{<span className="badge badge-success badge-pill">34</span>}
			</ListGroup.Item>
            <ListGroup.Item className='d-flex justify-content-between align-items-center'>
			    {"Your sizing is lower than the workloads. The number indicates undersized value."}
				{<span className="badge badge-danger badge-pill">12</span>}
			</ListGroup.Item>
        </ListGroup>
    );
} 
function SizerToolTip(props) {
    return(
        <CardGroup>
            <Card>
                <Card.Header>Summary Legend:</Card.Header>
                <Card.Body>
                    <SpecToolTip></SpecToolTip>
                </Card.Body>
            </Card>
            
            <Card>
                <Card.Header>Recommendation Legend:</Card.Header>
                <Card.Body>
                    <RecommendToolTip></RecommendToolTip>
                </Card.Body>
            </Card>
        </CardGroup>
    );
}

export default SizerToolTip;
