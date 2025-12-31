const products = {
    strains: [
        {
            id: 1,
            name: "Jungle Diamond",
            price: 120,
            type: "Indica",
            image: "images/strains/download.jpg",
            desc: ["Relaxing body high", "Earthy aroma", "Evening use"]
        },
        {
            id: 2,
            name: "Blue Dream",
            price: 110,
            type: "Hybrid",
            image: "images/strains/og-kush.png",
            desc: ["Creative boost", "Sweet berry notes", "Daytime friendly"]
        },
        {
            id: 3,
            name: "Gelato",
            price: 130,
            type: "Hybrid",
            image: "images/strains/og-kush.png",
            desc: ["Balanced effects", "Dessert flavor", "Smooth smoke"]
        },
        {
            id: 4,
            name: "Sour Diesel",
            price: 125,
            type: "Sativa",
            image: "images/strains/og-kush.png",
            desc: ["Energetic buzz", "Diesel aroma", "Creative focus"]
        }
    ],
    prerolls: [
        {
            id: 5,
            name: "Pre-Roll Pack",
            price: 80,
            type: "Premium",
            image: "https://via.placeholder.com/400x300?text=Pre-Rolls",
            desc: ["3 premium joints", "Ready to smoke", "Convenient"]
        },
        {
            id: 6,
            name: "Infused Pre-Roll",
            price: 95,
            type: "Strong",
            image: "https://via.placeholder.com/400x300?text=Infused+Pre-Roll",
            desc: ["Extra potency", "Kief coated", "Smooth burn"]
        }
    ],
    accessories: [
        {
            id: 7,
            name: "Glass Pipe",
            price: 45,
            type: "Accessory",
            image: "https://via.placeholder.com/400x300?text=Glass+Pipe",
            desc: ["Durable glass", "Easy to clean", "Portable"]
        },
        {
            id: 8,
            name: "Grinder",
            price: 35,
            type: "Accessory",
            image: "https://via.placeholder.com/400x300?text=Grinder",
            desc: ["4-piece design", "Sharp teeth", "Magnetic lid"]
        }
    ],
    bundles: [
        {
            id: 9,
            name: "Starter Bundle",
            price: 200,
            type: "Value Pack",
            image: "https://via.placeholder.com/400x300?text=Starter+Bundle",
            desc: ["2 strains + pipe", "Perfect for beginners", "Save 20%"]
        },
        {
            id: 10,
            name: "Premium Bundle",
            price: 350,
            type: "Deluxe Pack",
            image: "https://via.placeholder.com/400x300?text=Premium+Bundle",
            desc: ["4 strains + accessories", "Rolling papers included", "Save 30%"]
        }
    ]
};

const grid = document.getElementById("productGrid");
const modal = document.getElementById("modal");
const cartCount = document.getElementById("cartCount");
const categoryTitle = document.getElementById("categoryTitle");
const navButtons = document.querySelectorAll(".nav-btn");

let currentCategory = "strains";

/* ---------------- CART FUNCTIONS ---------------- */
function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCount.textContent = totalItems;
}

function addToCart(product) {
    let cart = getCart();
    let existing = cart.find(item => item.id === product.id);
    
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ 
            id: product.id, 
            name: product.name, 
            price: product.price, 
            qty: 1 
        });
    }
    
    saveCart(cart);
    
    // Show a quick confirmation
    cartCount.style.transform = "scale(1.3)";
    setTimeout(() => {
        cartCount.style.transform = "scale(1)";
    }, 300);
}

/* ---------------- CATEGORY SWITCHING ---------------- */
function switchCategory(category) {
    // Update active button
    navButtons.forEach(btn => {
        if (btn.dataset.category === category) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });
    
    // Update current category and title
    currentCategory = category;
    categoryTitle.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    
    // Render products for this category
    renderProducts(category);
}

/* ---------------- PRODUCT RENDERING ---------------- */
function renderProducts(category) {
    grid.innerHTML = "";
    
    const categoryProducts = products[category];
    
    if (categoryProducts.length === 0) {
        grid.innerHTML = `
            <div class="no-products">
                <i class="fas fa-box-open"></i>
                <h3>Coming Soon</h3>
                <p>Products in this category will be available soon!</p>
            </div>
        `;
        return;
    }
    
    categoryProducts.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";
        
        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-body">
                <span class="strain-type">${product.type}</span>
                <h3>${product.name}</h3>
                <div class="price">R ${product.price}</div>
                <div class="card-actions">
                    <button class="buy-btn">Add to Cart</button>
                    <button class="info-btn">Info</button>
                </div>
            </div>
        `;
        
        // Add event listeners
        const buyBtn = card.querySelector(".buy-btn");
        const infoBtn = card.querySelector(".info-btn");
        
        buyBtn.addEventListener("click", () => addToCart(product));
        infoBtn.addEventListener("click", () => openModal(product));
        
        grid.appendChild(card);
    });
}

/* ---------------- MODAL FUNCTIONS ---------------- */
function openModal(product) {
    modal.classList.add("active");
    
    // Set modal content
    document.getElementById("modalImage").src = product.image;
    document.getElementById("modalImage").alt = product.name;
    document.getElementById("modalName").textContent = product.name;
    document.getElementById("modalType").textContent = product.type;
    document.getElementById("modalPrice").textContent = "R " + product.price;
    
    // Clear and populate description list
    const descList = document.getElementById("modalDesc");
    descList.innerHTML = "";
    
    product.desc.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        descList.appendChild(li);
    });
}

/* ---------------- EVENT LISTENERS ---------------- */
// Category button click handlers
navButtons.forEach(button => {
    button.addEventListener("click", () => {
        const category = button.dataset.category;
        switchCategory(category);
    });
});

// Modal close handlers
document.querySelector(".close-modal").addEventListener("click", () => {
    modal.classList.remove("active");
});

modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.classList.remove("active");
    }
});


/* ---------------- INITIALIZATION ---------------- */
// Initialize cart count on page load
updateCartCount();

// Initialize with strains category
renderProducts(currentCategory);

// Add CSS for no-products message
const style = document.createElement('style');
style.textContent = `
    .no-products {
        grid-column: 1 / -1;
        text-align: center;
        padding: 40px;
        color: #666;
    }
    
    .no-products i {
        font-size: 48px;
        margin-bottom: 20px;
        color: #333;
    }
    
    .no-products h3 {
        margin-bottom: 10px;
        color: #777;
    }
`;
document.head.appendChild(style);