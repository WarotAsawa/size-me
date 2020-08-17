import React from 'react';
import { Row, Col, ListGroup, Button, OverlayTrigger, Popover } from 'react-bootstrap';
import { SpecToolTip, RecommendToolTip } from './SizerToolTip'
//import { CopyToClipBoard } from './CopyToClipBoard';
const specPopOver = (
	<Popover className='bg-dark' id="popover-dark">
	  <Popover.Title className='bg-dark' as="h3">Summary Legend:</Popover.Title>
	  <Popover.Content>
		<SpecToolTip></SpecToolTip>
	  </Popover.Content>
	</Popover>
);
const recommendPopOver = (
	<Popover className='bg-dark' id="popover-dark">
	  <Popover.Title className='bg-dark' as="h3">Recommendation Legend:</Popover.Title>
	  <Popover.Content>
		<RecommendToolTip></RecommendToolTip>
	  </Popover.Content>
	</Popover>
);
function ShowAlertRatio(target, value, utilization, ratio=1) {
	if (value*utilization >= target) {
		return (
			<span className="badge badge-info badge-pill">SAFE</span>
		);
	} else if (value*ratio*utilization >= target) {
		return (
			<span className="badge badge-success badge-pill">PASS</span>
		);
	} else if (value*ratio >= target) {
		return (
			<span className="badge badge-warning badge-pill">CAUT</span>
		);
	} else {
		return (
			<span className="badge badge-danger badge-pill">FAIL</span>
		);
	}
}

function ShowAlert(target, value, utilization) {
	if (value*utilization >= target) {
		return (
			<span className="badge badge-success badge-pill">PASS</span>
		);
	} else if (value >= target) {
		return (
			<span className="badge badge-warning badge-pill">CAUT</span>
		);
	} else {
		return (
			<span className="badge badge-danger badge-pill">FAIL</span>
		);
	}
}
function DiffAlert(target, value) {
	if (value >= target) {
		return (
			<span className="badge badge-success badge-pill">{Math.ceil(value-target)}</span>
		);
	} else {
		return (
			<span className="badge badge-danger badge-pill">{Math.ceil(value-target)}</span>
		);
	}
}
function ContainerSummary(props) {
	var app = props.app;

	//Initial Value:
	var selectedCPU = app.selectedCPUSpec;
	//Prepare Node Spec
	var nodeCPU = selectedCPU['description'];
	var nodeDIMMSize = parseFloat(app.dimmSize);
	var nodeDIMMSlot = parseFloat(app.dimmSlot);
	var nodeGHz = parseFloat(selectedCPU['GHz']);
	var nodeCore = parseFloat(selectedCPU['cores']);
	var nodeSocket = parseFloat(app.socket);
	var nodeMemory = parseFloat(app.dimmSlot) * parseInt(app.dimmSize);
	//Prepare Cluster Spec
	var cpuOccupancy = parseFloat(app.cpuOccupancy)/100;
	var memoryOccupancy = parseFloat(app.memoryOccupancy)/100;
	var storageOccupancy = parseFloat(app.storageOccupancy)/100;
	var proposedNode = parseFloat(app.proposedNode);
	var redundantNode = parseFloat(app.redundantNode);
	var v2p = parseFloat(app.v2p);
	var dataReduction = parseFloat(app.dataReduction);
	//Prepare Cluster Total Resources
	var clusterCPUAll = nodeCore*nodeSocket*(proposedNode);
	var clusterCPUDown = nodeCore*nodeSocket*(proposedNode-redundantNode);
	var clustervCPUAll = v2p*nodeCore*nodeSocket*(proposedNode);
	var clustervCPUDown = v2p*nodeCore*nodeSocket*(proposedNode-redundantNode);
	var clusterMemoryAll = nodeDIMMSize*nodeDIMMSlot*(proposedNode);
	var clusterMemoryDown = nodeDIMMSize*nodeDIMMSlot*(proposedNode-redundantNode);
	var proposedStorage = parseFloat(app.proposedStorage);
	var effectiveStorage = proposedStorage*dataReduction;
	//Summarize Workload
	var totalvCPU = app.workloads.reduce((a,b) => (a+parseFloat(b['vcpu'])),0);
	var totalCPU = totalvCPU/v2p;
	var totalMemory = app.workloads.reduce((a,b) => (a+parseFloat(b['vmemory'])),0);
	var totalStorage = app.workloads.reduce((a,b) => (a+parseFloat(b['vdisk'])),0);
	//recommend nodes
	var cpuRecommend = Math.ceil(totalCPU/cpuOccupancy/(nodeCore*nodeSocket))+redundantNode;
	var memoryRecommend = Math.ceil(totalMemory/memoryOccupancy/(nodeDIMMSlot*nodeDIMMSize))+redundantNode;
  	return(
		<Col>
			<div className='row my-3'><h3 className='my-auto'>Sizing Summary:</h3></div>
			{/* Sizing Summary */}
			<div className='row my-auto'>
				<h4 className='my-auto'>Cluster's Summary:</h4>
				<OverlayTrigger trigger={['hover','focus']} placement="right" overlay={specPopOver}>
    				<Button className='mx-2 py-0 px-1' variant="dark">?</Button>
  				</OverlayTrigger>
			</div>
			<Row className='mb-2'>		
				<Col boarder='secondary'>
    				<div className='bg-primary text-dark py-2 px-2' style={{fontWeight:'900'}}>Per Node Specification:</div>
					<div>
						<ListGroup variant="flush">
							<ListGroup.Item className='d-flex justify-content-between align-items-center'>{"CPU Model: "+nodeSocket+" x "+nodeCPU}</ListGroup.Item>
							<ListGroup.Item className='d-flex justify-content-between align-items-center'>{"Total CPU Cores: "+nodeCore+" Cores"}</ListGroup.Item>
							<ListGroup.Item className='d-flex justify-content-between align-items-center'>{"Total CPU GHZ: "+nodeGHz+" GHz"}</ListGroup.Item>
							<ListGroup.Item className='d-flex justify-content-between align-items-center'>{"Memory Configuration: "+nodeDIMMSlot+" x "+nodeDIMMSize+" GB DDR4"}</ListGroup.Item>
							<ListGroup.Item className='d-flex justify-content-between align-items-center'>{"Total Memory: "+ nodeMemory+" GB"}</ListGroup.Item>
     					</ListGroup>
    				</div>
  				</Col>
				<Col boarder='secondary'>
    				<div className='bg-secondary text-dark py-2 px-2' style={{fontWeight:'900'}}>{proposedNode+" Nodes Spec"}</div>
    				<div>
					<ListGroup variant="flush">
						<ListGroup.Item className='d-flex justify-content-between align-items-center'>
							{"Total CPU Cores: "+clusterCPUAll+" Cores"}							
							{ShowAlertRatio(totalvCPU,clusterCPUDown,cpuOccupancy,v2p)}	
							</ListGroup.Item>
							<ListGroup.Item className='d-flex justify-content-between align-items-center'>{"Total CPU GHZ: "+(nodeGHz*nodeSocket*(proposedNode)).toFixed(1)+" GHz"}</ListGroup.Item>
							<ListGroup.Item className='d-flex justify-content-between align-items-center'>
								{"Total vCPU Cores: "+clustervCPUAll+" Cores"}
							 	{ShowAlertRatio(totalvCPU,clusterCPUDown,cpuOccupancy,v2p)}
							</ListGroup.Item>
							<ListGroup.Item className='d-flex justify-content-between align-items-center'>
								{"Total Memory: "+clusterMemoryAll+" GB"}
								{ShowAlert(totalMemory,clusterMemoryDown,memoryOccupancy)}	
							</ListGroup.Item>
							<ListGroup.Item className='d-flex justify-content-between align-items-center'>
								{"Total Usable Capacity: "+proposedStorage+" TB"}
								{ShowAlertRatio(totalStorage,proposedStorage,storageOccupancy,dataReduction)}
							</ListGroup.Item>
							<ListGroup.Item className='d-flex justify-content-between align-items-center'>
								{"Total Effective Capacity: "+effectiveStorage+" TB"}
								{ShowAlertRatio(totalStorage,proposedStorage,storageOccupancy,dataReduction)}
							</ListGroup.Item>
						</ListGroup>
    				</div>
  				</Col>
				<Col boarder='secondary'>
    				<div className='bg-info text-dark py-2 px-2' style={{fontWeight:'900'}}>{(proposedNode-redundantNode)+" Nodes Spec ( "+redundantNode+" Nodes Down )"}</div>
    				<div>
						<ListGroup variant="flush">
							<ListGroup.Item className='d-flex justify-content-between align-items-center'>
								{"Total CPU Cores: "+clusterCPUDown+" Cores"}
								{ShowAlertRatio(totalvCPU,clusterCPUDown,cpuOccupancy,v2p)}	
							</ListGroup.Item>
							<ListGroup.Item className='d-flex justify-content-between align-items-center'>{"Total CPU GHZ: "+(nodeGHz*nodeSocket*(proposedNode-redundantNode)).toFixed(1)+" GHz"}</ListGroup.Item>
							<ListGroup.Item className='d-flex justify-content-between align-items-center'>
								{"Total vCPU Cores: "+clustervCPUDown+" Cores"}
							 	{ShowAlertRatio(totalvCPU,clusterCPUDown,cpuOccupancy,v2p)}
							</ListGroup.Item>
							<ListGroup.Item className='d-flex justify-content-between align-items-center'>
								{"Total Memory: "+clusterMemoryDown+" GB"}
								{ShowAlert(totalMemory,clusterMemoryDown,memoryOccupancy)}	
							</ListGroup.Item>
							<ListGroup.Item className='d-flex justify-content-between align-items-center'>
								{"Total Usable Capacity: "+proposedStorage+" TB"}
								{ShowAlertRatio(totalStorage,proposedStorage,storageOccupancy,dataReduction)}
							</ListGroup.Item>
							<ListGroup.Item className='d-flex justify-content-between align-items-center'>
								{"Total Effective Capacity: "+effectiveStorage+" TB"}
								{ShowAlertRatio(totalStorage,proposedStorage,storageOccupancy,dataReduction)}
							</ListGroup.Item>
						</ListGroup>
    				</div>
  				</Col>
			</Row>	
			{/* Recommendation */}
			<div className='row my-auto'>
				<h4 className='my-auto'>Recommendation:</h4>
				<OverlayTrigger trigger={['hover','focus']} placement="right" overlay={recommendPopOver}>
    				<Button className='mx-2 py-0 px-1' variant="dark">?</Button>
  				</OverlayTrigger>
			</div>
			<div className='row my-auto text-muted'><h5>Based on your node specification and fault tolerant and targetted utilization</h5></div>
			<Row className='mb-2'>		
				<div className='col-4' boarder='secondary'>
    				<div className='bg-info text-dark py-2 px-2' style={{fontWeight:'900'}}>Cluster Size Recommendation:</div>
					<div>
						<ListGroup variant="flush">
							<ListGroup.Item className='d-flex justify-content-between align-items-center'>
								{"Node Required for CPU: "+cpuRecommend + " Nodes"}
								{DiffAlert(cpuRecommend,proposedNode)}
							</ListGroup.Item>
							<ListGroup.Item className='d-flex justify-content-between align-items-center'>
								{"Node Required for Memory: "+memoryRecommend + " Nodes"}
								{DiffAlert(memoryRecommend,proposedNode)}
							</ListGroup.Item>
							<ListGroup.Item className='d-flex justify-content-between align-items-center'>
								{"Overall Recommendation: "+Math.max(memoryRecommend,cpuRecommend) + " Nodes"}
								{DiffAlert(Math.max(memoryRecommend,cpuRecommend),proposedNode)}
							</ListGroup.Item>
     					</ListGroup>
    				</div>
  				</div>	
				<div className='col-8' boarder='secondary'>
    				<Row>
						<Col className='p-0'>
							<div className='bg-dark py-2' style={{fontWeight:'900'}}>{"Specification"}:</div>
							<ListGroup variant="flush">
	  							<ListGroup.Item className='d-flex justify-content-between align-items-center'>{'CPU (m Cores)'}</ListGroup.Item>
								<ListGroup.Item className='d-flex justify-content-between align-items-center'>{'Memory (MiB)'}</ListGroup.Item>
								<ListGroup.Item className='d-flex justify-content-between align-items-center'>{'Effective (GiB)'}</ListGroup.Item>
     						</ListGroup>
    					</Col>
						<Col className='p-0'>
							<div className='bg-dark py-2' style={{fontWeight:'900'}}>{"Usable Resources"}:</div>
							<ListGroup variant="flush">
								<ListGroup.Item className='d-flex justify-content-between align-items-center'>{(cpuOccupancy * clustervCPUDown*1000).toFixed(1)}</ListGroup.Item>
								<ListGroup.Item className='d-flex justify-content-between align-items-center'>{(memoryOccupancy * clusterMemoryDown/0.001049).toFixed(1)}</ListGroup.Item>
								<ListGroup.Item className='d-flex justify-content-between align-items-center'>{(storageOccupancy * effectiveStorage/0.001074).toFixed(1)}</ListGroup.Item>
							</ListGroup>
						</Col>
						<Col className='p-0'>
							<div className='bg-dark py-2' style={{fontWeight:'900'}}>{"Total Workload"}:</div>
							<ListGroup variant="flush">
								<ListGroup.Item className='d-flex justify-content-between align-items-center'>{totalvCPU*1000}</ListGroup.Item>
								<ListGroup.Item className='d-flex justify-content-between align-items-center'>{totalMemory /0.001049}</ListGroup.Item>
								<ListGroup.Item className='d-flex justify-content-between align-items-center'>{totalStorage/0.001074}</ListGroup.Item>
							</ListGroup>
    					</Col>
						<Col className='p-0'>
							<div className='bg-dark py-2' style={{fontWeight:'900'}}>{"Resource Diff"}:</div>
							<ListGroup variant="flush">
								<ListGroup.Item className='align-items-center'>{'  '}{DiffAlert(totalvCPU*1000,(cpuOccupancy * clustervCPUDown*1000))}</ListGroup.Item>
								<ListGroup.Item className='align-items-center'>{'  '}{DiffAlert(totalMemory /0.001049,(memoryOccupancy * clusterMemoryDown/0.001049))}</ListGroup.Item>
								<ListGroup.Item className='align-items-center'>{'  '}{DiffAlert(totalStorage/0.001074, (storageOccupancy * effectiveStorage/0.001074))}</ListGroup.Item>
							</ListGroup>
						</Col>
					</Row>
  				</div>	
			</Row>	
{/* 			
			<Row>
				<Button 
					className='float-left'
					onClick={() => {
						//CopyToClipBoard(deployYaml);
						//alert(deployFileName+'.yaml has been copied to clipboard.');}
					} 
					variant="info">
					Copy to Clipboard
				</Button>{' '}
				<Button
					className='ml-2'
					onClick={() => {
						//DownloadString(deployYaml,"text",deployFileName+".yaml")}
					} 
					variant="success">
					Download .yaml file
				</Button>{' '}
			</Row> 
*/}
		</Col>
  	);
}

export default ContainerSummary;