import React , { useState } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Grommet, Box, Meter, Stack, Text } from 'grommet';


function UtilizationSummary(props) {
    var app = props.app;

	//Initial Value:
	var selectedCPU = app.selectedCPUSpec;
	//Prepare Node Spec
	var nodeDIMMSize = parseFloat(app.dimmSize);
	var nodeDIMMSlot = parseFloat(app.dimmSlot);
	var nodeCore = parseFloat(selectedCPU['cores']);
	var nodeSocket = parseFloat(app.socket);
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
	var clusterMemoryAll = nodeDIMMSize*nodeDIMMSlot*(proposedNode);
	var clusterMemoryDown = nodeDIMMSize*nodeDIMMSlot*(proposedNode-redundantNode);
	var proposedStorage = parseFloat(app.proposedStorage);
	//Summarize Workload
	var totalvCPU = app.workloads.reduce((a,b) => (a+parseFloat(b['vcpu'])),0);
	var totalCPU = totalvCPU/v2p;
	var totalMemory = app.workloads.reduce((a,b) => (a+parseFloat(b['vmemory'])),0);
	var totalStorage = app.workloads.reduce((a,b) => (a+parseFloat(b['vdisk'])),0);
    
	const [ activeCPUALL, setActiveCPUALL ] = useState();
	const [ labelCPUALL, setLabelCPUALL ] = useState();
	const [ activeMEMALL, setActiveMEMALL ] = useState();
	const [ labelMEMALL, setLabelMEMALL ] = useState();
	const [ activeDiskALL, setActiveDiskALL ] = useState();
	const [ labelDiskALL, setLabelDiskALL ] = useState();

	const [ activeCPUDown, setActiveCPUDown ] = useState();
	const [ labelCPUDown, setLabelCPUDown ] = useState();
	const [ activeMEMDown, setActiveMEMDown ] = useState();
	const [ labelMEMDown, setLabelMEMDown ] = useState();
      
    return (
        <Card>
            <Card.Header><h2>Cluster Utilization Summary</h2></Card.Header>
            <Card.Body>
                <div className='mx-2'><h5>{proposedNode+" Nodes utilization :"}</h5></div> 
                <Row>
                    <Col>
                    <Grommet>
                        <Box  align="center" pad="medium">
                            <Stack anchor="center">
                                <Meter
									type="circle"
									round={true}
                                    values={[
                                    {
										value: Math.round(totalCPU*100/clusterCPUAll),
										color: (totalCPU/clusterCPUAll) <= cpuOccupancy ? '#ad65ff' : (totalCPU/clusterCPUAll) <= 1 ? '#ffc107' : '#dc3545',
                                        onHover: over => {
                                          setActiveCPUALL(over ? (totalCPU).toFixed(1) : 0);
                                          setLabelCPUALL(over ? 'cores used' : undefined);
                                        },
                                    },
                                    {
										value: 100-Math.round(totalCPU*100/clusterCPUAll),
										color: '#777777',
                                        onHover: over => {
                                            setActiveCPUALL(over ? (clusterCPUAll-totalCPU).toFixed(1) : 0);
                                            setLabelCPUALL(over ? 'cores unused' : undefined);
                                        },
                                    },
                                ]}
                                max={100}
                                size="small"
                                thickness="xsmall"
                                />
                                <Box align="center">
                                    <Box direction="row" align="center" pad={{ bottom: 'xsmall' }}>
                                        <Text size="xxlarge" weight="bold">
                                            {activeCPUALL || Math.round(totalCPU*100/clusterCPUAll)+"%"}
                                        </Text>
                                    </Box>
                                    <Text size='xsmall'>{labelCPUALL || 'CPU USED'}</Text>
                                </Box>
                            </Stack>
                        </Box>
                    </Grommet>
                    </Col>
                    <Col>
					<Grommet>
                        <Box  align="center" pad="medium">
                            <Stack anchor="center">
                                <Meter
									type="circle"
									round={true}
                                    values={[
                                    {
										value: Math.round(totalMemory*100/clusterMemoryAll),
										color: (totalMemory/clusterMemoryAll) <= memoryOccupancy ? '#ad65ff' : (totalMemory/clusterMemoryAll) <= 1 ? '#ffc107' : '#dc3545',
                                        onHover: over => {
                                          setActiveMEMALL(over ? (totalMemory).toFixed(1) : 0);
                                          setLabelMEMALL(over ? 'GB used' : undefined);
                                        },
                                    },
                                    {
										value: 100-Math.round(totalMemory*100/clusterMemoryAll),
										color: '#777777',
                                        onHover: over => {
                                            setActiveMEMALL(over ? (clusterMemoryAll-totalMemory).toFixed(1) : 0);
                                            setLabelMEMALL(over ? 'GB unused' : undefined);
                                        },
                                    },
                                ]}
                                max={100}
                                size="small"
                                thickness="xsmall"
                                />
                                <Box align="center">
                                    <Box direction="row" align="center" pad={{ bottom: 'xsmall' }}>
                                        <Text size="xxlarge" weight="bold">
                                            {activeMEMALL || Math.round(totalMemory*100/clusterMemoryAll)+"%"}
                                        </Text>
                                    </Box>
                                    <Text size='xsmall'>{labelMEMALL || 'GB MEM USED'}</Text>
                                </Box>
                            </Stack>
                        </Box>
                    </Grommet>
					</Col>
                    <Col>
					<Grommet>
                        <Box  align="center" pad="medium">
                            <Stack anchor="center">
                                <Meter
									type="circle"
									round={true}
                                    values={[
                                    {
										value: Math.round(totalStorage/dataReduction*100/proposedStorage),
										color: (totalStorage/dataReduction/proposedStorage) <= storageOccupancy ? '#ad65ff' : (totalStorage/dataReduction/proposedStorage) <= 1 ? '#ffc107' : '#dc3545',
                                        onHover: over => {
                                          setActiveDiskALL(over ? (totalStorage/dataReduction).toFixed(1) : 0);
                                          setLabelDiskALL(over ? 'TB used' : undefined);
                                        },
                                    },
                                    {
										value: 100-Math.round(totalStorage/dataReduction*100/proposedStorage),
										color: '#777777',
                                        onHover: over => {
                                            setActiveDiskALL(over ? (proposedStorage-totalStorage/dataReduction).toFixed(1) : 0);
                                            setLabelDiskALL(over ? 'TB unused' : undefined);
                                        },
                                    },
                                ]}
                                max={100}
                                size="small"
                                thickness="xsmall"
                                />
                                <Box align="center">
                                    <Box direction="row" align="center" pad={{ bottom: 'xsmall' }}>
                                        <Text size="xxlarge" weight="bold">
                                            {activeDiskALL || Math.round(totalStorage/dataReduction*100/proposedStorage)+"%"}
                                        </Text>
                                    </Box>
                                    <Text size='xsmall'>{labelDiskALL || 'TB Data USED'}</Text>
                                </Box>
                            </Stack>
                        </Box>
                    </Grommet>
					</Col>
                </Row>
                <div className='mx-2'><h5>{(proposedNode-redundantNode)+" Nodes utilization ( "+redundantNode+" Nodes Down ) :"}</h5></div>  
                <Row>
                    <Col>
                    <Grommet>
                        <Box  align="center" pad="medium">
                            <Stack anchor="center">
                                <Meter
									type="circle"
									round={true}
                                    values={[
                                    {
										value: Math.round(totalCPU*100/clusterCPUDown),
										color: (totalCPU/clusterCPUDown) <= cpuOccupancy ? '#41dfb7' : (totalCPU/clusterCPUDown) <= 1 ? '#ffc107' : '#dc3545',
                                        onHover: over => {
											setActiveCPUDown(over ? (totalCPU).toFixed(1) : 0);
											setLabelCPUDown(over ? 'cores used' : undefined);
                                        },
                                    },
                                    {
										value: 100-Math.round(totalCPU*100/clusterCPUDown),
										color: '#777777',
                                        onHover: over => {
                                            setActiveCPUDown(over ? (clusterCPUDown-totalCPU).toFixed(1) : 0);
                                            setLabelCPUDown(over ? 'cores unused' : undefined);
                                        },
                                    },
                                ]}
                                max={100}
                                size="small"
                                thickness="xsmall"
                                />
                                <Box align="center">
                                    <Box direction="row" align="center" pad={{ bottom: 'xsmall' }}>
                                        <Text size="xxlarge" weight="bold">
                                            {activeCPUDown || Math.round(totalCPU*100/clusterCPUDown)+"%"}
                                        </Text>
                                    </Box>
                                    <Text size='xsmall'>{labelCPUDown || 'CPU USED'}</Text>
                                </Box>
                            </Stack>
                        </Box>
                    </Grommet>
                    </Col>
                    <Col>
					<Grommet>
                        <Box  align="center" pad="medium">
                            <Stack anchor="center">
                                <Meter
									type="circle"
									round={true}
                                    values={[
                                    {
										value: Math.round(totalMemory*100/clusterMemoryDown),
										color: (totalMemory/clusterMemoryDown) <= memoryOccupancy ? '#41dfb7' : (totalMemory/clusterMemoryDown) <= 1 ? '#ffc107' : '#dc3545',
                                        onHover: over => {
                                          setActiveMEMDown(over ? (totalMemory).toFixed(1) : 0);
                                          setLabelMEMDown(over ? 'GB used' : undefined);
                                        },
                                    },
                                    {
										value: 100-Math.round(totalMemory*100/clusterMemoryDown),
										color: '#777777',
                                        onHover: over => {
                                            setActiveMEMDown(over ? (clusterMemoryDown-totalMemory).toFixed(1) : 0);
                                            setLabelMEMDown(over ? 'GB unused' : undefined);
                                        },
                                    },
                                ]}
                                max={100}
                                size="small"
                                thickness="xsmall"
                                />
                                <Box align="center">
                                    <Box direction="row" align="center" pad={{ bottom: 'xsmall' }}>
                                        <Text size="xxlarge" weight="bold">
                                            {activeMEMDown || Math.round(totalMemory*100/clusterMemoryDown)+"%"}
                                        </Text>
                                    </Box>
                                    <Text size='xsmall'>{labelMEMDown || 'GB MEM USED'}</Text>
                                </Box>
                            </Stack>
                        </Box>
                    </Grommet>
					</Col>
                    <Col>
					<Grommet>
                        <Box  align="center" pad="medium">
                            <Stack anchor="center">
                                <Meter
									type="circle"
									round={true}
                                    values={[
                                    {
										value: Math.round(totalStorage/dataReduction*100/proposedStorage),
										color: (totalStorage/dataReduction/proposedStorage) <= storageOccupancy ? '#41dfb7' : (totalStorage/dataReduction/proposedStorage) <= 1 ? '#ffc107' : '#dc3545',
                                        onHover: over => {
                                          setActiveDiskALL(over ? (totalStorage/dataReduction).toFixed(1) : 0);
                                          setLabelDiskALL(over ? 'TB used' : undefined);
                                        },
                                    },
                                    {
										value: 100-Math.round(totalStorage/dataReduction*100/proposedStorage),
										color: '#777777',
                                        onHover: over => {
                                            setActiveDiskALL(over ? (proposedStorage-totalStorage/dataReduction).toFixed(1) : 0);
                                            setLabelDiskALL(over ? 'TB unused' : undefined);
                                        },
                                    },
                                ]}
                                max={100}
                                size="small"
                                thickness="xsmall"
                                />
                                <Box align="center">
                                    <Box direction="row" align="center" pad={{ bottom: 'xsmall' }}>
                                        <Text size="xxlarge" weight="bold">
                                            {activeDiskALL || Math.round(totalStorage/dataReduction*100/proposedStorage)+"%"}
                                        </Text>
                                    </Box>
                                    <Text size='xsmall'>{labelDiskALL || 'TB Data USED'}</Text>
                                </Box>
                            </Stack>
                        </Box>
                    </Grommet>
					</Col>
                </Row>
            </Card.Body>
			<Card.Footer>Note: These rings show your cluster utilization based on your input. If the ring turns <b className='text-warning'>YELLOW</b>, means the resource exceed your targetted utilization. If the ring turns <b className='text-danger'>RED</b>, means the resource exceed your cluster's size. </Card.Footer>
        </Card>
    );
}

export default UtilizationSummary;