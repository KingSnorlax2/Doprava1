const cars = [
    {
        name: "Škoda Octavia",
        image: "images/skoda-octavia.jpg",
        brand: "Škoda",
        
    },
    {
        name: "Volkswagen Golf",
        image: "images/vw-golf.jpg",
        brand: "Volkswagen",
    },
    {
        name: "BMW 3 Series",
        image: "images/bmw-3-series.jpg",
        brand: "BMW",
    },
    // Přidejte další auta podle potřeby
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
        // Nastavíme datum picker na poslední datum, pro které máme data
        const datePicker = document.getElementById('datePicker');
        datePicker.max = Object.keys(car.history).sort().reverse()[0];
        datePicker.value = datePicker.max;
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
        document.getElementById('commonRepairs').value = ''; // Resetujeme výběr běžné opravy
        document.getElementById('newRepairs').value = ''; // Resetujeme vlastní opravu
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

    // Zkontrolujeme, jestli byla vybrána běžná oprava, nebo byla zapsána vlastní
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

// Načtení seznamu aut při načtení stránky index.html
if (document.getElementById('carList')) {
    displayCars(cars);
}

// Načtení detailu auta při načtení stránky car-detail.html
if (document.getElementById('carName')) {
    loadCarDetail();
}
