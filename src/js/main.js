console.log('Loading...');

function screen(selector){
	document.querySelector('.screen.active').classList.remove('active')
	document.querySelector(`.screen${selector}`).classList.add('active')
}

function widget(selector){
	return !document.querySelector(`.widget${selector}`).classList.contains('active')
		? document.querySelector(`.widget${selector}`).classList.add('active')
		: document.querySelector(`.widget${selector}`).classList.remove('active');
}

function shutter(){
	return !document.querySelector('.screen.active').classList.contains('open')
		? document.querySelector('.screen.active').classList.add('open')
		: document.querySelector('.screen.active').classList.remove('open');
}
