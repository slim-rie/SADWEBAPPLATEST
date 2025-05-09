document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const username = localStorage.getItem('username');
    
    if (!isLoggedIn) {
        window.location.href = 'index.html';
        return;
    }
    
    updateUIForLoginStatus(isLoggedIn, username);
    
    document.getElementById('sidebarUsername').textContent = username || '';
    
    const savedProfileImage = localStorage.getItem('profileImage');
    if (savedProfileImage) {
        document.getElementById('profileImage').src = savedProfileImage;
    }
    
    document.getElementById('editProfileBtn').addEventListener('click', function() {
        window.location.href = 'myaccount.html';
    });
    
    loadAddresses();
    
    document.getElementById('addNewAddressBtn').addEventListener('click', function() {
        openAddressModal('add');
    });
    
    const addressModal = document.getElementById('addressModal');
    const closeAddressModal = document.getElementById('closeAddressModal');
    const cancelAddressModal = document.getElementById('cancelAddressModal');
    const saveAddressModal = document.getElementById('saveAddressModal');
    
    closeAddressModal.addEventListener('click', function() {
        addressModal.classList.remove('active');
    });
    
    cancelAddressModal.addEventListener('click', function() {
        addressModal.classList.remove('active');
    });
    
    saveAddressModal.addEventListener('click', function() {
        saveAddress();
    });
    
    const userIcon = document.getElementById('user-icon');
    const dropdownMenu = document.getElementById('dropdownMenu');
    
    if (isLoggedIn) {
        dropdownMenu.innerHTML = `
            <a href="myaccount.html" class="dropdown-item">My Account</a>
            <a href="orders.html" class="dropdown-item">Orders</a>
            <a href="#" class="dropdown-item" id="logoutBtn">Logout</a>
        `;
        
        document.getElementById('logoutBtn').addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    } else {
        dropdownMenu.innerHTML = `
            <a href="login.html" class="dropdown-item">Login</a>
            <a href="register.html" class="dropdown-item">Register</a>
        `;
    }
    
    userIcon.addEventListener('click', function(e) {
        e.stopPropagation(); 
        dropdownMenu.classList.toggle('active');
    });
    
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.user-dropdown')) {
            dropdownMenu.classList.remove('active');
        }
    });
    
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-overlay')) {
            e.target.classList.remove('active');
        }
    });
    
    setupLocationSelectionUI();
});

function setupLocationSelectionUI() {
    const dropdownToggle = document.getElementById('dropdownToggle');
    const dropdownContent = document.getElementById('dropdownContent');
    const selectedLocation = document.getElementById('selectedLocation');
    const tabs = document.querySelectorAll('.tab');
    const locationLists = document.querySelectorAll('.location-list');
    
    const regionList = document.getElementById('regionList');
    const provinceList = document.getElementById('provinceList');
    const cityList = document.getElementById('cityList');
    const barangayList = document.getElementById('barangayList');
    
    const homeLabel = document.getElementById('homeLabel');
    const workLabel = document.getElementById('workLabel');
    const addressLabelInput = document.getElementById('addressLabel');
    
    const streetAddress = document.getElementById('streetAddress');
    const addressSuggestions = document.getElementById('addressSuggestions');
    
    const locationData = {
        provinces: {
                    northLuzon: ['Bataan', 'Bulacan', 'Nueva Ecija', 'Pampanga', 'Tarlac', 'Zambales', 'Pangasinan', 'La Union', 'Ilocos Norte', 'Ilocos Sur', 'Cagayan', 'Isabela'],
                    ncr: ['Metro Manila'],
                    southLuzon: ['Laguna', 'Batangas', 'Cavite', 'Quezon', 'Rizal', 'Albay', 'Camarines Norte', 'Camarines Sur', 'Catanduanes', 'Sorsogon'],
                    visayas: ['Cebu', 'Bohol', 'Leyte', 'Negros Occidental', 'Negros Oriental', 'Samar', 'Iloilo', 'Capiz', 'Aklan', 'Antique'],
                    mindanao: ['Davao del Sur', 'Davao del Norte', 'Zamboanga del Sur', 'Zamboanga del Norte', 'North Cotabato', 'South Cotabato', 'Bukidnon', 'Misamis Oriental', 'Misamis Occidental', 'Lanao del Norte', 'Lanao del Sur', 'Maguindanao', 'Sultan Kudarat']
                },
                cities: {
                    Bulacan: ['Bocaue', 'Malolos', 'Meycauayan', 'San Jose Del Monte', 'Balagtas', 'Bulacan', 'Calumpit', 'Guiguinto', 'Hagonoy', 'Marilao', 'Obando', 'Paombong', 'Plaridel', 'Pulilan', 'Santa Maria'],
                    Pampanga: ['Angeles', 'San Fernando', 'Mabalacat', 'Lubao', 'Apalit', 'Arayat', 'Bacolor', 'Candaba', 'Floridablanca', 'Guagua', 'Macabebe', 'Mexico', 'Porac', 'San Luis', 'San Simon', 'Santa Ana', 'Santa Rita'],
                    'Metro Manila': ['Manila', 'Quezon City', 'Makati', 'Taguig', 'Pasig', 'Parañaque', 'Pasay', 'Caloocan', 'Las Piñas', 'Mandaluyong', 'Marikina', 'Muntinlupa', 'Navotas', 'Valenzuela', 'San Juan', 'Pateros'],
                    Laguna: ['San Pedro', 'Biñan', 'Santa Rosa', 'Calamba', 'Los Baños', 'Cabuyao', 'Alaminos', 'Bay', 'Calauan', 'Famy', 'Kalayaan', 'Liliw', 'Luisiana', 'Lumban', 'Mabitac', 'Magdalena', 'Majayjay', 'Nagcarlan', 'Paete', 'Pagsanjan', 'Pakil', 'Pangil', 'Pila', 'Rizal', 'San Pablo', 'Santa Cruz', 'Victoria'],
                    Cebu: ['Cebu City', 'Mandaue', 'Lapu-Lapu', 'Talisay', 'Danao', 'Toledo', 'Bogo', 'Carcar', 'Naga']
                },
                barangays: {
                    Bocaue: ['Lolomboy', 'Bunlo', 'Turo', 'Poblacion', 'Bagumbayan', 'Bambang', 'Batia', 'Biñang 1st', 'Biñang 2nd', 'Caingin', 'Duhat', 'Igulot', 'Sulucan', 'Taal', 'Tambobong', 'Wakas'],
                    Malolos: ['Balite', 'Caniogan', 'San Gabriel', 'Bulihan', 'Balete', 'Anilao', 'Atlag', 'Bagna', 'Balangkas', 'Bangkal', 'Barihan', 'Bungahan', 'Dakila', 'Guinhawa', 'Ligas', 'Longos', 'Lookban', 'Lugam', 'Mabolo', 'Malusak', 'Matimbo', 'Mojon', 'Namayan', 'Niugan', 'Panasahan', 'Pamarawan', 'Pinagbakahan', 'San Agustin', 'San Juan', 'San Pablo', 'San Vicente', 'Santiago', 'Santo Cristo', 'Santo Niño', 'Santo Rosario', 'Santisima Trinidad', 'Sumapang Bata', 'Sumapang Matanda', 'Taal', 'Tikay'],
                    'Quezon City': ['Alicia', 'Amihan', 'Apolonio Samson', 'Aurora', 'Baesa', 'Bagbag', 'Bagong Lipunan ng Crame', 'Bagong Pag-asa', 'Bagong Silangan', 'Bagumbayan', 'Bahay Toro', 'Balingasa', 'Balong Bato', 'Batasan Hills', 'Bayanihan', 'Blue Ridge A', 'Blue Ridge B', 'Botocan', 'Bungad', 'Camp Aguinaldo']
                }
    };
    
    const sampleAddresses = [
        "123 Maharlika Highway, Lolomboy",
        "456 San Jose St, Near Market",
        "789 Rizal Ave, Beside School",
        "101 Barangay Road, Near Church",
        "202 Commonwealth Blvd, Corner Store"
    ];
    
    let selection = {
        region: '',
        province: '',
        city: '',
        barangay: ''
    };
    
    dropdownToggle.addEventListener('click', function() {
        dropdownContent.classList.toggle('active');
        const arrow = dropdownToggle.querySelector('.arrow');
        if (dropdownContent.classList.contains('active')) {
            arrow.textContent = '▲';
        } else {
            arrow.textContent = '▼';
        }
    });
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const tabName = this.getAttribute('data-tab');
            locationLists.forEach(list => list.style.display = 'none');
            document.getElementById(tabName + 'List').style.display = 'block';
        });
    });
    
    regionList.addEventListener('click', function(e) {
        if (e.target.classList.contains('location-item')) {
            const regionValue = e.target.getAttribute('data-value');
            const regionName = e.target.textContent;
            
            selection.region = regionName;
            selection.province = '';
            selection.city = '';
            selection.barangay = '';
            
            updateSelectionDisplay();
            
            populateProvinces(regionValue);
            
            tabs.forEach(t => t.classList.remove('active'));
            tabs[1].classList.add('active');
            
            locationLists.forEach(list => list.style.display = 'none');
            provinceList.style.display = 'block';
        }
    });
    
    provinceList.addEventListener('click', function(e) {
        if (e.target.classList.contains('location-item')) {
            const provinceName = e.target.textContent;
            
            selection.province = provinceName;
            selection.city = '';
            selection.barangay = '';
            
            updateSelectionDisplay();
            
            populateCities(provinceName);
            
            tabs.forEach(t => t.classList.remove('active'));
            tabs[2].classList.add('active');
            
            locationLists.forEach(list => list.style.display = 'none');
            cityList.style.display = 'block';
        }
    });
    
    cityList.addEventListener('click', function(e) {
        if (e.target.classList.contains('location-item')) {
            const cityName = e.target.textContent;
            
            selection.city = cityName;
            selection.barangay = '';
            
            updateSelectionDisplay();
            
            populateBarangays(cityName);
            
            tabs.forEach(t => t.classList.remove('active'));
            tabs[3].classList.add('active');
            
            locationLists.forEach(list => list.style.display = 'none');
            barangayList.style.display = 'block';
        }
    });
    
    barangayList.addEventListener('click', function(e) {
        if (e.target.classList.contains('location-item')) {
            const barangayName = e.target.textContent;
            
            selection.barangay = barangayName;
            
            updateSelectionDisplay();
            
            dropdownContent.classList.remove('active');
            dropdownToggle.querySelector('.arrow').textContent = '▼';
        }
    });
    
    function populateProvinces(regionValue) {
        provinceList.innerHTML = '';
        
        if (locationData.provinces[regionValue]) {
            locationData.provinces[regionValue].forEach(province => {
                const item = document.createElement('div');
                item.className = 'location-item';
                item.textContent = province;
                provinceList.appendChild(item);
            });
        }
    }
    
    function populateCities(provinceName) {
        cityList.innerHTML = '';
        
        if (locationData.cities[provinceName]) {
            locationData.cities[provinceName].forEach(city => {
                const item = document.createElement('div');
                item.className = 'location-item';
                item.textContent = city;
                cityList.appendChild(item);
            });
        }
    }
    
    function populateBarangays(cityName) {
        barangayList.innerHTML = '';
        
        if (locationData.barangays[cityName]) {
            locationData.barangays[cityName].forEach(barangay => {
                const item = document.createElement('div');
                item.className = 'location-item';
                item.textContent = barangay;
                barangayList.appendChild(item);
            });
        }
    }
    
    function updateSelectionDisplay() {
        let displayText = '';
        
        if (selection.region) {
            displayText = selection.region;
            
            if (selection.province) {
                displayText += ', ' + selection.province;
                
                if (selection.city) {
                    displayText += ', ' + selection.city;
                    
                    if (selection.barangay) {
                        displayText += ', ' + selection.barangay;
                    }
                }
            }
        } else {
            displayText = 'Region, Province, City, Barangay';
        }
        
        selectedLocation.textContent = displayText;
    }
    
    homeLabel.addEventListener('click', function() {
        homeLabel.classList.add('active');
        workLabel.classList.remove('active');
        addressLabelInput.value = 'home';
    });
    
    workLabel.addEventListener('click', function() {
        workLabel.classList.add('active');
        homeLabel.classList.remove('active');
        addressLabelInput.value = 'work';
    });
    
    streetAddress.addEventListener('input', function() {
        const input = this.value.toLowerCase();
        
        if (input.length < 2) {
            addressSuggestions.style.display = 'none';
            return;
        }
        
        const filteredAddresses = sampleAddresses.filter(addr => 
            addr.toLowerCase().includes(input)
        );
        
        if (filteredAddresses.length > 0) {
            addressSuggestions.innerHTML = '';
            filteredAddresses.forEach(addr => {
                const item = document.createElement('div');
                item.className = 'autocomplete-item';
                item.textContent = addr;
                
                item.addEventListener('click', function() {
                    streetAddress.value = addr;
                    addressSuggestions.style.display = 'none';
                });
                
                addressSuggestions.appendChild(item);
            });
            addressSuggestions.style.display = 'block';
        } else {
            addressSuggestions.style.display = 'none';
        }
    });
    
    document.addEventListener('click', function(e) {
        if (e.target !== streetAddress && e.target !== addressSuggestions) {
            addressSuggestions.style.display = 'none';
        }
    });
}

let currentEditId = null;
let currentSelection = {
    region: '',
    province: '',
    city: '',
    barangay: ''
};

function loadAddresses() {
    const addressesList = document.getElementById('addressesList');
    const savedAddresses = JSON.parse(localStorage.getItem('userAddresses')) || [];
    const defaultAddressId = localStorage.getItem('defaultAddressId');
    
    addressesList.innerHTML = '';
    
    if (savedAddresses.length === 0) {
        addressesList.innerHTML = '<p class="no-addresses">You have no saved addresses. Add a new address to get started.</p>';
        return;
    }
    
    savedAddresses.forEach(address => {
        const isDefault = address.id === defaultAddressId;
        const addressCard = document.createElement('div');
        addressCard.className = `address-card ${isDefault ? 'default' : ''}`;
        
        let locationText = '';
        if (address.region) {
            locationText = address.region;
            if (address.province) locationText += ', ' + address.province;
            if (address.city) locationText += ', ' + address.city;
            if (address.barangay) locationText += ', ' + address.barangay;
        } else if (address.region) {
            locationText = address.region;
        }
        
        addressCard.innerHTML = `
            <h3 class="address-name">${address.firstName} ${address.lastName}</h3>
            <p class="address-details">
                ${address.streetAddress || ''}<br>
                ${locationText}<br>
                ${address.postalCode}
          <p class="address-phone">${address.phoneNumber}</p>
            <div class="address-label ${address.label === 'home' ? 'home-label' : 'work-label'}">
                ${address.label === 'home' ? 'Home' : 'Work'}
            </div>
            ${isDefault ? '<div class="default-badge">Default</div>' : ''}
            <div class="address-actions">
                <button class="edit-btn" data-id="${address.id}">Edit</button>
                <button class="delete-btn" data-id="${address.id}">Delete</button>
                ${!isDefault ? `<button class="set-default-btn" data-id="${address.id}">Set as Default</button>` : ''}
            </div>
        `;
        
        addressesList.appendChild(addressCard);
    });
    
    addAddressButtonListeners();
}

function addAddressButtonListeners() {
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function() {
            const addressId = this.getAttribute('data-id');
            openAddressModal('edit', addressId);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const addressId = this.getAttribute('data-id');
            if (confirm('Are you sure you want to delete this address?')) {
                deleteAddress(addressId);
            }
        });
    });
    
    document.querySelectorAll('.set-default-btn').forEach(button => {
        button.addEventListener('click', function() {
            const addressId = this.getAttribute('data-id');
            setDefaultAddress(addressId);
        });
    });
}

function openAddressModal(mode, addressId = null) {
    const addressModal = document.getElementById('addressModal');
    const modalTitle = document.getElementById('addressModalTitle');
    const defaultAddressCheckbox = document.getElementById('defaultAddress');
    const saveButton = document.getElementById('saveAddressModal');
    
    resetAddressForm();
    
    if (mode === 'edit' && addressId) {
        modalTitle.textContent = 'Edit Address';
        currentEditId = addressId;
        
        const savedAddresses = JSON.parse(localStorage.getItem('userAddresses')) || [];
        const addressToEdit = savedAddresses.find(addr => addr.id === addressId);
        
        if (addressToEdit) {
            document.getElementById('firstName').value = addressToEdit.firstName || '';
            document.getElementById('lastName').value = addressToEdit.lastName || '';
            document.getElementById('phoneNumber').value = addressToEdit.phoneNumber || '';
            document.getElementById('postalCode').value = addressToEdit.postalCode || '';
            document.getElementById('streetAddress').value = addressToEdit.streetAddress || '';
            
            if (addressToEdit.label === 'work') {
                document.getElementById('workLabel').classList.add('active');
                document.getElementById('homeLabel').classList.remove('active');
                document.getElementById('addressLabel').value = 'work';
            } else {
                document.getElementById('homeLabel').classList.add('active');
                document.getElementById('workLabel').classList.remove('active');
                document.getElementById('addressLabel').value = 'home';
            }
            
            currentSelection = {
                region: addressToEdit.region || '',
                province: addressToEdit.province || '',
                city: addressToEdit.city || '',
                barangay: addressToEdit.barangay || ''
            };
            
            let locationText = '';
            if (currentSelection.region) {
                locationText = currentSelection.region;
                if (currentSelection.province) locationText += ', ' + currentSelection.province;
                if (currentSelection.city) locationText += ', ' + currentSelection.city;
                if (currentSelection.barangay) locationText += ', ' + currentSelection.barangay;
            } else {
                locationText = 'Region, Province, City, Barangay';
            }
            
            document.getElementById('selectedLocation').textContent = locationText;
            
            const defaultAddressId = localStorage.getItem('defaultAddressId');
            defaultAddressCheckbox.checked = addressId === defaultAddressId;
        }
    } else {
        modalTitle.textContent = 'Add New Address';
        currentEditId = null;
        defaultAddressCheckbox.checked = false;
    }
    
    addressModal.classList.add('active');
}

function resetAddressForm() {
    document.getElementById('firstName').value = '';
    document.getElementById('lastName').value = '';
    document.getElementById('phoneNumber').value = '';
    document.getElementById('postalCode').value = '';
    document.getElementById('streetAddress').value = '';
    document.getElementById('selectedLocation').textContent = 'Region, Province, City, Barangay';
    document.getElementById('homeLabel').classList.add('active');
    document.getElementById('workLabel').classList.remove('active');
    document.getElementById('addressLabel').value = 'home';
    document.getElementById('defaultAddress').checked = false;
    
    currentSelection = {
        region: '',
        province: '',
        city: '',
        barangay: ''
    };
}

function saveAddress() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const phoneNumber = document.getElementById('phoneNumber').value.trim();
    const postalCode = document.getElementById('postalCode').value.trim();
    const streetAddress = document.getElementById('streetAddress').value.trim();
    const addressLabel = document.getElementById('addressLabel').value;
    const setAsDefault = document.getElementById('defaultAddress').checked;
    
    if (!firstName || !lastName || !phoneNumber || !streetAddress) {
        alert('Please fill in all required fields');
        return;
    }
    
    if (!currentSelection.region) {
        alert('Please select your location');
        return;
    }
    
    let savedAddresses = JSON.parse(localStorage.getItem('userAddresses')) || [];
    
    if (currentEditId) {
        const index = savedAddresses.findIndex(addr => addr.id === currentEditId);
        
        if (index !== -1) {
            savedAddresses[index] = {
                ...savedAddresses[index],
                firstName,
                lastName,
                phoneNumber,
                postalCode,
                streetAddress,
                label: addressLabel,
                region: currentSelection.region,
                province: currentSelection.province,
                city: currentSelection.city,
                barangay: currentSelection.barangay
            };
        }
    } else {
        const newAddress = {
            id: 'addr_' + Date.now(), 
            firstName,
            lastName,
            phoneNumber,
            postalCode,
            streetAddress,
            label: addressLabel,
            region: currentSelection.region,
            province: currentSelection.province,
            city: currentSelection.city,
            barangay: currentSelection.barangay
        };
        
        savedAddresses.push(newAddress);
        
        if (savedAddresses.length === 1) {
            localStorage.setItem('defaultAddressId', newAddress.id);
        }
    }
    
    localStorage.setItem('userAddresses', JSON.stringify(savedAddresses));
    
    if (setAsDefault) {
        const addressId = currentEditId || savedAddresses[savedAddresses.length - 1].id;
        localStorage.setItem('defaultAddressId', addressId);
    }
    
    const statusMessage = document.getElementById('statusMessage');
    statusMessage.textContent = currentEditId ? 'Address updated successfully!' : 'New address added successfully!';
    statusMessage.classList.add('show');
    
    setTimeout(() => {
        statusMessage.classList.remove('show');
    }, 5000);
    
    document.getElementById('addressModal').classList.remove('active');
    
    loadAddresses();
}

function deleteAddress(addressId) {
    let savedAddresses = JSON.parse(localStorage.getItem('userAddresses')) || [];
    
    const defaultAddressId = localStorage.getItem('defaultAddressId');
    
    savedAddresses = savedAddresses.filter(addr => addr.id !== addressId);
    
    localStorage.setItem('userAddresses', JSON.stringify(savedAddresses));
    
    if (addressId === defaultAddressId && savedAddresses.length > 0) {
        localStorage.setItem('defaultAddressId', savedAddresses[0].id);
    } else if (savedAddresses.length === 0) {
        localStorage.removeItem('defaultAddressId');
    }
    
    const statusMessage = document.getElementById('statusMessage');
    statusMessage.textContent = 'Address deleted successfully!';
    statusMessage.classList.add('show');
    
    setTimeout(() => {
        statusMessage.classList.remove('show');
    }, 5000);
    
    loadAddresses();
}

function setDefaultAddress(addressId) {
    localStorage.setItem('defaultAddressId', addressId);
    
    const statusMessage = document.getElementById('statusMessage');
    statusMessage.textContent = 'Default address updated!';
    statusMessage.classList.add('show');
    
    setTimeout(() => {
        statusMessage.classList.remove('show');
    }, 5000);
    
    loadAddresses();
}

function updateUIForLoginStatus(isLoggedIn, username) {
    const usernameDisplay = document.getElementById('usernameDisplay');
    
    if (isLoggedIn && username) {
        usernameDisplay.textContent = username;
    } else {
        usernameDisplay.textContent = '';
    }
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    window.location.href = 'index.html';
}

document.getElementById('footerShopLink').addEventListener('click', function(e) {
    e.preventDefault();
    window.location.href = 'shop.html';
});

const homeLabel = document.getElementById('homeLabel');
const workLabel = document.getElementById('workLabel');
const addressLabelInput = document.getElementById('addressLabel');

homeLabel.addEventListener('click', function () {
    homeLabel.classList.add('active');
    workLabel.classList.remove('active');
    addressLabelInput.value = 'home';
});

workLabel.addEventListener('click', function () {
    workLabel.classList.add('active');
    homeLabel.classList.remove('active');
    addressLabelInput.value = 'work';
});