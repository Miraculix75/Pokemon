window.addEventListener('DOMContentLoaded', () => {
	const video = document.getElementById('introVideo');
	const grid = document.querySelector('.grid');
	grid.style.opacity = 0;
  
	video.play();
  
	video.addEventListener('timeupdate', () => {
	  const percent = video.currentTime / video.duration;
	  grid.style.opacity = Math.min(percent * 2, 1); // sanfte Einblendung
	});
  
	video.addEventListener('ended', () => {
	  grid.style.opacity = 1;
	});
  });
  