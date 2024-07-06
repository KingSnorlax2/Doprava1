const cars = [
    {
        name: "Škoda Octavia",
        image: "images/skoda-octavia.jpg",
        brand: "Škoda",
        history: {}
    },
    {
        name: "Volkswagen Golf",
        image: "images/vw-golf.jpg",
        brand: "Volkswagen",
        history: {}
    },
    {
        name: "BMW 3 Series",
        image: "images/bmw-3-series.jpg",
        brand: "BMW",
        history: {}
    }
];

function displayCars(carList) {
    const carListContainer = document.getElementById('carList');
    carListContainer.innerHTML = '';
    carList.forEach(car => {
        const carItem = document.createElement('div');
        carItem.className = 'car-item';
        carItem.innerHTML = `
            <img src="${car.image}" alt="${car.name}">
            <h3>${car.name}</h3>
        `;
        carItem.onclick = () => showCarDetail(car);
        carListContainer.appendChild(carItem);
    });
}

function filterCars() {
    const searchTerm = document.getElementById('searchBar').value.toLowerCase();
    const filteredCars = cars.filter(car => car.name.toLowerCase().includes(searchTerm));
    displayCars(filteredCars);
}

function showCarDetail(car) {
    localStorage.setItem('selectedCar', JSON.stringify(car));
    window.location.href = 'car-detail.html';
}

function loadCarDetail() {
    const car = JSON.parse(localStorage.getItem('selectedCar'));
    if (car) {
        document.getElementById('carName').innerText = car.name;
        document.getElementById('carImage').src = car.image;
        document.getElementById('carBrand').innerText = car.brand;
        // Set date picker to the latest date for which we have data
        const datePicker = document.getElementById('datePicker');
        datePicker.max = new Date().toISOString().split("T")[0];
        const availableDates = Object.keys(car.history);
        if (availableDates.length > 0) {
            datePicker.value = availableDates.sort().reverse()[0];
        } else {
            datePicker.value = datePicker.max;
        }
        updateCarDetails();
    }
}

function updateCarDetails() {
    const car = JSON.parse(localStorage.getItem('selectedCar'));
    const selectedDate = document.getElementById('datePicker').value;
    const carDetails = car.history[selectedDate];
    if (carDetails) {
        document.getElementById('carMileage').innerText = carDetails.mileage + " km";
        document.getElementById('carRepairs').innerText = carDetails.repairs;
        document.getElementById('newMileage').value = carDetails.mileage;
        document.getElementById('commonRepairs').value = ''; // Reset common repair selection
        document.getElementById('newRepairs').value = ''; // Reset custom repair
    } else {
        document.getElementById('carMileage').innerText = "N/A";
        document.getElementById('carRepairs').innerText = "N/A";
        document.getElementById('newMileage').value = '';
        document.getElementById('commonRepairs').value = '';
        document.getElementById('newRepairs').value = '';
    }
}

function saveCarDetails(event) {
    event.preventDefault();
    const car = JSON.parse(localStorage.getItem('selectedCar'));
    const selectedDate = document.getElementById('datePicker').value;
    const newMileage = document.getElementById('newMileage').value;
    let newRepairs = '';

    const commonRepairs = document.getElementById('commonRepairs').value;
    if (commonRepairs) {
        newRepairs = commonRepairs;
    } else {
        newRepairs = document.getElementById('newRepairs').value;
    }

    if (!car.history[selectedDate]) {
        car.history[selectedDate] = {};
    }
    car.history[selectedDate].mileage = newMileage;
    car.history[selectedDate].repairs = newRepairs;

    localStorage.setItem('selectedCar', JSON.stringify(car));
    updateCarDetails();
}

function goBack() {
    window.history.back();
}

// Load car list on index.html
if (document.getElementById('carList')) {
    displayCars(cars);
}

// Load car detail on car-detail.html
if (document.getElementById('carName')) {
    loadCarDetail();
}
