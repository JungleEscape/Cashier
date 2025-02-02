const menuItemsData = [
    {
        name: "🌀JUMANJI WILD ROLL🌀",
        price: 12000,
        image: "kimab.jpeg",
        description: "Kimbap ayam suwir yang menggoda dengan sentuhan bumbu rahasia, menghadirkan sensasi gurih, pedas, dan manis dalam setiap gigitan. Dibungkus dengan rumput laut yang renyah dan nasi lembut, menu ini siap membawamu ke petualangan rasa yang tak terlupakan! 🌿🔥.",
    },
    {
        name: "🔥SPICY FURY ROLL🔥",
        price: 5000,
        image: "samyang.jpeg",
        description: "Sensasi pedas yang mengguncang! Samyang super pedas dibalut dengan rice paper kenyal.",
        options: [
            { name: "Spicy Nori", price: 5000 },
            { name: "Carbonara", price: 5000 }
        ]
    },
    {
        name: "🦏BLACK RHINO CHEESECAKE🦏",
        price: 5000,
        image: "kue.jpeg",
        description: "Kombinasi cheesecake lembut dan Oreo crunchy yang menghadirkan ledakan rasa sehebat kekuatan badak liar! Tekstur creamy berpadu dengan kelembutan keju dan kepingan Oreo yang kaya rasa, siap memanjakan lidahmu di setiap suapan! 🍰💥",
    },
    {
        name: "🌴TROPICAL QUEST🌴",
        price: 8000,
        image: "mangga.jpeg",
        description: "Minuman tropis yang menyegarkan, memadukan es jeruk segar, nata de coco kenyal, dan biji selasih eksotis.",
        options: [
            { name: "Mangga", price: 8000 },
            { name: "Jeruk Peras", price: 8000 },
            { name: "Milky Orange", price: 8000 }
        ]
    },
    {
        name: "🍃SAVANNA SWIRL🍃",
        price: 8000,
        image: "oreominum.jpeg",
        description: "Nikmati kelembutan milk tea yang creamy berpadu dengan remahan Oreo renyah, menciptakan sensasi segar seperti angin sejuk yang berembus di padang savana. Setiap tegukan menghadirkan keseimbangan rasa manis yang pas, bikin mood langsung naik! 🏜️❄️",
    }
];

const menuItemsContainer = document.querySelector(".menu-items");
const cartItemsContainer = document.getElementById("cart-items");
const clearCartButton = document.getElementById("clear-cart");
const customerNameInput = document.getElementById("customer-name");
const classInput = document.getElementById("class-input");
const sendToWaButton = document.getElementById("send-to-wa");

let cart = [];
let totalPrice = 0;
let discount = 0; // Variabel untuk menyimpan nilai diskon
let promoCode = ""; // Variabel untuk menyimpan kode promo yang valid

// Data promo
const promoCodes = {
    "JUNGLEESCAPEQUESTWINNER": 0.3, 
};

// Menampilkan item menu
function renderMenuItems() {
    const tableNumberLabel = document.querySelector('label[for="table-number"]');
    if (tableNumberLabel) {
        tableNumberLabel.textContent = "Kelas:";
    }

    menuItemsData.forEach((item, index) => {
        const menuItemDiv = document.createElement("div");
        menuItemDiv.classList.add("menu-item");

        let optionsHTML = '';
        if (item.options) {
            optionsHTML = `
                <p class="pilih-rasa"><strong>Pilih Rasa:</strong></p>
                <select class="form-select mb-2" id="option-${index}">
                    ${item.options.map(option => `<option value="${option.name}">${option.name}</option>`).join('')}
                </select>
            `;
        } else {
            optionsHTML = ''; // Tetap kosong jika tidak ada pilihan
        }

        menuItemDiv.innerHTML = `
            <div class="img-container">
                <img src="${item.image}" alt="${item.name}">
            </div>
             <h3><strong>${item.name}</strong></h3>
            <span class="price">Rp ${item.price.toLocaleString()}</span>
            <span class="description">${item.description}</span>
            ${optionsHTML}
            <input type="number" min="1" value="1" class="form-control quantity-input mb-2" id="quantity-${index}">
            <button class="btn btn-primary add-to-cart" data-name="${item.name}" data-index="${index}">Tambah</button>
        `;
        menuItemsContainer.appendChild(menuItemDiv);
    });

    // Event listener untuk tombol "Tambah"
    const addToCartButtons = document.querySelectorAll(".add-to-cart");
    addToCartButtons.forEach(button => {
        button.addEventListener("click", () => {
            const itemIndex = button.dataset.index;
            const quantityInput = document.getElementById(`quantity-${itemIndex}`);
            const quantity = parseInt(quantityInput.value);
            const itemName = button.dataset.name;
            // Mendapatkan nilai opsi yang dipilih, bisa null jika tidak ada elemen select
            const selectedOptionElement = document.getElementById(`option-${itemIndex}`);
            const selectedOption = selectedOptionElement ? selectedOptionElement.value : null;
            addToCart(itemName, quantity, selectedOption);

            // Menambahkan class 'clicked' untuk animasi pulsate
            button.classList.add("clicked");
            setTimeout(() => {
                button.classList.remove("clicked");
            }, 500); // Menghapus class 'clicked' setelah 500ms
        });
    });
}

// Menambahkan item ke keranjang
function addToCart(itemName, quantity, selectedOption) {
    const item = menuItemsData.find(item => item.name === itemName);
    if (item) {
        const selectedOptionName = selectedOption || (item.options ? item.options[0].name : "");
        const selectedOptionPrice = selectedOptionName ? (item.options ? item.options.find(option => option.name === selectedOptionName).price : item.price) : item.price;

        const itemId = selectedOption ? `${itemName}-${selectedOptionName}` : itemName;

        const existingItem = cart.find(cartItem => cartItem.id === itemId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                ...item,
                id: itemId,
                quantity: quantity,
                option: selectedOptionName,
                price: selectedOptionPrice
            });
        }
        updateCart();
    }
}
// Mengurangi Qty item atau menghapus item dari keranjang
function removeFromCart(itemIndex) {
    const item = cart[itemIndex];

    if (item.quantity > 1) {
        item.quantity--; // Kurangi Qty sebanyak 1
    } else {
        cart.splice(itemIndex, 1); // Hapus item jika Qty = 1
    }

    updateCart();
}

// Mengupdate tampilan keranjang dan total harga
function updateCart() {
    cartItemsContainer.innerHTML = "";
    totalPrice = 0;

    cart.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        totalPrice += subtotal;

        // Menampilkan nama item dengan pilihan rasa (jika ada)
        const itemNameWithOption = item.option ? `${item.name} (${item.option})` : item.name;

        const cartItemRow = document.createElement("tr");
        cartItemRow.innerHTML = `
            <td> ${itemNameWithOption}</td>
            <td>${item.quantity}</td>
            <td>Rp ${item.price.toLocaleString()}</td>
            <td>Rp ${subtotal.toLocaleString()}</td>
            <td>
                <button class="btn btn-sm btn-danger remove-from-cart" data-index="${index}">Hapus</button>
            </td>
        `;

        // Menambahkan animasi (contoh: fadeIn dan slide dari kiri)
        cartItemRow.style.opacity = 0;
        cartItemRow.style.transform = 'translateX(-20px)';
        cartItemsContainer.appendChild(cartItemRow);

        // Animasi dengan sedikit delay
        setTimeout(() => {
            cartItemRow.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            cartItemRow.style.opacity = 1;
            cartItemRow.style.transform = 'translateX(0)';
        }, 50 * index); // Delay berdasarkan index item
    });

    // Hitung diskon
    const discountAmount = totalPrice * discount;
    const finalPrice = totalPrice - discountAmount;

    // Menampilkan total harga dan diskon
    const totalAmountElement = document.getElementById("total-amount");
    totalAmountElement.innerHTML = `
        <p>Subtotal: Rp ${totalPrice.toLocaleString()}</p>
        <p>Diskon (${promoCode}): Rp ${discountAmount.toLocaleString()}</p>
        <p>Total Harga: Rp ${finalPrice.toLocaleString()}</p>
    `;

    // Event listener untuk tombol "Hapus" pada keranjang
    const removeFromCartButtons = document.querySelectorAll(".remove-from-cart");
    removeFromCartButtons.forEach(button => {
        button.addEventListener("click", () => {
            const itemIndex = parseInt(button.dataset.index);
            removeFromCart(itemIndex);
        });
    });
}

// Mengosongkan keranjang
clearCartButton.addEventListener("click", () => {
    cart = [];
    updateCart();
});

// Menerapkan kode promo
function applyPromoCode() {
    const promoCodeInput = document.getElementById("promo-code");
    const enteredPromoCode = promoCodeInput.value.toUpperCase();

    if (promoCodes[enteredPromoCode]) {
        discount = promoCodes[enteredPromoCode];
        promoCode = enteredPromoCode;

        // Menampilkan modal
        const promoModal = new bootstrap.Modal(document.getElementById('promoModal'));
        document.getElementById("promo-code-display").textContent = promoCode;
        promoModal.show();

        updateCart();
    } else {
        alert("MAAF, KODE PROMO TERSEBUT TIDAK BERLAKU");
        discount = 0;
        promoCode = "";
        updateCart();
    }
}

// Event listener untuk tombol "Terapkan"
const applyPromoButton = document.getElementById("apply-promo");
applyPromoButton.addEventListener("click", applyPromoCode);

// Mengirim data ke WhatsApp
sendToWaButton.addEventListener("click", () => {
    const customerName = customerNameInput.value;
    const className = classInput.value;

    if (!customerName || !className) {
        alert("Harap isi nama pembeli dan kelas!");
        return;
    }

    // Hitung total harga setelah diskon
    const discountAmount = totalPrice * discount;
    const finalPrice = totalPrice - discountAmount;

    // Format pesan yang lebih rapi
    let message = `
    *== PESANAN BARU ==*
    *Nama Pembeli:* ${customerName}
    *Kelas:* ${className}
    
    *Detail Pesanan:*
    ${cart.map(item => `• ${item.name} ${item.option ? `(${item.option})` : ''} - ${item.quantity} x Rp ${item.price.toLocaleString()}`).join('\n')}
    
    *Subtotal:* Rp ${totalPrice.toLocaleString()}
    *Diskon (${promoCode}):* Rp ${discountAmount.toLocaleString()}
    *Total Harga:* *Rp ${finalPrice.toLocaleString()}*
    
    Terima kasih sudah memesan 🙏
        `;
    const encodedMessage = encodeURIComponent(message);
    const waLink = `https://wa.me/6285720616046?text=${encodedMessage}`; // Ganti nomor WA di sini
    window.open(waLink, "_blank");
});

// Inisialisasi
renderMenuItems();