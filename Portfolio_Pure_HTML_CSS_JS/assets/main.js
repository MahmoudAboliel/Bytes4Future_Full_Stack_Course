function sliderImages() {
  const landingImages = document.getElementById("landing-images");
  const imagesLength = landingImages.querySelectorAll("img").length;

  let currentIndex = 0;
  setInterval(() => {
    landingImages.style.transform = `translateX(-${currentIndex * 100}%)`;

    currentIndex++;
    currentIndex = currentIndex % imagesLength;

    console.log(currentIndex);
  }, 4000);
}

// sliderImages()

