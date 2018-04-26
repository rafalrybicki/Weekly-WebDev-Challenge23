const nav = document.querySelector('nav');
const menuButton = document.querySelector('nav button');
const menu = document.querySelector('.menu');
const menuItems = document.querySelectorAll('.menu li a');
const menuElements = Array.from(document.querySelectorAll('nav ul span'));
const menuElementsOffsetY= [];
const imageGallery = document.querySelector('.profile-box');
const imageGalleryItems = Array.from(document.querySelectorAll('.profile-box img'));
const logo = document.querySelector('.logo');

let index, currentY;

window.onload = () => {
	
	currentY = Math.round(scrollY + (innerHeight/10)); 
	
	index = menuElementsOffsetY.findIndex(el => el>currentY);
	
	index < 0 ? index = menuElementsOffsetY.length-1 : index--;
	
	menuElements[index].classList.add('active');
	console.log(index);
}
	
window.addEventListener('resize', ()=> innerWidth>=992 ? menuItems.forEach((el)=> el.style.opacity = 1) : "");
window.addEventListener('scroll', watchMenu);

logo.addEventListener('click', (e)=>{
	e.preventDefault();
	let currentY = window.pageYOffset;
	const animator = setInterval(()=>{
		scroll(0, currentY-70);
		scrollY == 0 ? clearInterval(animator) : "";
		currentY = window.pageYOffset;
	}, 10)
});
menuButton.addEventListener('click', menuToggle);
menuButton.addEventListener('click', menuButtonChange);
menuItems.forEach((el) => el.addEventListener('click', smoothScroll));
menuItems.forEach((el)=>{
	menuElementsOffsetY.push(document.querySelector(el.hash).offsetTop);
});
imageGallery.addEventListener('click', lightbox);


function menuToggle(){
	
	menuButton.classList.toggle('open');
	
	if(menuButton.classList.contains('open')){
		menu.style.top = 0;
		menuItems.forEach((el)=>setTimeout(()=> el.style.opacity = 1, 500));
	} else{
		menuItems.forEach((el)=> el.style.opacity = 0);
		setTimeout(()=> menu.style.top = '-100vh');
	}
}

function menuButtonChange(){
	
	const menuButtonItems = document.querySelectorAll('button span');
	
	if(menuButton.classList.contains('open')){
		menuButtonItems[1].style.display = 'none';
		menuButtonItems[0].style.transform = 'translateY(12px) translateX(0) rotate(45deg)';
		menuButtonItems[2].style.transform = 'translateY(-12px) translateX(0) rotate(-45deg)';
		
	} else{
		menuButtonItems[1].style.display = 'block';
		menuButtonItems[0].style.transform = 'translateY(0) translateX(0) rotate(0)';
		menuButtonItems[2].style.transform = 'translateY(0) translateX(0) rotate(0)';
	}
}

function smoothScroll(e) {

   e.preventDefault();
	if(innerWidth<992) {
		menuToggle();
	}
	menuButtonChange();
	
   const distance = 20;
   const speed = 10;
   const jumpTo = this.getAttribute('href');
   const targetY = document.querySelector(jumpTo).offsetTop - nav.offsetHeight;
   let currentY = window.pageYOffset;

   const animator = setInterval(scrollTo, speed); 
	 
	function scrollTo() { 

		if (currentY <=targetY) {

			window.scroll(0, currentY += distance);

			if(currentY >= targetY) {
				window.scroll(0, targetY);
				clearInterval(animator);
			}

		} else if (currentY >= targetY) {

			window.scroll(0, currentY -= distance);

			if(currentY <= (targetY)) {
				window.scroll(0, targetY);
				clearInterval(animator);
			}
		}
	}
	menu.style.display = 'flex';
}

function lightbox(e){
	
	let index = parseInt(e.target.parentElement.getAttribute('data-index'));
	
	const lightbox = document.createElement('div');
	lightbox.addEventListener('keydown', (e)=>{
		if(e.keyCode == 37){
			prevImage();
		} else if(e.keyCode == 39){
			nextImage();
		}
	})
	lightbox.classList.add('lightbox');
	
	lightboxItems = [];
	imageGalleryItems.map((el)=>lightboxItems.push(el.getAttribute('src')));

	const closeBtn = document.createElement('button');
	closeBtn.classList.add('close');
	closeBtn.textContent = "+";
	closeBtn.addEventListener('click', ()=>{
		lightbox.style.opacity = 0;
		setTimeout(()=>document.body.removeChild(lightbox), 500);
	});
	
	const currentImage = document.createElement('img');
	currentImage.setAttribute('src', lightboxItems[index]);
	currentImage.classList.add('current');
	
	const prevBtn = document.createElement('button');
	prevBtn.classList.add('prev');
	prevBtn.textContent = '<';
	prevBtn.addEventListener('click', prevImage);
	
	const nextBtn = document.createElement('button');
	nextBtn.classList.add('next');
	nextBtn.textContent = '>';
	nextBtn.addEventListener('click', nextImage);
	
	const numbers = document.createElement('div');
	const currentNumber = document.createElement('span');
	currentNumber.textContent = index+1;
	numbers.appendChild(currentNumber);
	numbers.append(`/${lightboxItems.length}`);

	
	lightbox.appendChild(currentImage, closeBtn, prevBtn, nextBtn, numbers);
	lightbox.appendChild(closeBtn);
	lightbox.appendChild(prevBtn);
	lightbox.appendChild(nextBtn);
	lightbox.appendChild(numbers);
	
	document.body.appendChild(lightbox);
	setTimeout(()=>{
		lightbox.style.opacity = 1, 10;
		
	});
	
	function prevImage(){
		currentImage.classList.remove('from-right');
		currentImage.classList.remove('from-left');
		
		index > 0 ? index-- : index = lightboxItems.length - 1; 
		currentImage.classList.add('to-left');
		setTimeout(()=>{
			currentImage.classList.add('from-right');
			currentImage.src = lightboxItems[index]
			currentImage.classList.remove('to-left');
			currentNumber.textContent = (index+1);
		}, 500)
	}
	
	function nextImage(){
		currentImage.classList.remove('from-right');
		currentImage.classList.remove('from-left');
		
		index < lightboxItems.length - 1 ? index++ : index = 0; 
		currentImage.classList.add('to-right');
		setTimeout(()=>{
			currentImage.classList.add('from-left');
			currentImage.src = lightboxItems[index];
			currentImage.classList.remove('to-right');
			currentNumber.textContent = (index+1);
		}, 500)
	}
}

	
function watchMenu(){
	
	currentY = scrollY + nav.offsetHeight; 
	
	if(currentY >= menuElementsOffsetY[index+1]){
		menuElements[index].classList.remove('active');
		menuElements[index+1].classList.add('active');
		index++
	} else if(currentY<menuElementsOffsetY[index]){
		menuElements[index].classList.remove('active');
		menuElements[index-1].classList.add('active');
		index--
	}
}
