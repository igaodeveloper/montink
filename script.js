// Global variables
let productData = null;
let selectedVariants = {};
let currentQuantity = 1;

// DOM Elements
const productTitle = document.getElementById('product-title');
const productPrice = document.getElementById('product-price');
const mainImage = document.getElementById('main-image');
const productVariants = document.querySelector('.product-variants');
const stockStatus = document.getElementById('stock-status');
const addToCartBtn = document.getElementById('add-to-cart');
const quantityElement = document.getElementById('quantity');
const decreaseBtn = document.getElementById('decrease-quantity');
const increaseBtn = document.getElementById('increase-quantity');

// Fetch product data from API
async function fetchProductData(productId = 1) {
    try {
        // Use product 1 by default, but can be changed to product 2
        const productUrl = productId === 1 
            ? 'https://empreender.nyc3.cdn.digitaloceanspaces.com/static/teste-prod-1.json'
            : 'https://empreender.nyc3.cdn.digitaloceanspaces.com/static/teste-prod-2.json';
        
        const response = await fetch(productUrl);
        
        if (!response.ok) {
            throw new Error('Failed to fetch product data');
        }
        
        productData = await response.json();
        renderProductData();
    } catch (error) {
        console.error('Error fetching product data:', error);
        showNotification('Erro ao carregar dados do produto', 'error');
    }
}

// Render product data on the page
function renderProductData() {
    if (!productData) return;
    
    // Set product title
    productTitle.textContent = productData.title;
    
    // Set main product image
    mainImage.src = productData.image_url;
    mainImage.alt = productData.title;
    
    // Set initial price (will update based on variant selection)
    updatePrice();
    
    // Render variant options
    renderVariants();
    
    // Update stock status
    updateStockStatus();
    
    // Setup event listeners
    setupEventListeners();
}

// Render variant options (color, size, etc.)
function renderVariants() {
    if (!productData || !productData.options || !productData.values) return;
    
    // Clear existing variants
    productVariants.innerHTML = '';
    
    // For each variant type (color, size, etc.)
    productData.options.forEach((option, index) => {
        const variantValues = productData.values[index];
        
        if (!variantValues || variantValues.length === 0) return;
        
        // Create variant group
        const variantGroup = document.createElement('div');
        variantGroup.classList.add('variant-group');
        
        // Create variant title
        const variantTitle = document.createElement('span');
        variantTitle.classList.add('variant-title');
        variantTitle.textContent = option;
        
        // Create variant options container
        const variantOptions = document.createElement('div');
        variantOptions.classList.add('variant-options');
        
        // Create each variant option
        variantValues.forEach(value => {
            const variantOption = document.createElement('div');
            
            // Special handling for color variants
            if (option.toLowerCase() === 'cor') {
                variantOption.classList.add('color-option');
                variantOption.style.backgroundColor = getColorCode(value);
                variantOption.setAttribute('title', value);
            } else {
                variantOption.classList.add('variant-option');
                variantOption.textContent = value;
            }
            
            // Set data attributes
            variantOption.setAttribute('data-option', option);
            variantOption.setAttribute('data-value', value);
            
            // Add click event
            variantOption.addEventListener('click', () => selectVariant(option, value, variantOption, variantOptions));
            
            variantOptions.appendChild(variantOption);
        });
        
        // Append elements to variant group
        variantGroup.appendChild(variantTitle);
        variantGroup.appendChild(variantOptions);
        
        // Append variant group to product variants
        productVariants.appendChild(variantGroup);
    });
}

// Helper function to get color code from color name
function getColorCode(colorName) {
    const colorMap = {
        'Preto': '#000000',
        'Branco': '#FFFFFF',
        'Azul': '#0066FF',
        'Vermelho': '#FF0000',
        'Verde': '#00A651',
        'Amarelo': '#FFCC00',
        'Roxo': '#8A2BE2',
        'Cinza': '#919191'
    };
    
    return colorMap[colorName] || '#CCCCCC';
}

// Handle variant selection
function selectVariant(option, value, element, container) {
    // Remove selected class from all options in the container
    container.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
    
    // Add selected class to clicked element
    element.classList.add('selected');
    
    // Update selected variants
    selectedVariants[option] = value;
    
    // Update price based on selected variant
    updatePrice();
    
    // Update stock status
    updateStockStatus();
    
    // Update main image if variant has a different image
    updateVariantImage();
}

// Update price based on selected variant
function updatePrice() {
    if (!productData || !productData.variants) return;
    
    // Find the matching variant based on selected options
    const matchingVariant = findMatchingVariant();
    
    if (matchingVariant) {
        // Format price
        const price = parseFloat(matchingVariant.price);
        productPrice.textContent = formatPrice(price);
    } else {
        // If no matching variant found, use the first variant's price
        const defaultPrice = parseFloat(productData.variants[0].price);
        productPrice.textContent = formatPrice(defaultPrice);
    }
}

// Update main image if variant has a different image
function updateVariantImage() {
    if (!productData || !productData.variants) return;
    
    const matchingVariant = findMatchingVariant();
    
    if (matchingVariant && matchingVariant.image_url) {
        mainImage.src = matchingVariant.image_url;
    } else {
        // Reset to default product image
        mainImage.src = productData.image_url;
    }
}

// Find matching variant based on selected options
function findMatchingVariant() {
    if (!productData || !productData.variants || !productData.options) return null;
    
    // Get all selected variant values in order
    const selectedValues = productData.options.map(option => selectedVariants[option] || null);
    
    // If not all variants are selected, return null
    if (selectedValues.includes(null)) return null;
    
    // Find matching variant
    return productData.variants.find(variant => {
        // Compare each value in the variant with selected values
        return JSON.stringify(variant.values) === JSON.stringify(selectedValues);
    });
}

// Update stock status based on selected variant
function updateStockStatus() {
    const matchingVariant = findMatchingVariant();
    
    if (!matchingVariant) {
        // Check which options are missing
        const missingOptions = [];
        if (productData && productData.options) {
            productData.options.forEach(option => {
                if (!selectedVariants[option]) {
                    missingOptions.push(option);
                }
            });
        }
        
        if (missingOptions.length > 0) {
            stockStatus.textContent = `Selecione ${missingOptions.join(', ')} para verificar disponibilidade`;
        } else {
            stockStatus.textContent = 'Selecione as opções para verificar disponibilidade';
        }
        
        stockStatus.className = '';
        addToCartBtn.disabled = true;
        return;
    }
    
    const inventory = matchingVariant.inventory_quantity || 0;
    
    if (inventory > 0) {
        stockStatus.textContent = `Em estoque (${inventory} unidades)`;
        stockStatus.className = 'in-stock';
        addToCartBtn.disabled = false;
    } else {
        stockStatus.textContent = 'Fora de estoque';
        stockStatus.className = 'out-of-stock';
        addToCartBtn.disabled = true;
    }
}

// Format price to Brazilian Real
function formatPrice(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

// Setup event listeners
function setupEventListeners() {
    // Add to cart button
    addToCartBtn.addEventListener('click', addToCart);
    
    // Quantity buttons
    decreaseBtn.addEventListener('click', decreaseQuantity);
    increaseBtn.addEventListener('click', increaseQuantity);
}

// Handle add to cart
function addToCart() {
    const matchingVariant = findMatchingVariant();
    
    if (!matchingVariant) {
        showNotification('Por favor, selecione todas as opções', 'error');
        return;
    }
    
    if (matchingVariant.inventory_quantity <= 0) {
        showNotification('Produto fora de estoque', 'error');
        return;
    }
    
    // Prepare data for checkout
    const checkoutData = [{
        values: matchingVariant.values,
        quantity: currentQuantity,
        product_id: productData.id,
        variant_id: matchingVariant.id
    }];
    
    // Send data to checkout API
    sendToCheckout(checkoutData);
    
    // Show success notification
    showNotification('Produto adicionado ao carrinho!', 'success');
    
    // Update cart count
    updateCartCount(currentQuantity);
}

// Send data to checkout API
async function sendToCheckout(checkoutData) {
    try {
        // Due to CORS restrictions, we'll log the data that would be sent to the API
        console.log('Data that would be sent to checkout API:', checkoutData);
        
        // In a real-world scenario, we would either:
        // 1. Use a proxy server to handle the CORS issue
        // 2. Implement the API with proper CORS headers
        // 3. Use a server-side solution
        
        // For this demo, we'll simulate a successful checkout
        return {
            success: true,
            message: 'Checkout simulated successfully',
            data: checkoutData
        };
    } catch (error) {
        console.error('Error sending data to checkout:', error);
        showNotification('Erro ao enviar dados para checkout', 'error');
    }
}

// Update cart count
function updateCartCount(quantity) {
    const cartCount = document.querySelector('.cart-count');
    const currentCount = parseInt(cartCount.textContent) || 0;
    cartCount.textContent = currentCount + quantity;
}

// Handle quantity changes
function decreaseQuantity() {
    if (currentQuantity > 1) {
        currentQuantity--;
        quantityElement.textContent = currentQuantity;
    }
}

function increaseQuantity() {
    currentQuantity++;
    quantityElement.textContent = currentQuantity;
}

// Show notification
function showNotification(message, type = 'success') {
    // Create notification element if it doesn't exist
    let notification = document.querySelector('.notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.classList.add('notification');
        document.body.appendChild(notification);
    }
    
    // Set notification content and style
    notification.textContent = message;
    notification.className = 'notification';
    
    if (type === 'error') {
        notification.style.backgroundColor = '#dc3545';
    } else {
        notification.style.backgroundColor = '#28a745';
    }
    
    // Add icon to notification
    const icon = document.createElement('span');
    icon.innerHTML = type === 'error' 
        ? '&#9888;' // Warning icon
        : '&#10004;'; // Checkmark icon
    icon.style.marginRight = '8px';
    icon.style.fontWeight = 'bold';
    
    notification.prepend(icon);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Fetch product data (default to product 1)
    fetchProductData(1);
});
