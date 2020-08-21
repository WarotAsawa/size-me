import React, {useState} from 'react';
import { Formik, Field, Form, ErrorMessage, FieldArray } from "formik";
import { Row, Col, Button, Card } from 'react-bootstrap';

import * as Yup from 'yup';

import VMSummary from './VMSummary';
import UtilizationSummary from './UtilizationSummary';
import { DownloadString } from './DownloadString';
import { EncryptObject, DecryptObject } from './Crypto';

import intelDatabase from './intel.json';

var initialValues =	{
	proposedNode:"4",
	redundantNode:"1",
	proposedStorage: "50",
	cpuOccupancy:"70",
	memoryOccupancy:"70",
	storageOccupancy:"70",
	socket:"2",
	cpuSpec:"6242",
	dimmSize:"64",
	dimmSlot:"12",
	dataReduction:"2",
	v2p:"2",
	workloads: [{name: 'new-workload', vcpu: '112', vmemory: '1024', vdisk: '50'}, {name: 'growth', vcpu: '16', vmemory: '64', vdisk: '5'}],
	selectedCPUSpec:intelDatabase.find(db => {return db.model === "6242"})
};

function VMSizerForm() {
	const [app, setApp] = useState(initialValues);
	const [dataFile, setDataFile] = useState(initialValues);
	const [loadFileError, setLoadFileError] = useState(false);
	//YUP Error Checking
	let ApplicationSpecSchema = Yup.object().shape({
		proposedStorage: Yup.number()
		.min(0, 'Please input more than 0 !')
		.max(100000, 'Please input less than 100000 !')
		.required('Proposed Storage number Required'),
		dataReduction: Yup.number()
		.min(1, 'Please input at least 1 !')
		.max(10, 'Please input less than 10 !')
		.required('Data Reduction number Required'),
		v2p: Yup.number().integer()
		.min(1, 'Please input at least 1 !')
		.max(10, 'Please input less than 10 !')
		.required('V:P Required'),
		proposedNode: Yup.number().integer()
		.min(1, 'Please input at least 1 !')
		.max(1000, 'Please input less than 1000 !')
		.required('Proposed Node number Required'),
		redundantNode: Yup.number().integer()
		.min(0, 'Please input at least 0 or more !')
		.max(app.proposedNode-1, 'Please input less than Proposed Node-1 !')
		.required('Redundant Node number Required'),
		cpuOccupancy: Yup.number()
		.min(20, 'Please input at least 20 !')
		.max(100, 'Please input less than 100 !')
		.required('CPU Utimization Required'),
		memoryOccupancy: Yup.number()
		.min(20, 'Please input at least 20 !')
		.max(100, 'Please input less than 100 !')
		.required('CPU Utimization Required'),
		storageOccupancy: Yup.number()
		.min(20, 'Please input at least 20 !')
		.max(100, 'Please input less than 100 !')
		.required('CPU Utimization Required'),
		dimmSlot: Yup.number().integer()
		.min(1, 'Please input at least 1 !')
		.max(app.socket*12, 'Please input less 12*Sockets !')
		.required('CPU Utimization Required'),
		workloads: Yup.array().of(Yup.object().shape({
			name: Yup.string()
			.min(1, 'Too Short !')
			.max(100, 'Too Long !')
			.required('Workload Name Required'),
			vcpu: Yup.number().integer()
			.min(0, 'Must be positive number')
			.required('vCPU Required'),
			vmemory: Yup.number().integer()
			.min(0, 'Must be positive number')
			.required('vMemory Required'),
			vdisk: Yup.number()
			.min(0, 'Must be positive number')
			.required('vDisk Required'),
		})),
	}); 
	
	return (
		<div className='col'>
			<UtilizationSummary app={app}></UtilizationSummary>
			<VMSummary app={app}>{" "}</VMSummary>
			<Formik
				enableReinitialize='true'
				initialValues={initialValues}
				validationSchema={ApplicationSpecSchema}
				onSubmit={async values => {
					values.selectedCPUSpec = intelDatabase.find(db => {return db.model === values.cpuSpec});
					await new Promise(r => setTimeout(r, 500));
					setApp(values);
				}}
			>
			{({ values, handleChange , resetForm}) => (
				<Form inline="true">
					{/* Header */}
					<Row className="my-2 d-flex justify-content-between">
						<h1 className='my-auto'>Workload Input</h1>
						<button type="submit" className="btn btn-secondary my-1">SIZE ME !</button>
					</Row>
					{/* Workload List Block */}
					<FieldArray name="workloads">
						{({ insert, remove, push }) => (
							<div>
								<Row className='my-2'>
									<div className='my-auto'><h3>Workload List:</h3></div>
									<div className='mx-2 my-auto'>
										<button
											type="button"
											className="btn btn-primary float-right"
											onClick={() => push({name: 'new-workload', vcpu: '16', vmemory: '128', vdisk: '5'})}
										>
											+ Add More Workload
										</button>
									</div>
								</Row>
								<Row className='my-1'>
									<div className="col-4"><h5>Workload Name:</h5></div>
									<div className="col-2"><h5>vCPU:</h5></div>
									<div className="col-3"><h5>vMemory (GB):</h5></div>
									<div className="col-2"><h5>vDisk (TB):</h5></div>
									<div className="col-1"></div>
								</Row>
								{values.workloads.length > 0 &&
								values.workloads.map((workload, index) => (
									<div className='row my-1' key={index}>
										<div className="col-4 my-auto">
											<Field className="w-100" name={`workloads.${index}.name`}/>
											<Row className='text-danger'><ErrorMessage name={`workloads.${index}.name`}/></Row>
										</div>
										<div className="col-2 my-auto">
											<Field className="w-75" name={`workloads.${index}.vcpu`}/>
											<span style={{"whiteSpace": "pre"}}> Core</span>
											<Row className='text-danger'><ErrorMessage name={`workloads.${index}.vcpu`}/></Row>
										</div>
										<div className="col-3 my-auto">
											<Field className="w-75" name={`workloads.${index}.vmemory`}/>
											<span style={{"whiteSpace": "pre"}}> GB</span>
											<Row className='text-danger'><ErrorMessage name={`workloads.${index}.vmemory`}/></Row>
										</div>
										<div className="col-2 my-auto">
											<Field className="w-75" name={`workloads.${index}.vdisk`}/>
											<span style={{"whiteSpace": "pre"}}> TB</span>
											<Row className='text-danger'><ErrorMessage name={`workloads.${index}.vdisk`}/></Row>
										</div>
										<div className="col-1 my-auto">
											<button
												type="button"
												className="btn btn-danger"
												onClick={() => remove(index)}
											>
												X
											</button>
										</div>
									</div>
								))}
								<div className='row my-3'>
									<h5 className="col-4 my-auto text-right font-weight-bold">Totol Resouces:</h5>
									<h5 className="col-2 my-auto text-info my-auto font-weight-bold">{values.workloads.reduce((a,b) => (a+parseInt(b['vcpu'])),0) + '   vCPU'}</h5>
									<h5 className="col-3 my-auto text-info my-auto font-weight-bold">{values.workloads.reduce((a,b) => (a+parseInt(b['vmemory'])),0) + '   GB'}</h5>
									<h5 className="col-3 my-auto text-info my-auto font-weight-bold">{values.workloads.reduce((a,b) => (a+parseFloat(b['vdisk'])),0) + '   TB'}</h5>
									<div className="col-1 my-auto"></div>
								</div>
							</div>
						)}
					</FieldArray>
					<div className='row my-3'><h3 className='my-auto'>Cluster Configuration:</h3></div>
					<Row>
						<Col className='mx-2'>
							<div className='text-primary row my-auto' style={{fontWeight:'900'}}><h4>Cluster's Size:</h4></div>
							<Row className='my-1'>
								<h5 className='w-75 my-auto'>Proposed Nodes:</h5><Field className='w-25' name="proposedNode" type='number'/>
							</Row>
							<Row className='text-danger'><ErrorMessage name="proposedNode"/></Row>
							<Row className='my-1'>
								<h5 className='w-75 my-auto'>Node Failure Tolerant:</h5><Field className='w-25' name="redundantNode" type='number'/>
							</Row>
							<Row className='text-danger'><ErrorMessage name="redundantNode"/></Row>
							<Row className='my-1'>
								<h5 className='w-75 my-auto'>Cluster Storage (TB):</h5><Field className='w-25' name="proposedStorage" type='number'/>
							</Row>
							<Row className='text-danger'><ErrorMessage name="proposedStorage"/></Row>
							<Row className='my-1'>
								<h5 className='w-75 my-auto'>Targetted CPU Utilization (%):</h5><Field className='w-25' name="cpuOccupancy" type='number'/>
							</Row>
							<Row className='text-danger'><ErrorMessage name="cpuOccupancy"/></Row>
							<Row className='my-1'>
								<h5 className='w-75 my-auto'>Targetted Memory Utilization (%):</h5><Field className='w-25' name="memoryOccupancy" type='number'/>
							</Row>
							<Row className='text-danger'><ErrorMessage name="memoryOccupancy"/></Row>
							<Row className='my-1'>
								<h5 className='w-75 my-auto'>Targetted Storage Utilization (%):</h5><Field className='w-25' name="storageOccupancy" type='number'/>
							</Row>
							<Row className='text-danger'><ErrorMessage name="storageOccupancy"/></Row>
						</Col>
						<Col className='mx-2'>
							<div className='text-secondary row my-auto' style={{fontWeight:'900'}}><h4>Node's Specification:</h4></div>
							<Row className='my-1'>
								<h5 className='w-75 my-auto'>Virtual to Physical Ratio (Ex: Input 2 as 2:1): </h5><Field className='w-25' name="v2p" type='number'/>
								<Row className='text-danger'><ErrorMessage name="v2p"/></Row>
							</Row>
							<Row className='my-1'>
								<h5 className='w-75 my-auto'>Number of Socket:</h5>
								<select
									name="socket"
									value = {values.socket}
									className='w-25 my-auto'
									onChange={handleChange}
    								style={{ display: 'block', padding:'5px 1px'}}
    							>
    								<option style={{fontWeight:'900'}} value="1" label="1 Sockets" />
									<option style={{fontWeight:'900'}} value="2" label="2 Sockets" />
    								<option style={{fontWeight:'900'}} value="4" label="4 Sockets" />
									<option style={{fontWeight:'900'}} value="8" label="8 Sockets" />
									<option style={{fontWeight:'900'}} value="16" label="16 Sockets" />
									<option style={{fontWeight:'900'}} value="32" label="32 Sockets" />
								</select>
							</Row>
							<Row className='my-1'>
								<h5 className='w-25 my-auto'>CPU Model:</h5>
								<select
									name="cpuSpec"
									value = {values.cpuSpec}
									className='w-75 my-auto'
									style={{ display: 'block' , padding:'5px 1px'}}
									onChange={handleChange}
    							>
									{intelDatabase.map((cpu, index) => (
										<option style={{fontWeight:'900'}} value={cpu.model} label={cpu.description} key={index} />
									))}
								</select>
							</Row>
							<Row className='my-1'>
								<h5 className='w-75 my-auto'>DIMM Size:</h5>
								<select
									name="dimmSize"
									value = {values.dimmSize}
									className='w-25 my-auto'
									style={{ display: 'block', padding:'5px 1px'}}
									onChange={handleChange}
    							>
    								<option style={{fontWeight:'900'}} value="4" label="4 GB" />
									<option style={{fontWeight:'900'}} value="8" label="8 GB" />
									<option style={{fontWeight:'900'}} value="16" label="16 GB" />
									<option style={{fontWeight:'900'}} value="32" label="32 GB" />
									<option style={{fontWeight:'900'}} value="64" label="64 GB" />
									<option style={{fontWeight:'900'}} value="128" label="128 GB" />
								</select>
							</Row>
							<Row className='my-1'>
								<h5 className='w-75 my-auto'>DIMM Slots (Must be between 1 to 12*Sockets):</h5><Field className='w-25' name="dimmSlot" type='number'/>
								<Row className='text-danger'><ErrorMessage name="dimmSlot"/></Row>
							</Row>
							<Row className='my-1'>
								<h5 className='w-75 my-auto'>Data Reduction Ratio (Ex: Input 2 as 2:1):</h5><Field className='w-25' name="dataReduction" type='number'/>
								<Row className='text-danger'><ErrorMessage name="dataReduction"/></Row>
							</Row>
						</Col>
					</Row>
					<Row><button type="submit" className="btn btn-secondary my-1">SIZE ME !</button></Row>
					<Card className='w-50 mt-3'>
					<Card.Header className='bg-secondary text-dark'><h3 style={{fontWeight:'900'}}>SAVE / LOAD SIZING</h3></Card.Header>
					<Card.Body>
					<Row className='my-2'>
						<b className='my-auto mx-2'>SAVE SIZING:	</b>
					<Button className = 'px-1 mx-2' variant='primary' onClick={() => {DownloadString(EncryptObject(values, 's!ze-me-!q2w3e4r'),"text","vm-sizing.sav")}} >SAVE AS FILE</Button>
					</Row>
					<Row className='my-2'>
						<b className='my-auto col-3'>LOAD SIZING:	</b>
						<input type="file"  className="my-auto col-5" onChange={(event) => { 
							let file = event.currentTarget.files[0]
							let reader = new FileReader();
							reader.onload = function(event) {
								// The file's text will be printed here
								let result = event.target.result;
								setDataFile(result);
								//console.log(result);
							};
							try { let text = reader.readAsText(file);} 
							catch(err)  { console.log("Read File Error");}

                  		}}/>
						<Button 
						className = 'px-1 col-2' 
						variant='primary' 
						onClick={() => {
							//console.log(dataFile);	
							let data = DecryptObject(dataFile, 's!ze-me-!q2w3e4r');
							if ('workloads' in data) {
								resetForm({values: data});
								setApp(data);
								setLoadFileError(false);
							} else {
								setLoadFileError(true);
							}
						}} >LOAD NOW !</Button>
					</Row>
					<Row>
					<b className='text-danger mx-2'>{(loadFileError ? "Cannot Load Save File" : "")}</b>
					</Row>
					</Card.Body>
					<Card.Footer className='bg-secondary'></Card.Footer>
					</Card>
				</Form>
			)}
			</Formik>
		</div>
	);
}

export default VMSizerForm;