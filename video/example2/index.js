window.rMeta = window.rMeta || {}
rMeta.video = function rMetaVideo(container, url, options) {

  this.options = options
	//this.props = null
  
  /***** DEFAULT *****/
  this.options.style = {background: 'black'};
  this.options.playsinline = true; 
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


  
  /* Instance Methods */
  /* Callback */
  /* Config prop */
  /* Static Methods */

	this.render()
}


/*************************************************/
// https://www.youtube.com/watch?v=TMQxpj3kTKE
window.myplayer1 = new rMeta.video('#container1','https://www.youtube.com/watch?v=oygrmJFKYZY', { 
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

window.myplayer2 = new rMeta.video('#container2','https://www.dailymotion.com/video/xgz4t1', {
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
