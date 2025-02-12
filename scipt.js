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
            { name: "Pedas", price: 5000 },
            { name: "Keju", price: 5000 }
        ]
    },
    {
        name: "🦏BLACK RHINO CHEESECAKE🦏",
        price: 5000,
        image: "kue.jpeg",
        description: "Kombinasi cheesecake lembut dan Oreo crunchy yang menghadirkan ledakan rasa sehebat kekuatan badak liar! Tekstur creamy berpadu dengan kelembutan keju dan kepingan Oreo yang kaya rasa, siap memanjakan lidahmu di setiap suapan! 🍰💥",
        isSoldOut: true // Ditandai sebagai sold out
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
const orderDateInput = document.getElementById("order-date");

let cart = [];
let totalPrice = 0;
let discount = 0;
let promoCode = "";

const minPurchase = 0; // Minimal pembelian, deklarasikan di sini

// Data promo (contoh)
const promoCodes = {
    "ALUMNIMANDASI": { discount: 0.1, minPurchase: 60000 },
    "HEMAT5": { discount: 0.05, minPurchase: 50000 }
};


function renderMenuItems() {
    const classInputLabel = document.querySelector('label[for="class-input"]');
    if (classInputLabel) {
        classInputLabel.innerHTML = "<strong>Kelas / Alamat Lengkap:</strong>";
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
        }

        let itemContent = `
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

        if (item.isSoldOut) {
            menuItemDiv.classList.add("sold-out");
            itemContent = `
            <div class="img-container">
                <img src="${item.image}" alt="${item.name}" style="filter: grayscale(100%); opacity: 0.7;">
            </div>
            <h3><strong>${item.name}</strong></h3>
            <span class="price">Rp ${item.price.toLocaleString()}</span>
            <span class="description">${item.description}</span>
            ${optionsHTML}
            <input type="number" min="1" value="1" class="form-control quantity-input mb-2" id="quantity-${index}" disabled>
            <button class="btn btn-primary add-to-cart" data-name="${item.name}" data-index="${index}" disabled>Tambah</button>
            <p class="sold-out">SOLD OUT</p>
            `;
        }

        menuItemDiv.innerHTML = itemContent;
        menuItemsContainer.appendChild(menuItemDiv);
    });

    // Event listener untuk tombol "Tambah"
    const addToCartButtons = document.querySelectorAll(".add-to-cart");
    addToCartButtons.forEach(button => {
        button.addEventListener("click", () => {
            if (!button.disabled) {
                const itemIndex = button.dataset.index;
                const quantityInput = document.getElementById(`quantity-${itemIndex}`);
                const quantity = parseInt(quantityInput.value);
                const itemName = button.dataset.name;
                const selectedOptionElement = document.getElementById(`option-${itemIndex}`);
                const selectedOption = selectedOptionElement ? selectedOptionElement.value : null;
                addToCart(itemName, quantity, selectedOption);

                button.classList.add("clicked");
                setTimeout(() => {
                    button.classList.remove("clicked");
                }, 500);
            }
        });
    });
}

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

function removeFromCart(itemIndex) {
    const item = cart[itemIndex];
    if (item.quantity > 1) {
        item.quantity--;
    } else {
        cart.splice(itemIndex, 1);
    }
    updateCart();
}

function handleDelete(event) {
    const itemIndex = parseInt(event.target.dataset.index);
    removeFromCart(itemIndex);
}

function updateCart() {
    cartItemsContainer.innerHTML = "";
    totalPrice = 0;

    cart.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        totalPrice += subtotal;

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
        cartItemsContainer.appendChild(cartItemRow);

        cartItemRow.style.opacity = 0;
        cartItemRow.style.transform = 'translateX(-20px)';

        setTimeout(() => {
            cartItemRow.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            cartItemRow.style.opacity = 1;
            cartItemRow.style.transform = 'translateX(0)';
        }, 50 * index);
    });

    const discountAmount = totalPrice >= promoCodes[promoCode]?.minPurchase ? totalPrice * discount : 0;
    const finalPrice = totalPrice - discountAmount;

    const totalAmountElement = document.getElementById("total-amount");
    totalAmountElement.innerHTML = `
        <p>Subtotal: Rp ${totalPrice.toLocaleString()}</p>
        ${totalPrice >= promoCodes[promoCode]?.minPurchase ? `<p>Diskon (${promoCode}): Rp ${discountAmount.toLocaleString()}</p>` : ''}
        <p>Total Harga: Rp ${finalPrice.toLocaleString()}</p>
    `;

    const removeFromCartButtons = document.querySelectorAll(".remove-from-cart");
    removeFromCartButtons.forEach(button => {
        button.removeEventListener("click", handleDelete);
        button.addEventListener("click", handleDelete);
    });
}

clearCartButton.addEventListener("click", () => {
    cart = [];
    updateCart();
});

function applyPromoCode() {
    const promoCodeInput = document.getElementById("promo-code");
    const enteredPromoCode = promoCodeInput.value.toUpperCase();
    const promoModal = new bootstrap.Modal(document.getElementById('promoModal'));
    const modalTitle = document.getElementById('promoModalLabel');
    const modalBody = document.querySelector('.modal-body');

    if (promoCodes[enteredPromoCode]) {
        const selectedPromo = promoCodes[enteredPromoCode];
        if (totalPrice >= selectedPromo.minPurchase) {
            discount = selectedPromo.discount;
            promoCode = enteredPromoCode;

            modalTitle.innerHTML = '<i class="fas fa-check-circle text-success"></i> Kode Promo Berhasil!';
            modalBody.innerHTML = `
                <img src="verified.gif" alt="Success Icon" id="success-icon" width="80">
                <p class="mt-3">Selamat! Anda telah berhasil menggunakan kode promo <strong id="promo-code-display">${promoCode}</strong></p>
                <p>🎉 Selamat berbelanja! 🎉</p>
            `;
            promoModal.show();
            updateCart();
        } else {
            modalTitle.innerHTML = '<i class="fas fa-times-circle text-danger"></i> Kode Promo Tidak Valid!';
            modalBody.innerHTML = `
                <img src="X.gif" alt="Error Icon" id="error-icon" width="80">
                <p class="mt-3">Maaf, minimal pembelian untuk menggunakan kode promo ini adalah Rp ${selectedPromo.minPurchase.toLocaleString()}</p>
            `;
            promoModal.show();
            discount = 0;
            promoCode = "";
            updateCart();
        }
    } else {
        modalTitle.innerHTML = '<i class="fas fa-times-circle text-danger"></i> Kode Promo Tidak Valid!';
        modalBody.innerHTML = `
            <img src="X.gif" alt="Error Icon" id="error-icon" width="80">
            <p class="mt-3">MAAF, KODE PROMO TERSEBUT TIDAK BERLAKU</p>
        `;
        promoModal.show();
        discount = 0;
        promoCode = "";
        updateCart();
    }
}

const applyPromoButton = document.getElementById("apply-promo");
applyPromoButton.addEventListener("click", applyPromoCode);

sendToWaButton.addEventListener("click", () => {
    const customerName = customerNameInput.value;
    const className = classInput.value;
    const orderDate = orderDateInput.value;

    if (!customerName || !className || !orderDate) {
        alert("Harap isi nama pembeli, kelas / alamat lengkap, dan tanggal pemesanan!");
        return;
    }

    // Hitung total harga setelah diskon
    const discountAmount = totalPrice >= minPurchase ? totalPrice * discount : 0;
    const finalPrice = totalPrice - discountAmount;

    // Format pesan yang lebih rapi
    let message = `
*== PESANAN BARU ==*
*Nama Pembeli:* ${customerName}
*Kelas / Alamat Lengkap:* ${className}
*Untuk Tanggal:* ${orderDate}

*Detail Pesanan:*
${cart.map(item => `• *${item.name}* ${item.option ? `(${item.option})` : ''} - ${item.quantity} x Rp ${item.price.toLocaleString()}`).join('\n')}

*Subtotal:* Rp ${totalPrice.toLocaleString()}
${totalPrice >= minPurchase ? `*Diskon (${promoCode}):* Rp ${discountAmount.toLocaleString()}` : ''}
*Total Harga:* *Rp ${finalPrice.toLocaleString()}*

Terima kasih sudah memesan 🙏
    `;

    const encodedMessage = encodeURIComponent(message);
    const waLink = `https://wa.me/6283806048192?text=${encodedMessage}`; // Ganti nomor WA di sini
    window.open(waLink, "_blank");
});


renderMenuItems();
