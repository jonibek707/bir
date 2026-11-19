
const drinks = [
    {
        id: 1,
        name: "Cappuccino",
        price: 25000,
        description: "Mayin sut ko'pigi va kuchli espresso.",
        img: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=700&q=85"
    },
    {
        id: 2,
        name: "Latte",
        price: 28000,
        description: "Sut va espresso uyg'unligidagi ajoyib ta'm.",
        img: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=700&q=85"
    },
    {
        id: 3,
        name: "Americano",
        price: 20000,
        description: "Klassik qora qahva, kuchli va mazali.",
        img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=700&q=85"
    },
    {
        id: 4,
        name: "Espresso",
        price: 18000,
        description: "Haqiqiy qahva ixlosmandlari uchun.",
        img: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?auto=format&fit=crop&w=700&q=85"
    },
    {
        id: 5,
        name: "Mocha",
        price: 30000,
        description: "Shokolad va qahvaning mazali uyg'unligi.",
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrQFaVd1CpddbxavH0_Nz19M-1ThJcsii8gV7oKzXeBg&s=10"
    },
    {
        id: 6,
        name: "Iced Coffee",
        price: 27000,
        description: "Muzdek va tetiklashtiruvchi qahva.",
        img: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=700&q=85"
    },
    {
        id: 7,
        name: "Caramel Latte",
        price: 32000,
        description: "Karamel siropi va mayin sutli qahva.",
        img: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=700&q=85"
    },
    {
        id: 8,
        name: "Black Coffee",
        price: 22000,
        description: "Tabiiy qahva donlaridan tayyorlangan.",
        img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=700&q=85"
    }
];

// ELEMENTLAR

const drinkList = document.getElementById("drinkList");
const basketCount = document.getElementById("basketCount");
const basketPanel = document.getElementById("basketPanel");
const basketItems = document.getElementById("basketItems");
const basketEmpty = document.getElementById("basketEmpty");
const basketBottom = document.getElementById("basketBottom");
const overlay = document.getElementById("overlay");
const searchInput = document.getElementById("searchInput");

let basket = JSON.parse(localStorage.getItem("coffeeBasket")) || [];

// NARX FORMATLASH

function formatPrice(price) {
    return price.toLocaleString("uz-UZ") + " so'm";
}

// MAHSULOTLARNI CHIQARISH

function showDrinks(products = drinks) {
    drinkList.innerHTML = "";

    document.getElementById("emptySearch").style.display =
        products.length === 0 ? "block" : "none";

    products.forEach((drink, index) => {
        const card = document.createElement("article");
        card.className = "drink-card";

        card.innerHTML = `
            <span class="product-number">0${index + 1}</span>

            <img src="${drink.img}" alt="${drink.name}">

            <div class="product-info">
                <h3>${drink.name}</h3>
                <p>${drink.description}</p>

                <div class="product-price">
                    ${formatPrice(drink.price)}
                </div>

                <button class="add-button">
                    + SAVATGA QO'SHISH
                </button>
            </div>
        `;

        card.querySelector(".add-button").addEventListener("click", () => {
            addToBasket(drink.id);
        });

        drinkList.appendChild(card);
    });
}

// SAVATGA QO'SHISH

function addToBasket(id) {
    const product = drinks.find(item => item.id === id);

    const existing = basket.find(item => item.id === id);

    if (existing) {
        existing.quantity++;
    } else {
        basket.push({
            ...product,
            quantity: 1
        });
    }

    saveBasket();
    showBasket();
}

// SAVATNI SAQLASH

function saveBasket() {
    localStorage.setItem("coffeeBasket", JSON.stringify(basket));
}

// SAVATNI KO'RSATISH

function showBasket() {
    basketItems.innerHTML = "";

    let total = 0;
    let quantityTotal = 0;

    basket.forEach((item, index) => {
        total += item.price * item.quantity;
        quantityTotal += item.quantity;

        const card = document.createElement("div");
        card.className = "basket-card";

        card.innerHTML = `
            <img src="${item.img}" alt="${item.name}">

            <div class="basket-details">
                <h3>${item.name}</h3>

                <p>${formatPrice(item.price * item.quantity)}</p>

                <div class="quantity">
                    <button class="minus">−</button>
                    <span>${item.quantity}</span>
                    <button class="plus">+</button>
                </div>
            </div>

            <button class="remove-item" title="O'chirish">×</button>
        `;

        card.querySelector(".minus").addEventListener("click", () => {
            changeQuantity(item.id, -1);
        });

        card.querySelector(".plus").addEventListener("click", () => {
            changeQuantity(item.id, 1);
        });

        card.querySelector(".remove-item").addEventListener("click", () => {
            removeItem(item.id);
        });

        basketItems.appendChild(card);
    });

    basketCount.textContent = quantityTotal;
    document.getElementById("totalCount").textContent = quantityTotal;
    document.getElementById("totalPrice").textContent = formatPrice(total);

    basketEmpty.classList.toggle("show", basket.length === 0);
    basketBottom.style.display = basket.length === 0 ? "none" : "block";
}

// MAHSULOT MIQDORINI O'ZGARTIRISH

function changeQuantity(id, amount) {
    const item = basket.find(product => product.id === id);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        basket = basket.filter(product => product.id !== id);
    }

    saveBasket();
    showBasket();
}

// BITTA MAHSULOTNI O'CHIRISH

function removeItem(id) {
    basket = basket.filter(item => item.id !== id);

    saveBasket();
    showBasket();
}

// SAVATNI TOZALASH

document.getElementById("clearBasket").addEventListener("click", () => {
    if (basket.length === 0) return;

    const answer = confirm("Savatchani tozalashni xohlaysizmi?");

    if (answer) {
        basket = [];
        saveBasket();
        showBasket();
    }
});

// SAVATNI OCHISH

function openBasket() {
    basketPanel.classList.add("active");
    overlay.classList.add("active");
    document.body.classList.add("no-scroll");
}

function closeBasket() {
    basketPanel.classList.remove("active");
    overlay.classList.remove("active");
    document.body.classList.remove("no-scroll");
}

document.getElementById("basketToggle").addEventListener("click", openBasket);

document.getElementById("closeBasket").addEventListener("click", closeBasket);

overlay.addEventListener("click", closeBasket);

document.getElementById("continueShopping").addEventListener("click", closeBasket);

// QIDIRUV

searchInput.addEventListener("input", () => {
    const value = searchInput.value.toLowerCase().trim();

    const filtered = drinks.filter(item =>
        item.name.toLowerCase().includes(value) ||
        item.description.toLowerCase().includes(value)
    );

    showDrinks(filtered);
});

// BUYURTMA

document.getElementById("checkoutButton").addEventListener("click", () => {
    if (basket.length === 0) return;

    let message = "SAYYORBEK COFFEE - BUYURTMA\n\n";

    basket.forEach(item => {
        message += `${item.name} x ${item.quantity} = ${formatPrice(item.price * item.quantity)}\n`;
    });

    const total = basket.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    message += `\nJAMI: ${formatPrice(total)}`;

    alert(message + "\n\nBuyurtmangiz tayyorlandi!");

});

// BOSHLANG'ICH HOLAT

showDrinks();
showBasket();
