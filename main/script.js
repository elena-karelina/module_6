
window.addEventListener("load", function() { 
    const audio = document.getElementById('myAudio'); 
    const image = document.getElementById('logo');  
    const tracks = ["dora/dora-dura.mp3", "dora/barbisajjz.mp3", "dora/cayendo.mp3", "dora/net-tebja.mp3", "dora/san-laran.mp3"]; 
    let currentTrackIndex = 0; 
    audio.src = tracks[currentTrackIndex]; 
  
    image.addEventListener('click', () => {  
        if (!audio.paused) {  
          audio.pause();  
        } else {   
          audio.play();  
        }  
      }); 
  
    audio.addEventListener("ended", function() {
      currentTrackIndex++; 
      if (currentTrackIndex >= tracks.length) { 
        currentTrackIndex = 0; 
      } 
      audio.src = tracks[currentTrackIndex]; 
      audio.play(); 
      });
  
    document.addEventListener('keydown', (event) => { 
      if (!audio.paused)
      {
        if (event.code === "Space") {
          audio.pause();
        }
       if (event.code === 'ArrowRight') { 
          currentTrackIndex++; 
        if (currentTrackIndex >= tracks.length) { 
          currentTrackIndex = 0; 
        } 
        audio.src = tracks[currentTrackIndex]; 
        audio.play(); 
      }
        if (event.code === 'ArrowLeft') { 
          currentTrackIndex--; 
        if (currentTrackIndex <= 0) { 
          currentTrackIndex = tracks.length-1; 
        } 
        audio.src = tracks[currentTrackIndex]; 
        audio.play(); 
      }      
      }
  
      else{
        if (event.code === "Space") {
          audio.play();
        }
  
        if (event.code === 'ArrowRight') { 
          currentTrackIndex++; 
          if (currentTrackIndex >= tracks.length) { 
          currentTrackIndex = 0; 
        } 
        audio.src = tracks[currentTrackIndex]; 
      }
        if (event.code === 'ArrowLeft') { 
          currentTrackIndex--; 
          if (currentTrackIndex <= 0) { 
          currentTrackIndex = tracks.length-1; 
        } 
        audio.src = tracks[currentTrackIndex]; 
      }   
      }
    }); 
  
  });