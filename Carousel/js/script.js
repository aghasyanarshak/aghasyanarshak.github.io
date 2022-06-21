let nextBtn = document.querySelector('.next');
let prevBtn = document.querySelector('.prev');
let playStopBtns = document.querySelector('.center');
let allSlides = document.querySelectorAll('.pictures');
let dots = document.querySelectorAll('.dot');
let slideIndex = parseInt(document.querySelector('.active').getAttribute('data-index'));
let stopInt;

function interval(event){
    if (event.target.id === 'play'){
        clearInterval(stopInt);
        stopInt = setInterval(play, 1500, slideIndex);
    } else if(event.target.id === 'stop'){
        clearInterval(stopInt);
        slideIndex = parseInt(document.querySelector('.active').getAttribute('data-index'));
    }   
}
playStopBtns.addEventListener('click',interval);

function hideSlide(){
    allSlides.forEach(function(item){
        item.style.display = "none";
    });
}

function showSlide(slideIndex){
    allSlides[slideIndex].style.display = "block";
}

function changeSlide(){
    let arrow = this.getAttribute('data-arrow');
    hideSlide();
    dots.forEach(function(item){
        item.classList.remove('active');
    });
    if(arrow == "next"){
        slideIndex++;
        if(slideIndex == allSlides.length){
            slideIndex = 0;
        }
    }
    if(arrow == "prev"){
        slideIndex--;
        if(slideIndex < 0){
            slideIndex = allSlides.length-1;
        }
    }
    if(arrow == "dot"){
        dots.forEach(function(item){
            item.classList.remove('active');
        });
        slideIndex = parseInt(this.getAttribute('data-index'));
    }
    dots[slideIndex].classList.add('active');
    showSlide(slideIndex);
}

function play() {
    hideSlide();
    dots.forEach(function(item){
        item.classList.remove('active');
    });
    dots[slideIndex].classList.add('active');
    showSlide(slideIndex);
    if(slideIndex === allSlides.length-1) {
        slideIndex = 0;
    } else {
        slideIndex++;
    }
}

nextBtn.addEventListener('click', changeSlide);
prevBtn.addEventListener('click', changeSlide);


dots.forEach(function(item){
    item.addEventListener('click', changeSlide);
});





