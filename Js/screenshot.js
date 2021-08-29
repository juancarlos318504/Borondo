'use strict';

const StartDiv = document.getElementById('loader-landing');
const StartButton = document.getElementById('button-start');
const montaje = document.getElementById("montaje");

const imagesContainer = document.getElementById("images-container");

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const snap = document.getElementById("snap");


window.addEventListener('scroll', () =>{
    //console.log(imagesContainer.style.height, window.innerHeight * 0.89);
    setSizeTo720p();
}) 

setSizeTo720p();

//StartButton.setAttribute("disabled", "disabled");
StartButton.addEventListener("click", 
    function() {
        init1();
        StartDiv.remove();

        if(navigator.userAgentData.mobile){
            document.body.requestFullscreen();
        }
        
        document.getElementById("video-wrap").style.display = 'flex';
        setTimeout(function(){ 
            document.getElementById("instructions").classList.add('fadeOut'); 
        }, 10000);
        //document.getElementById("montaje").play();
    }
);


document.getElementById('size-button').addEventListener('click', (event) => {
    if (document.fullscreenElement) {
      
        document.exitFullscreen();
    } else {
        document.body.requestFullscreen();
    }
});


PermissionStatus.onchange = function() {
    console.log("cambio");
        location.reload();
        /*Notification.requestPermission(function(result) {
            if (result === 'denied') {
                alert('Permission wasn\'t granted. Allow a retry.');

                
                return;
            } else if (result === 'default') {
                alert('The permission request was dismissed.');
                return;
            }
            // Hacer algo con el permiso concedido.
        });*/
}


let front = true;
let stream;
let constraints = {
    audio: false,
    video: {
        width: 1280, height: 720,
        facingMode: (front? "user" : "environment")
    }
};


document.getElementById('reverse-button').onclick = function() { 
    front = !front; 
    constraints.video.facingMode =(front? "user" : "environment"); 
    const rotation =  front? "180deg" : "0deg"
    video.style.transform = `rotateY(${rotation})`;

    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());

    init1();
};

// Access webcam
async function init1() {
    try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        handleSuccess(stream);
        StartButton.removeAttribute("disabled");
    } catch (e) {
        //errorMsgElement.innerHTML = `navigator.getUserMedia error:${e.toString()}`;
        console.log("An error occured! " + e);
        alert('Es necesario que brindes acceso a la cámara de tu dispositivo para poder interactuar. Utiliza el ícono de candado que esta junto a la url para poder brindar los permisos necesarios.');
    }

    
    window.addEventListener('resize', () =>{
        //console.log(imagesContainer.style.height, window.innerHeight * 0.89);
        setSizeTo720p();
    }) 

    video.addEventListener('resize', () =>{
        setSizeTo720p();
    }) 
    
}


function setSizeTo720p(){
    if(window.innerWidth/window.innerHeight > 1.777777777777){
        imagesContainer.style.height = window.innerHeight*0.9 + "px"
        //console.log(imagesContainer.innerHeight)
        //imagesContainer.style.height = video.style.height;
        imagesContainer.style.width = (imagesContainer.offsetHeight * 1.77777)+"px";
    }else{
        imagesContainer.style.width = window.innerWidth*0.9 + "px"
        //console.log(imagesContainer.style.width);
        //imagesContainer.style.width = video.style.width;
        imagesContainer.style.height = (imagesContainer.offsetWidth / 1.77777)+"px";
    }
}

function init(){
    /*if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia (constraints)
            .then(function(stream) {
                handleSuccess(stream);
                StartButton.removeAttribute("disabled");
            })

            // Error callback
            .catch(function(err) {
                alert('Es necesario que brindes acceso a la cámara de tu dispositivo para poder interactuar. Utiliza el ícono de candado que esta junto a la url para poder brindar los permisos necesarios.');
            }
        );
    } else {
        alert('getUserMedia no es soportado en tu navegador!');
    }*/

    navigator.getMedia = ( navigator.getUserMedia ||
                        navigator.webkitGetUserMedia ||
                        navigator.mozGetUserMedia ||
                        navigator.msGetUserMedia);

    navigator.getMedia(
        {
            audio: false,
            video: {
                width: 1280, height: 720
            }               
        },
        function(stream) {
        if (navigator.mozGetUserMedia) {
            video.mozSrcObject = stream;
            window.stream = stream;
        } else {
            var vendorURL = window.URL || window.webkitURL;
            video.srcObject = stream;
            window.stream = stream;
        }
        video.play();
        },
            function(err) {
            console.log("An error occured! " + err);
            alert('Es necesario que brindes acceso a la cámara de tu dispositivo para poder interactuar. Utiliza el ícono de candado que esta junto a la url para poder brindar los permisos necesarios.');
        }
    );

    var streaming = false;
    video.addEventListener('canplay', function(ev){
        if (!streaming) {
            var width = 1280;
            var height = 720;
            video.setAttribute('width', width);
            video.setAttribute('height', height);
            canvas.setAttribute('width', width);
            canvas.setAttribute('height', height);
            streaming = true;
        }
    }, false);
}


// Success
function handleSuccess(stream) {
    window.stream = stream;
    video.srcObject = stream;
    // console.log(video.videoWidth);
    // document.getElementById("montaje").style.width = "1280px";
    // document.getElementById("montaje").style.height = "720px";
}

const logo = document.getElementById("logo");
// Draw image
var context = canvas.getContext('2d');
var timer = document.getElementById("timer_count");

snap.addEventListener("click", 
    function() {        

        snap.setAttribute("disabled", "disabled");
        //timer.setAttribute("disabled", "disabled");
        timer.innerHTML = 3;

        var countdown = window.setInterval(function() {
            var seconds = timer.innerHTML;
            seconds = seconds - 1;
            timer.innerHTML = seconds;

            if (seconds == 0) {
                timer.innerHTML = "¡ Una sonrisa !";
                
                clearInterval(countdown);
                }
        }, 1000);

        window.setTimeout(async function() {

            const canvasMontaje = await html2canvas(imagesContainer, 
                {backgroundColor: null})

            var image = new Image();
            image.id = "pic";
            image.src = canvasMontaje.toDataURL("image/png", 1.0);
            //document.body.appendChild(image);


            image.onload = function() {
                context.translate(1280, 0);
                context.scale(-1, 1);   
                context.drawImage(video, 0,0, 1280, 720);
                context.setTransform(1,0,0,1,0,0);
                
                context.drawImage(image, 0,0, 1280, 720);
                
                /*var image2 = new Image();
                image2.id = "pic2";
                image2.src = canvas.toDataURL();
                image2.style.width = "50%"
                //document.body.appendChild(image2);*/

                var link = document.getElementById('link');
                link.setAttribute('download', 'Foto.png');
                link.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
                link.click();

                context.clearRect(0, 0, canvas.width, canvas.height);
                //timer.removeAttribute("disabled");
                snap.removeAttribute("disabled");

                
            };

            

            window.setTimeout(function() {
                timer.innerHTML = "";
            }, 1500);

        }, 3000);



        
    }
);