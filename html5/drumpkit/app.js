const keys = document.querySelectorAll('.key');

for(let i=0;i<keys.length;i++){
    let key = keys[i]
    //key.addEventListener('')
}

const playSound = (event) => {
    const keyCode = event.keyCode;
    //console.log(keyCode);
    const ele = document.querySelector(`.key[data-key="${keyCode}"]`)
    //console.log(ele);
    if(ele){
        var audio;
        switch(keyCode){
        case 65:audio=new Audio('./sounds/boom.wav');
        audio.play(); break;
        case 83:audio=new Audio('./sounds/clap.wav');
        audio.play();break;
        case 68:audio=new Audio('./sounds/hihat.wav');
        audio.play();break;
        case 70:audio=new Audio('./sounds/kick.wav');
        audio.play();break;
        case 71:audio=new Audio('./sounds/openhat.wav');
        audio.play();break;
        case 72:audio=new Audio('./sounds/ride.wav');
        audio.play();break;
        case 74:audio=new Audio('./sounds/snare.wav');
        audio.play();break;
        case 75:audio=new Audio('./sounds/tink.wav');
        audio.play();break;
        case 76:audio=new Audio('./sounds/tom.wav');
        audio.play();break;
        }}
    if(ele){
        ele.classList.add('playing');
        setTimeout(()=>{
            ele.classList.remove('playing');
        },600)
    }
}

window.addEventListener('keyup',playSound);

