/*global google*/
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {GMap} from '../../components/gmap/GMap';
import {Dialog} from '../../components/dialog/Dialog';
import {InputText} from '../../components/inputtext/InputText';
import {Button} from '../../components/button/Button';
import {Checkbox} from '../../components/checkbox/Checkbox';
import {Growl} from '../../components/growl/Growl';
import {TabView,TabPanel} from '../../components/tabview/TabView';
import {CodeHighlight} from '../codehighlight/CodeHighlight';

export class GMapDemo extends Component {
        
    constructor() {
        super();
        this.state = {
            dialogVisible: false,
            markerTitle: '',
            draggableMarker: false,
            messages: null,
            overlays: null,
            selectedPosition: null
        };
        
        this.onMapClick = this.onMapClick.bind(this);
        this.onOverlayClick = this.onOverlayClick.bind(this);
        this.handleDragEnd = this.handleDragEnd.bind(this);
        this.onMapReady = this.onMapReady.bind(this);
        this.onHide = this.onHide.bind(this);
        this.addMarker = this.addMarker.bind(this);
    }
    
    onMapClick(event) {
        this.setState({
            dialogVisible: true,
            selectedPosition: event.latLng
        });
    }
    
    onOverlayClick(event) {
        let msgs = [];
        let isMarker = event.overlay.getTitle !== undefined;
        
        if(isMarker) {
            let title = event.overlay.getTitle();
            this.infoWindow = this.infoWindow||new google.maps.InfoWindow();
            this.infoWindow.setContent('<div>' + title + '</div>');
            this.infoWindow.open(event.map, event.overlay);
            event.map.setCenter(event.overlay.getPosition());
            
            msgs.push({severity:'info', summary:'Marker Selected', detail: title});
        }
        else {
            msgs.push({severity:'info', summary:'Shape Selected', detail: ''});
        }  
        
        this.setState({
            messages: msgs
        })      
    }
    
    handleDragEnd(event) {
        this.setState({
            messages: [{severity:'info', summary:'Marker Dragged', detail: event.overlay.getTitle()}]
        })
    }
    
    addMarker() {
        let newMarker = new google.maps.Marker({
                            position: {
                                lat: this.state.selectedPosition.lat(), 
                                lng: this.state.selectedPosition.lng()
                            }, 
                            title: this.state.markerTitle, 
                            draggable: this.state.draggableMarker
                        });
                        
        this.setState({
            overlays: [...this.state.overlays, newMarker],
            dialogVisible: false,
            draggableMarker: false,
            markerTitle: ''
        });
    }
    
    onMapReady(event) {
        this.setState({
            overlays: [
                new google.maps.Marker({position: {lat: 36.879466, lng: 30.667648}, title:"Konyaalti"}),
                new google.maps.Marker({position: {lat: 36.883707, lng: 30.689216}, title:"Ataturk Park"}),
                new google.maps.Marker({position: {lat: 36.885233, lng: 30.702323}, title:"Oldtown"}),
                new google.maps.Polygon({paths: [
                    {lat: 36.9177, lng: 30.7854},{lat: 36.8851, lng: 30.7802},{lat: 36.8829, lng: 30.8111},{lat: 36.9177, lng: 30.8159}
                ], strokeOpacity: 0.5, strokeWeight: 1, fillColor: '#1976D2', fillOpacity: 0.35
                }),
                new google.maps.Circle({center: {lat: 36.90707, lng: 30.56533}, fillColor: '#1976D2', fillOpacity: 0.35, strokeWeight: 1, radius: 1500}),
                new google.maps.Polyline({path: [{lat: 36.86149, lng: 30.63743},{lat: 36.86341, lng: 30.72463}], geodesic: true, strokeColor: '#FF0000', strokeOpacity: 0.5, strokeWeight: 2})
            ]
        })
    }
    
    onHide(event) {
        this.setState({dialogVisible: false});
    }
    
    render() {
        let options = {
            center: {lat: 36.890257, lng: 30.707417},
            zoom: 12
        };
                
        let footer = <div>
            <Button label="Yes" icon="fa-check" onClick={this.addMarker} />
            <Button label="No" icon="fa-close" onClick={this.onHide} />
        </div>;
        
        return (
            <div>
                <div className="content-section introduction">
                    <div className="feature-intro">
                        <h1>GMap</h1>
                        <p>GMap component provides integration with Google Maps API. This sample demontrates
                        various uses cases like binding, overlays and events. Click the map to add a new item.</p>
                    </div>
                </div>

                <div className="content-section implementation">
                    <Growl value={this.state.messages}></Growl>
                
                    <GMap overlays={this.state.overlays} options={options} style={{width: '100%', minHeight: '320px'}} onMapReady={this.onMapReady}
                        onMapClick={this.onMapClick} onOverlayClick={this.onOverlayClick} onOverlayDragEnd={this.handleDragEnd} />
                        
                    <Dialog header="New Location" visible={this.state.dialogVisible} width="300px" modal={true} footer={footer} onHide={this.onHide}>
                        <div className="ui-g ui-fluid">
                            <div className="ui-g-2" style={{paddingTop:'.75em'}}><label htmlFor="title">Label</label></div>
                            <div className="ui-g-10"><InputText type="text" id="title" value={this.state.markerTitle} onChange={(e) => this.setState({markerTitle: e.target.value})} /></div>
                            
                            <div className="ui-g-2" style={{paddingTop:'.75em'}}>Lat</div>
                            <div className="ui-g-10"><InputText readOnly value={this.state.selectedPosition ? this.state.selectedPosition.lat() : ''} /></div>
                            
                            <div className="ui-g-2" style={{paddingTop:'.75em'}}>Lng</div>
                            <div className="ui-g-10"><InputText readOnly value={this.state.selectedPosition ? this.state.selectedPosition.lng() : ''} /></div>
                            
                            <div className="ui-g-2" style={{paddingTop:'.75em'}}><label htmlFor="drg">Drag</label></div>
                            <div className="ui-g-10"><Checkbox checked={this.state.draggableMarker} onChange={(event) => this.setState({draggableMarker: event.checked})}/></div>
                        </div>
                    </Dialog>
                </div>
                
                <GMapDoc />
            </div>
        );
    }
}


export class GMapDoc extends Component {

    shouldComponentUpdate(){
        return false;
    }
    
    render() {
        return (
            <div className="content-section source">
                <TabView>
                    <TabPanel header="Documentation">
                        <h3>Import</h3>
<CodeHighlight className="javascript">
{`
import {GMap} from 'primereact/components/gmap/GMap';

`}
</CodeHighlight>

            <h3>Getting Started</h3>
            <p>A map is initialized with options and dimensions. Refer to the google maps api for the list of available options.</p>
            
<CodeHighlight className="javascript">
{`
render() {
    let options = {
        center: {lat: 36.890257, lng: 30.707417},
        zoom: 12
    };
    
    return (
        <GMap options={options} style={{width: '100%', minHeight: '320px'}} />
    )
}

`}
</CodeHighlight>

            <h3>Overlays</h3>
            <p>GMap can display any type of overlay such as markers, polygons and circles. Overlay instances are bound using the overlays property array. Overlays are aware
            of binding so whenever the array changes, gmap updates itself.</p>
            
<CodeHighlight className="javascript">
{`
render() {
    let options = {
        center: {lat: 36.890257, lng: 30.707417},
        zoom: 12
    };
    
    let overlays = [
                new google.maps.Marker({position: {lat: 36.879466, lng: 30.667648}, title:"Konyaalti"}),
                new google.maps.Marker({position: {lat: 36.883707, lng: 30.689216}, title:"Ataturk Park"}),
                new google.maps.Marker({position: {lat: 36.885233, lng: 30.702323}, title:"Oldtown"}),
                new google.maps.Polygon({paths: [
                    {lat: 36.9177, lng: 30.7854},{lat: 36.8851, lng: 30.7802},{lat: 36.8829, lng: 30.8111},{lat: 36.9177, lng: 30.8159}
                ], strokeOpacity: 0.5, strokeWeight: 1, fillColor: '#1976D2', fillOpacity: 0.35
                }),
                new google.maps.Circle({center: {lat: 36.90707, lng: 30.56533}, fillColor: '#1976D2', fillOpacity: 0.35, strokeWeight: 1, radius: 1500}),
                new google.maps.Polyline({path: [{lat: 36.86149, lng: 30.63743},{lat: 36.86341, lng: 30.72463}], geodesic: true, strokeColor: '#FF0000', strokeOpacity: 0.5, strokeWeight: 2})
            ]
    
    return (
        <GMap overlays={overlays} options={options} style={{width: '100%', minHeight: '320px'}} />
    )
}

`}
</CodeHighlight>

            <h3>Events</h3>
            <p>GMap provides common callbacks to hook into events including map click, overlay click and overlay dragging.</p>
<CodeHighlight className="javascript">
{`
    
constructor() {
    super();
    this.onMapReady = this.onMapReady.bind(this);
    this.onMapClick = this.onMapClick.bind(this);
}

onMapClick(event) {
    //event: MouseEvent of Google Maps api
}

onMapReady(map) {
    //map: Map instance
}
    
render() {
    let options = {
        center: {lat: 36.890257, lng: 30.707417},
        zoom: 12
    };
    
    let overlays = [
                new google.maps.Marker({position: {lat: 36.879466, lng: 30.667648}, title:"Konyaalti"}),
                new google.maps.Marker({position: {lat: 36.883707, lng: 30.689216}, title:"Ataturk Park"}),
                new google.maps.Marker({position: {lat: 36.885233, lng: 30.702323}, title:"Oldtown"}),
                new google.maps.Polygon({paths: [
                    {lat: 36.9177, lng: 30.7854},{lat: 36.8851, lng: 30.7802},{lat: 36.8829, lng: 30.8111},{lat: 36.9177, lng: 30.8159}
                ], strokeOpacity: 0.5, strokeWeight: 1, fillColor: '#1976D2', fillOpacity: 0.35
                }),
                new google.maps.Circle({center: {lat: 36.90707, lng: 30.56533}, fillColor: '#1976D2', fillOpacity: 0.35, strokeWeight: 1, radius: 1500}),
                new google.maps.Polyline({path: [{lat: 36.86149, lng: 30.63743},{lat: 36.86341, lng: 30.72463}], geodesic: true, strokeColor: '#FF0000', strokeOpacity: 0.5, strokeWeight: 2})
            ]
    
    return (
        <GMap overlays={overlays} options={options} style={{width: '100%', minHeight: '320px'}} onMapReady={this.onMapReady} onMapClick={this.onMapClick} />
    )
}

`}
</CodeHighlight>

            <h3>Google Maps API</h3>
            <p>In case you need to access the map instance directly, use the getMap() method. In the following example, this.gmap.getMap() will provide the map instance. Alternative
            is using onMapReady event as it passes the map instance as a parameter.</p>
            
<CodeHighlight className="javascript">
{`
render() {
    let options = {
        center: {lat: 36.890257, lng: 30.707417},
        zoom: 12
    };
    
    return (
        <GMap ref={(el) => {this.gmap = el;}} options={options} style={{width: '100%', minHeight: '320px'}} />
    )
}

`}
</CodeHighlight>            
            

            <h3>Attributes</h3>
            <div className="doc-tablewrapper">
                <table className="doc-table">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Default</th>
                        <th>Description</th>
                    </tr>
                    </thead>
                        <tbody>
                        <tr>
                            <td>options</td>
                            <td>object</td>
                            <td>null</td>
                            <td>Google Maps API configuration object.</td>
                        </tr>
                        <tr>
                            <td>overlays</td>
                            <td>array</td>
                            <td>null</td>
                            <td>An array of overlays to display.</td>
                        </tr>
                        <tr>
                            <td>style</td>
                            <td>string</td>
                            <td>null</td>
                            <td>Inline style of the component.</td>
                        </tr>
                        <tr>
                            <td>className</td>
                            <td>string</td>
                            <td>null</td>
                            <td>Style class of the component.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3>Events</h3>
            <div className="doc-tablewrapper">
                <table className="doc-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Parameters</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>onMapClick</td>
                            <td>event: Google Maps MouseEvent</td>
                            <td>Callback to invoke when map is clicked except markers.</td>
                        </tr>
                        <tr>
                            <td>onMapDragEnd</td>
                            <td>originalEvent: Google Maps dragend</td>
                            <td>Callback to invoke when map drag (i.e. pan) has ended.</td>
                        </tr>
                        <tr>
                            <td>onMapReady</td>
                            <td>event.map: Google Maps Instance</td>
                            <td>Callback to invoke when the map is ready to be used.</td>
                        </tr>
                        <tr>
                            <td>onOverlayClick</td>
                            <td>originalEvent: Google Maps MouseEvent <br />
                                overlay: Clicked overlay <br />
                                map: Map instance <br /></td>
                            <td>Callback to invoke when an overlay is clicked.</td>
                        </tr>
                        <tr>
                            <td>onOverlayDrag</td>
                            <td>originalEvent: Google Maps MouseEvent <br />
                                overlay: Clicked overlay <br />
                                map: Map instance <br /></td>
                            <td>Callback to invoke when an overlay is being dragged.</td>
                        </tr>
                        <tr>
                            <td>onOverlayDragEnd</td>
                            <td>originalEvent: Google Maps MouseEvent <br />
                                overlay: Clicked overlay <br />
                                map: Map instance <br /></td>
                            <td>Callback to invoke when an overlay drag ends.</td>
                        </tr>
                        <tr>
                            <td>onOverlayDragStart</td>
                            <td>originalEvent: Google Maps MouseEvent <br />
                                overlay: Clicked overlay <br />
                                map: Map instance <br /></td>
                            <td>Callback to invoke when an overlay drag starts.</td>
                        </tr>
                        <tr>
                            <td>onZoomChanged</td>
                            <td>originalEvent: Google Maps zoom_changed</td>
                            <td>Callback to invoke when zoom level has changed.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3>Styling</h3>
            <p>Following is the list of structural style classes, for theming classes visit <Link to="/theming"> theming</Link> page.</p>
            <div className="doc-tablewrapper">
                <table className="doc-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Element</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>ui-fieldset</td>
                            <td>Fieldset element.</td>
                        </tr>
                        <tr>
                            <td>ui-fieldset-toggleable</td>
                            <td>Toggleable fieldset element.</td>
                        </tr>
                        <tr>
                            <td>ui-fieldset-legend</td>
                            <td>Legend element.</td>
                        </tr>
                        <tr>
                            <td>ui-fieldset-content</td>
                            <td>Content element.</td>
                        </tr>
                    </tbody>
                </table>

                <h3>Dependencies</h3>
                <p>Google Maps API as a script tag at index page.</p>
            </div>
            
            </TabPanel>

            <TabPanel header="Source">
                <a href="https://github.com/primefaces/primereact/tree/master/src/showcase/gmap" className="btn-viewsource" target="_blank">
                    <i className="fa fa-github"></i>
                    <span>View on GitHub</span>
                </a>
<CodeHighlight className="javascript">
{`
/*global google*/
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {GMap} from 'primereact/components/gmap/GMap';
import {Dialog} from 'primereact/components/dialog/Dialog';
import {InputText} from 'primereact/components/inputtext/InputText';
import {Button} from 'primereact/components/button/Button';
import {Checkbox} from 'primereact/components/checkbox/Checkbox';
import {Growl} from 'primereact/components/growl/Growl';

export class GMapDemo extends Component {
        
    constructor() {
        super();
        this.state = {
            dialogVisible: false,
            markerTitle: '',
            draggableMarker: false,
            messages: null,
            overlays: null,
            selectedPosition: null
        };
        
        this.onMapClick = this.onMapClick.bind(this);
        this.onOverlayClick = this.onOverlayClick.bind(this);
        this.handleDragEnd = this.handleDragEnd.bind(this);
        this.onMapReady = this.onMapReady.bind(this);
        this.onHide = this.onHide.bind(this);
        this.addMarker = this.addMarker.bind(this);
    }
    
    onMapClick(event) {
        this.setState({
            dialogVisible: true,
            selectedPosition: event.latLng
        });
    }
    
    onOverlayClick(event) {
        let msgs = [];
        let isMarker = event.overlay.getTitle !== undefined;
        
        if(isMarker) {
            let title = event.overlay.getTitle();
            this.infoWindow = this.infoWindow||new google.maps.InfoWindow();
            this.infoWindow.setContent('<div>' + title + '</div>');
            this.infoWindow.open(event.map, event.overlay);
            event.map.setCenter(event.overlay.getPosition());
            
            msgs.push({severity:'info', summary:'Marker Selected', detail: title});
        }
        else {
            msgs.push({severity:'info', summary:'Shape Selected', detail: ''});
        }  
        
        this.setState({
            messages: msgs
        })      
    }
    
    handleDragEnd(event) {
        this.setState({
            messages: [{severity:'info', summary:'Marker Dragged', detail: event.overlay.getTitle()}]
        })
    }
    
    addMarker() {
        let newMarker = new google.maps.Marker({
                            position: {
                                lat: this.state.selectedPosition.lat(), 
                                lng: this.state.selectedPosition.lng()
                            }, 
                            title: this.state.markerTitle, 
                            draggable: this.state.draggableMarker
                        });
                        
        this.setState({
            overlays: [...this.state.overlays, newMarker],
            dialogVisible: false,
            draggableMarker: false,
            markerTitle: ''
        });
    }
    
    onMapReady(event) {
        this.setState({
            overlays: [
                new google.maps.Marker({position: {lat: 36.879466, lng: 30.667648}, title:"Konyaalti"}),
                new google.maps.Marker({position: {lat: 36.883707, lng: 30.689216}, title:"Ataturk Park"}),
                new google.maps.Marker({position: {lat: 36.885233, lng: 30.702323}, title:"Oldtown"}),
                new google.maps.Polygon({paths: [
                    {lat: 36.9177, lng: 30.7854},{lat: 36.8851, lng: 30.7802},{lat: 36.8829, lng: 30.8111},{lat: 36.9177, lng: 30.8159}
                ], strokeOpacity: 0.5, strokeWeight: 1, fillColor: '#1976D2', fillOpacity: 0.35
                }),
                new google.maps.Circle({center: {lat: 36.90707, lng: 30.56533}, fillColor: '#1976D2', fillOpacity: 0.35, strokeWeight: 1, radius: 1500}),
                new google.maps.Polyline({path: [{lat: 36.86149, lng: 30.63743},{lat: 36.86341, lng: 30.72463}], geodesic: true, strokeColor: '#FF0000', strokeOpacity: 0.5, strokeWeight: 2})
            ]
        })
    }
    
    onHide(event) {
        this.setState({dialogVisible: false});
    }
    
    render() {
        let options = {
            center: {lat: 36.890257, lng: 30.707417},
            zoom: 12
        };
                
        let footer = <div>
            <Button label="Yes" icon="fa-check" onClick={this.addMarker} />
            <Button label="No" icon="fa-close" onClick={this.onHide} />
        </div>;
        
        return (
            <div>
                <div className="content-section introduction">
                    <div className="feature-intro">
                        <h1>GMap</h1>
                        <p>GMap component provides integration with Google Maps API. This sample demontrates
                        various uses cases like binding, overlays and events. Click the map to add a new item.</p>
                    </div>
                </div>

                <div className="content-section implementation">
                    <Growl value={this.state.messages}></Growl>
                
                    <GMap overlays={this.state.overlays} options={options} style={{width: '100%', minHeight: '320px'}} onMapReady={this.onMapReady}
                        onMapClick={this.onMapClick} onOverlayClick={this.onOverlayClick} onOverlayDragEnd={this.handleDragEnd} />
                        
                    <Dialog header="New Location" visible={this.state.dialogVisible} width="300px" modal={true} footer={footer} onHide={this.onHide}>
                        <div className="ui-g ui-fluid">
                            <div className="ui-g-2" style={{paddingTop:'.75em'}}><label htmlFor="title">Label</label></div>
                            <div className="ui-g-10"><InputText type="text" id="title" value={this.state.markerTitle} onChange={(e) => this.setState({markerTitle: e.target.value})} /></div>
                            
                            <div className="ui-g-2" style={{paddingTop:'.75em'}}>Lat</div>
                            <div className="ui-g-10"><InputText readOnly value={this.state.selectedPosition ? this.state.selectedPosition.lat() : ''} /></div>
                            
                            <div className="ui-g-2" style={{paddingTop:'.75em'}}>Lng</div>
                            <div className="ui-g-10"><InputText readOnly value={this.state.selectedPosition ? this.state.selectedPosition.lng() : ''} /></div>
                            
                            <div className="ui-g-2" style={{paddingTop:'.75em'}}><label htmlFor="drg">Drag</label></div>
                            <div className="ui-g-10"><Checkbox checked={this.state.draggableMarker} onChange={(event) => this.setState({draggableMarker: event.checked})}/></div>
                        </div>
                    </Dialog>
                </div>
            </div>
        );
    }
}

`}
</CodeHighlight>
                    </TabPanel>
                </TabView>
            </div>
        );
    }
}