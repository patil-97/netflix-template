const movieForm = document.getElementById("movieForm");
const toggleBtn = document.querySelectorAll(".toggleBtn");
const backdrop = document.getElementById("backdrop");
const titleControl = document.getElementById("title");
const urlControl = document.getElementById("url");
const overviewControl = document.getElementById("overview");
const ratingControl = document.getElementById("rating");
const movieContainer = document.getElementById("movieContainer");
const updateBtn = document.getElementById("updateBtn");
const addBtn = document.getElementById("addBtn");

function uid() {
    const timestamp = Date.now(); // Get the current timestamp (in milliseconds)
    const randomNum = Math.floor(Math.random() * 10000); // Generate a random number (0 to 9999)
    return `${timestamp}${randomNum}`; // Concatenate both to form the ID
  }

let arr = [
    {
      title: "The Shawshank Redemption",
      url: "https://m.media-amazon.com/images/I/51NiGlapXlL._AC_.jpg",
      rating: 5,
      overview: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
      id: uid()
    },
    {
      title: "The Godfather",
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-0SuGmq-aWxPdc-xRID2QRXvdV5gEk1EWPA&s",
      rating: 5,
      overview: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
      id: uid()
    },
    {
      title: "The Dark Knight",
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2cvu_PBA67xSiBycxI7bd2UZs2L8etGYv5A&s",
      rating: 5,
      overview: "When the menace known as the Joker emerges from his mysterious past, he wreaks havoc and chaos on Gotham's residents.",
      id: uid()
    },
    {
      title: "Fight Club",
      url: "https://m.media-amazon.com/images/I/51v5ZpFyaFL._AC_.jpg",
      rating: 5,
      overview: "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.",
      id: uid()
    },
];

const toLocalStorage = (arr) => {
    localStorage.setItem("movieArr", JSON.stringify(arr));
}

const fromLocalStorage = () => {
    return JSON.parse(localStorage.getItem("movieArr"));
}




arr = fromLocalStorage() || [];


const movieCardCreator = (obj) => {
          return  `
                
                    <div class="card imgCard" id="${obj.id}">
                    <figure id="movieImg" class="movieImg mb-0">
                        <img
                        src="${obj.url}"
                        alt="movie"
                        />
                        <figcaption class="figcaption">
                        <div class="head-rating">
                            <div class="row">
                            <div class="col-10">
                                <h3>${obj.title}</h3>
                            </div>
                            <div class="col-2 d-flex">
                                <strong class="align-self-center">${obj.rating}</strong>
                            </div>
                            </div>
                        </div>
                        <div class="overview">
                            <h3>${obj.title}</h3>
                            <p>
                            ${obj.overview}
                            </p>
                            <div class="icons">
                                <i class="fa-solid fa-pen-to-square fa-2x" onClick = onEdit(this)></i>
                                <i class="fa-solid fa-trash-can fa-2x " onClick = onRemove(this)></i>
                            </div>
                        </div>
                        </figcaption>
                       
                    </figure>
                    </div>
                `;
};

{/* <div class="col-lg-3 col-md-4 col-sm-6 mb-4" > */}
const templateCreator = (arr) => {
    let movies = "";
    arr.forEach(ele =>{ 
        movies +=  `<div class="col-lg-3 col-md-4 col-sm-6 mb-4">`;
        movies += movieCardCreator(ele)
        movies += `</div>`;
    });
    
    movieContainer.innerHTML = movies;
};


templateCreator(arr);
// <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
// </div>

function swal (icon, title) {
    Swal.fire({
        icon: icon,
        title: title,
        showConfirmButton: false,
        timer: 1500
      });
}

const onMovieAdd = (e) => {


    e.preventDefault();
    let newMovie = {
        title: titleControl.value,
        url: urlControl.value,
        overview: overviewControl.value,
        rating: ratingControl.value,
        id: uid()
    }
    
    arr.unshift(newMovie);
    toLocalStorage(arr);
    const col = document.createElement("div");
    col.className = "col-lg-3 col-md-4 col-sm-6 mb-4"
    col.innerHTML = movieCardCreator(newMovie);
    movieContainer.prepend(col);
    e.target.reset();

    swal("success", "Movie Added Successfully!!!")
    onToggle();
}

const onToggle = () => {
    movieForm.classList.toggle("d-none");
    backdrop.classList.toggle("d-none");
    updateBtn.classList.add("d-none");
    addBtn.classList.remove("d-none");
    if(!movieForm.className.includes("d-none")){
         movieForm.reset();
    }

}

const onEdit = (e) => {
    onToggle();
    addBtn.classList.add("d-none");
    updateBtn.classList.remove("d-none");

    let getId = e.closest(".card").id;
    let getEle = e.closest(".card").parentElement;

    localStorage.setItem("getId", getId);

    let ele = arr.find(ele => ele.id === getId);
    titleControl.value = ele.title;
    urlControl.value = ele.url;
    overviewControl.value = ele.overview;
    ratingControl.value = ele.rating;

}

const onUpdate = (e) => {
    let getId = localStorage.getItem("getId");

    let updatedObj = {
        title: titleControl.value,
        url: urlControl.value,
        overview: overviewControl.value,
        rating: ratingControl.value,
        id: getId,
    }

    let col = document.getElementById(getId).parentElement;
    col.innerHTML = movieCardCreator(updatedObj);

    let getIndex = arr.findIndex(ele => ele.id === getId);
    arr.splice(getIndex,1,updatedObj);
    toLocalStorage(arr);

    swal("success", "Movie Updated");
    movieForm.reset();
}

const onRemove = (e) => {
   

    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
            let getId = e.closest(".card").id;
            let getCard = e.closest(".card");
            getCard.parentElement.remove();
            let index = arr.findIndex(ele => ele.id == getId);
            arr.splice(index,1);
            toLocalStorage(arr);

          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
          });
        }
      });
}



toggleBtn.forEach(ele => ele.addEventListener("click", onToggle));
movieForm.addEventListener("submit", onMovieAdd);
updateBtn.addEventListener("click", onUpdate);



