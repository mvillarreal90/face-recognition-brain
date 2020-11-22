import React, { Component } from 'react';
import Particles from 'react-particles-js';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';

const particlesOptions = {
	particles: {
	  number: {
	  	value: 50,
	  	density: {
	  		enable: true,
	  		value_area: 800
	  	}
	  }
	}  					            				
}

const initialState = {
	input: '',
	imageUrl: '',
	boxes: [],
	route: 'signIn',
	isSignedIn: false,
	user: {
		id: '',
		name: '',
		email: '',
		entries: 0,
		joined: ''
	}
}

class App extends Component {
	constructor () {
		super()
		this.state = initialState;
	}

	loadUser = (data) => {
		this.setState({user: {
			id: data.id,
			name: data.name,
			email: data.email,
			entries: data.entries,
			joined: data.joined
		}})
	}

	calculateFaceLocation = (data) => {
		const image = document.getElementById('inputImage');
		const width = Number(image.width);
		const height = Number(image.height);
		const regions = data.outputs[0].data.regions;
		return regions.map(region => {
			const clarifaiFace = region.region_info.bounding_box;
			return {
				leftCol: clarifaiFace.left_col * width,
				topRow: clarifaiFace.top_row * height,
				rightCol: width - (clarifaiFace.right_col * width),
				bottomRow: height - (clarifaiFace.bottom_row * height)
			}
		});
	}

	displayBoxes = (boxes) => {
		this.setState({boxes: boxes});
	}

	onInputChange = (event) => {
		this.setState({input: event.target.value});
	}

	onPictureSubmit = () => {
		this.setState({imageUrl: this.state.input});
		fetch('http://localhost:3000/imageurl', {
			method: 'post',
			headers: {'Content-type': 'application/json'},
			body: JSON.stringify({
				input: this.state.input
			})
		})
		.then(response => response.json())
		.then(response => {
			if (response) {
				fetch('http://localhost:3000/image', {
					method: 'put',
					headers: {'Content-type': 'application/json'},
					body: JSON.stringify({
						id: this.state.user.id
					})
				})
				.then(response => response.json())
				.then(count => {
					this.setState(Object.assign(this.state.user, {entries: count}));
				})
				.catch((err) => console.log(err));
				this.displayBoxes(this.calculateFaceLocation(response));
			}
		})
		.catch((err) => console.log(err));	
	}

	onRouteChange = (route) => {
		if (route === 'signOut') {
			this.setState(initialState);
		} else if (route === 'home') {
			this.setState({isSignedIn: true});
		}
		this.setState({route: route});
	}

  render() {
  	const { imageUrl, boxes, route, isSignedIn, user } = this.state;
    return (
      <div className='App'>
      	<Particles className='particles' params={particlesOptions} />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn}/>
        { route === 'home' ?
        		<div>
		      		<Logo />
			        <Rank name={user.name} entries={user.entries}/>
			        <ImageLinkForm 
			        	onInputChange={this.onInputChange}
			        	onPictureSubmit={this.onPictureSubmit}
			        />
			        <FaceRecognition boxes={boxes} imageUrl={imageUrl}/>
			       </div>
			    : (route === 'signIn' ?
			      	<SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
			      : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
		      	)
        }
       </div>
    )
  }
}

export default App;