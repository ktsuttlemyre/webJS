window.web = window.web || {};
web.video = function WebVideo(stage, url, options) {
	url = (url||'').trim()
	options = options || {}
	stage = document.getElementById(stage.id||stage)||stage;
	
	let wrapper = document.createElement('div')
	wrapper.style.position='relative';
	stage.appendChild(wrapper)
	
	let controls;
	if(options.controls){
		let ctrls = document.getElementById(options.controls.id||options.controls) || options.controls
		if(ctrls){
			wrapper.innerHTML += ctrls.innerHTML
			controls = wrapper.firstElementChild;
		}
	}
	
		//TODO accept other inputs using this 
	//https://stackoverflow.com/questions/1186414/whats-the-algorithm-to-calculate-aspect-ratio
	/*
	aspect ratio = padding-bottom/top
		16:9 = 56.25%
		4:3 = 75%
		3:2 = 66.66%
		8:5 = 62.5%
	*/
	let aspectRatios = {
		'16:9':'56.25%',
		'4:3':'75%',
		'3:2':'66.66%',
		'8:5':'62.5%',
	}
	
	let padding=''
	let aspect = options.aspectRatio;
	if(options.aspectRatio){
		padding = "56.25%"
		let type = typeof options.aspectRatio
		if(type=='string'){
			if(aspect.split(':').length ==2){
				padding = aspectRatios[options.aspectRatio]
			}
		}else if(type == 'object'){
			padding = ((aspect.width||aspect[0])/(aspect.height||aspect[1])) * 100
		}
	}
	

	let container = document.createElement('div');
	//container.className="player-wrapper"
	aspect && (container.style.position='relative');
	container.style.paddingTop=padding /* Player ratio: 100 / (1280 / 720) */
	container.style.width='100%';
	container.style.height='100%';
	if(!controls){
		wrapper.appendChild(container)
	}else{
		wrapper.insertBefore(container,controls)
	    controls.addEventListener("click", function (event) {
	            var element = event.target || event.srcElement;
	        		exeControl(element.name || element.id , element.value || element.text || element.innerHTML);
	    });


	   	wrapper.addEventListener("mouseenter", function (event) {
			controls.style.display='table'
		})
		wrapper.addEventListener("mouseleave", function (event) {
			controls.style.display='none'
		})
	}
	

	let defaultSettings={
			url:'',					//The url of a video or song to play
									//  Can be an array or MediaStream object	
			playing:false,			//	Set to true or false to pause or play the media	false
			loop:true,				//Set to true or false to loop the media	false
			controls:true,			//Set to true or false to display native player controls.
									//  For Vimeo videos, hiding controls must be enabled by the video owner.	false
			light:false,			//Set to true to show just the video thumbnail, which loads the full player on click
		    						//Pass in an image URL to override the preview image	false
			volume:.80,				//Set the volume of the player, between 0 and 1
		    						//null uses default volume on all players #357	null
			muted: false,			//Mutes the player
		    						//Only works if volume is set	false
			playbackRate:1,			//Set the playback rate of the player
									//Only supported by YouTube, Wistia, and file paths	1
		//	width:640,				//Set the width of the player	640px
		//	height:360,				//Set the height of the player	360px
			style:"",				//Add inline styles to the root element	{}
			progressInterval:1000,	//The time between onProgress callbacks, in milliseconds	1000
			playsinline:false,		//Applies the playsinline attribute where supported	false
			pip:true,				//Set to true or false to enable or disable picture-in-picture mode
		    						//Only available when playing file URLs in certain browsers	false
			stopOnUnmount:false,	//If you are using pip you may want to use stopOnUnmount={false} to continue
									//playing in picture-in-picture mode even after ReactPlayer unmounts	true
			fallback:null,			//Element or component to use as a fallback if you are using lazy loading	null
			//wrapper:'',			//Element or component to use as the container element	div
			//playIcon:'',				//Element or component to use as the play icon in light mode	
			//previewTabIndex:0,		//Set the tab index to be used on light mode	0
			//config:'',					//Override options for the various players, see config prop
		}
		//override settings with args	
	
	defaultSettings = _.defaults({},options,defaultSettings)
	defaultSettings.config=defaultSettings.config || {}


	//support twitch collections
	url=(function(url,config){
		//this finds twitch collections
		//https://www.twitch.tv/collections/6JzzgA5goxYedw?filter=collections

		let test = 'twitch.tv/collections/'
		let index = url.indexOf(test);
		if(index>=0){
			let collection = url.substring(index+test.length).split(/[?#]/)[0]
			config.twitch = {
				options:{
					video: '',
					channel: '',
					//playsinline: playsinline,
					//autoplay: this.props.playing,
					//muted: this.props.muted,
					// https://github.com/CookPete/react-player/issues/733#issuecomment-549085859
					//controls: isChannel ? true : controls,
					collection: collection,
					// only needed if your site is also embedded on embed.example.com and othersite.example.com 
					//parent: ["shipwa.sh"],
				}
				//playerid but we dont care
			}

			//we must send back a url that satisfies the triggers of the library but loads our collection
			return 'https://twitch.tv/shipwash'  //todo figure out a better way to fix the loading
		}
		return url
	})(url||'',defaultSettings.config)

	//convert https://youtu.be/IDENTIFER to https://youtube.com/watchv=IDENTIFER	
	url=(function(url,config){
		//test data https://youtu.be/answer?variable=QQQ#session=YUDIFY'.match(/^((https?:)?\/\/)?youtu\.be\/(.*)/)[3]
		let find = (url||'').match(/^((https?:)?\/\/)?youtu\.be\/(.*)/)
		if(find && find[3]){
			return 'https://www.youtube.com/watch?v='+find[3]
		}
		return url
	})(url||'',defaultSettings.config)

	/* //use this to set up a private scope to manipulate data
	url=(function(url,config){
	})(url||'',defaultSettings.config)
	*/
	



//   let commands = {
//   	'STOP':() => {
//   		renderState({ url: null, playing: false, played: 0, loaded:0, /*pip:false*/})
//   	},
//   	'PLAY':(args) => {
//   		let url = ''
//   		if(args){
//   			return commands['ADD'](args)
// 	  	}
//   		renderState({ playing: true})
//   	},
//   	'PAUSE':() => {
//   		renderState({ playing: false})
//   	},
//   	'PLAYPAUSE':() => {
//   		renderState({playing: !currentSettings.playing })
//   	},
//   	'SPEED':(args) => {
//   		renderState({ playbackRate: parseFloat(args[0]) })
//   	},
//   	'VOLUME':(args) => {
//   		renderState({ volume: parseFloat(args[0]) })
//   	},
//   	'SEEK':(args) => {
//   		console.log(args)
//   		console.log('seeking to: ', parseFloat(args[0]))
//   		renderState({ played: parseFloat(args[0]) })
//   	},
//   	'LOOP':(args) => {
//   		renderState({ loop: !currentSettings.loop })
//   	},
//   	'MUTE':(args) => {
//   		renderState({ muted: !currentSettings.muted })
//   	},
//   	'PIP':(args) => {
//   		renderState({ pip: !currentSettings.pip })
//   	},
//   	'LOAD':(args) => {
//   		renderState({url:args, playing:true})
//   	},
//   	'ADD':(args) => {
// 	  		if(Array.isArray(args)){
// 	  			if(args.length==1){
// 	  				url = args[0]	
// 	  			}else{
// 	  				url = args
// 	  			}
// 	  		}else if(typeof args == 'string'){
// 	  			url = args
// 	  		}else{
// 	  			throw 'Error with add arguments'
// 	  		}

// 	  		return renderState({url:url, playing: true})
//   	},
//   	'NEXT':() => {
//   		let playlist = currentSettings.playing
//   		commands['STOP']
//   		playlist.shift()
//   		commands['ADD'](playlist)
//   	},
//   	'PREVIOUS':() => {
//   		throw "Previous command doesn't work"
//   	}
//   }
  
  
	
	
	this.options = defaultSettings
	//this.props = null
	
	/***** DEFAULT *****/
	this.options.style = {background: 'black'};
	//this.options.playsinline = true; 
	/***** DEFAULT *****/
 
	this.render = function () {
		renderReactPlayer(document.querySelector(container), { 
			url, 
			// Use ref to grab the internal player and save it as this.internalPlayer
			ref: player => { this.internalPlayer = player },
			...options 
		 });
	}
	
	 /* You lose static properties of the react component but who cares */

	/* Props */
	
	this.play = function () {
		this.options.playing = true;
		this.render();
	}

	this.pause = function () {
		this.options.playing = false
		this.render()
	}
	
	this.mute = function () {
		this.options.muted = true;
		this.render();
	}
	this.unmute = function () {
		this.options.muted = false;
		this.render();
	}
	
	this.speed = function (num) {
		this.options.playbackRate = parseFloat(num);
		this.render();
	}
	
	this.volume = function (num) {
		this.options.volume = num;
		this.render();
	}
	
	this.load = function (url) {
		this.options.url = url;
		this.render();
	}
	this.controls = function (val) {
		this.options.controls = val;
		this.render();
	}
/*   this.light = function (val) {
		this.options.light = val;
		this.render();
		} */
	this.width = function (val) {
		this.options.width = val;
		this.render();
	}
	this.height = function (val) {
		this.options.height = val;
		this.render();
	}
/*   this.style = function (val) {
		this.options.style = val;
		this.render();
		} */
/*   this.progress = function (val) {
		this.options.progressInterval = val;
		this.render();
		} */
	this.playsinline = function (val) {
		this.options.playsinline = val;
		this.render();
	}
	this.pip = function (pip,stopOnUnmount) {
		this.options.pip = pip;
		this.options.stopOnUnmount = stopOnUnmount;
		this.render();
	}
	this.fallback = function (val) {
		this.options.fallback = val;
		this.render();
	}
/*   this.wrapper = function (val) {
		this.options.wrapper = val;
		this.render();
		} */
/*   this.playIcon = function (val) {
		this.options.playIcon = val;
		this.render();
		}
	this.previewTabIndex = function (val) {
		this.options.previewTabIndex = val;
		this.render();
		}
	this.config = function (val) {
		this.options.config = val;
		this.render();
		} */
	
	
	
	
	// Basic method that just calls the internal player methods
	this.seek = function (num) {
		this.internalPlayer.seekTo(num)
	}
	this.getCurrentTime = function () {
		this.internalPlayer.getCurrentTime()
	}
	this.getSecondsLoaded = function () {
		this.internalPlayer.getSecondsLoaded()
	}
	this.getDuration = function () {
		this.internalPlayer.getDuration()
	}
	this.getInternalPlayer = function () {
		this.internalPlayer.getInternalPlayer()
	}
	this.showPreview = function () {
		this.internalPlayer.showPreview()
	}


	

//   let exeControl=function(name, string){
//   	return exeCommand(`${name} ${string}`)
//   }
// 	let exeCommand=function(string){
// 		string = string.trim()
		
// 		let args = string.split(/\s+/)
// 		let cmd = args.shift().toUpperCase()
// 		console.log('Executing Command:',cmd,`(${args.join(' ')})`)


// 		args.forEach(function(arg,index){
// 			if(['off','false','0','no','disabled','null','undefined'].indexOf(arg.toLowerCase())){
// 				args[index]==false;
// 			}
// 		})


// 		let command = commands[cmd]
// 		if(command){
// 			return command.apply(command,args)
// 		}
// 		throw 'Error: couldn\'t parse '+string
// 	}
	
	
// 	let currentSettings={}
// 	renderState = function(state){
// 		//let tmpSettings = currentSettings
// 		currentSettings = _.defaults(state,currentSettings,defaultSettings)
// 		renderReactPlayer(container, currentSettings)
// 	}

// 	//init player
// 	commands['LOAD'](url)

// 	// setTimeout(function(){
// 	// 	commands['PAUSE']()
// 	// 	setTimeout(function(){
// 	// 		exeCommand('play')
// 	// 	},1000)  
// 	// },5000)

	//container.childNodes[0].className="react-player"
	let style = "width:100%; height:100%;"
	if(aspect){
		style +="position:absolute; top:0; left:0"
	}
	container.childNodes[0].style=style

	this.render()
}


/*************************************************/
// https://www.youtube.com/watch?v=TMQxpj3kTKE
window.myplayer1 = new web.video('#container1','https://www.youtube.com/watch?v=oygrmJFKYZY', { 
	playing: true,
	/* playbackRate: .5, */
	width: '640px',
	height: '360px',
	// Example config prop usage
	config: {
		youtube: {
			playerVars: {
				controls: 1,
				fs: 0
			}
		}
	},
	// Example callback usage
	onPause: () => alert('onPause called!')
});

window.myplayer2 = new web.video('#container2','https://www.dailymotion.com/video/xgz4t1', {
	playing: true, // set to true for automatic video start after poster/play button click
	light: true, // video poster only with play button won't play until clicked
	width: '320px',
	height: '180px'
});

/* myplayer1.on('onPlay', function() {
	alert("video is started");
}); */

console.log(myplayer1);

/* myplayer1.setplaybackRate(5); */

/* console.log(myplayer1.getDuration); */



/* RANGE SLIDER */
var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value;

slider.oninput = function() {
	output.innerHTML = this.value;
}
