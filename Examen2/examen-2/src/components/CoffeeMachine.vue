<template>
    <div class="vending-machine">
        <h1 class="machine-title">Coffeely: Tu Máquina de Café Perfecto</h1>

        <div class="machine-content">
            <div class="product-display">
                <div v-for="coffee in coffees" :key="coffee.id" class="product-slot">
                    <img :src="require(`@/assets/${coffee.image}`)" :alt="`Imagen de ${coffee.name}`" class="product-image" />
                    <h3 class="product-name">{{ coffee.name }}</h3>
                    <p class="product-price">Precio: ₡{{ coffee.price }}</p>
                    <p v-if="coffee.quantity > 0" class="product-quantity">Disponible: {{ coffee.quantity }}</p>
                    <p v-else class="sold-out">Agotado</p>
                    <div class="input-container">
                        <input type="number" min="1" v-model.number="coffee.selectedQuantity" class="quantity-input" placeholder="Cantidad"/>
                        <button class="buy-button" @click="addToCart(coffee)">Agregar</button>
                    </div>
                </div>
            </div>

            <div class="info-panel">
                <h2 class="info-title">Información de la compra</h2>
                <div class="selected-items">
                    <p v-for="item in cartItems" :key="item.id" class="purchase-item">
                        {{ item.name }} x{{ item.quantity }} - ₡{{ item.total }}
                    </p>
                    <p v-if="cartItems.length > 0" class="total-amount">
                        Total: ₡{{ calculateTotal() }}
                    </p>
                </div>
                <div class="payment-section">
                    <h2 class="payment-title">Ingreso de Dinero</h2>
                    <div class="payment-buttons">
                        <button class="money-button" @click="insertMoney(1000)">Billete ₡1000</button>
                        <button class="money-button" @click="insertMoney(500)">Moneda ₡500</button>
                        <button class="money-button" @click="insertMoney(100)">Moneda ₡100</button>
                        <button class="money-button" @click="insertMoney(50)">Moneda ₡50</button>
                        <button class="money-button" @click="insertMoney(25)">Moneda ₡25</button>
                    </div>
                    <p class="total-money">Total Ingresado: ₡{{ insertedMoney }}</p>
                    <p class="change-message" v-if="changeMessage !== null">
                        {{ changeMessage }}
                    </p>
                    <ul class="change-breakdown" v-if="changeBreakdown.length > 0">
                        <li v-for="(amount, index) in changeBreakdown" :key="index">
                            {{ amount }}
                        </li>
                    </ul>
                </div>
                <div>
                    <button v-if="hasCoins()" class="money-button" @click="completePurchase">Finalizar Compra</button>
                    <p v-else class="out-of-service-message">Fuera de servicio: No hay monedas suficientes.</p>
                </div>
            </div>
        </div>

        <h2 class="tray-title">Retire Aquí</h2>

        <div class="product-tray">
            <div class="arrow-container">
                <div class="arrow"></div>
                <div class="arrow"></div>
                <div class="arrow"></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "VendingMachine",
    data() {
        return {
            coffees: [
                { id: 1, name: "Americano", price: 950, image: "CafeAmericano.png", quantity: 10, selectedQuantity: 1 },
                { id: 2, name: "Capuchino", price: 1200, image: "Capuchino.png", quantity: 8, selectedQuantity: 1 },
                { id: 3, name: "Late", price: 1350, image: "Late.png", quantity: 10, selectedQuantity: 1 },
                { id: 4, name: "Mocachino", price: 1500, image: "Mocachino.png", quantity: 15, selectedQuantity: 1 },
            ],
            cartItems: [],
            insertedMoney: 0,
            coins: { 500: 20, 100: 30, 50: 50, 25: 25 },
            changeMessage: null,
            changeBreakdown: [],
        };
    },
    methods: {
        addToCart(coffee) {
            if (!this.validateCart(coffee)) return;

            coffee.quantity -= coffee.selectedQuantity;

            const existingItem = this.cartItems.find(item => item.id === coffee.id);
            if (existingItem) {
                this.updateCartItem(existingItem, coffee);
            } else {
                this.addNewItemToCart(coffee);
            }

            coffee.selectedQuantity = 1;
        },
        validateCart(coffee) {
            if (coffee.selectedQuantity <= 0) {
                alert("La cantidad debe ser mayor a 0.");
                coffee.selectedQuantity = 1;
                return false;
            }
            if (coffee.quantity < coffee.selectedQuantity) {
                alert("No hay suficiente cantidad disponible.");
                coffee.selectedQuantity = 1;
                return false;
            }
            return true;
        },
        updateCartItem(existingItem, coffee) {
            existingItem.quantity += coffee.selectedQuantity;
            existingItem.total += coffee.selectedQuantity * coffee.price;
        },
        addNewItemToCart(coffee) {
            this.cartItems.push({
                id: coffee.id,
                name: coffee.name,
                quantity: coffee.selectedQuantity,
                total: coffee.selectedQuantity * coffee.price,
            });
        },
        calculateTotal() {
            return this.cartItems.reduce((total, item) => total + item.total, 0);
        },
        insertMoney(amount) {
            this.insertedMoney += amount;
        },
        completePurchase() {
            const total = this.calculateTotal();
            const change = this.insertedMoney - total;

            if (change < 0) {
                this.changeMessage = "Dinero insuficiente. Por favor, ingrese más dinero.";
                this.changeBreakdown = [];
                return;
            }

            const changeDetails = this.calculateChange(change);
            if (!changeDetails) {
                this.changeMessage = "Fallo al realizar la compra: No hay monedas suficientes para el vuelto.";
                this.changeBreakdown = [];
            } else {
                this.updateCoins(changeDetails);
                this.changeMessage = `Su vuelto es de ${change} colones.`;
                this.changeBreakdown = Object.entries(changeDetails).map(
                    ([denomination, quantity]) => `${quantity} moneda(s) de ${denomination}.`
                );
            }

            this.resetTransaction();
        },
        calculateChange(change) {
            const changeDetails = {};
            const denominations = [500, 100, 50, 25];

            denominations.forEach(denomination => {
                const needed = Math.floor(change / denomination);
                const available = Math.min(needed, this.coins[denomination]);
                if (available > 0) {
                    changeDetails[denomination] = available;
                    change -= available * denomination;
                }
            });

            return change === 0 ? changeDetails : null;
        },
        updateCoins(changeDetails) {
            Object.entries(changeDetails).forEach(([denomination, quantity]) => {
                this.coins[denomination] -= quantity;
            });
        },
        resetTransaction() {
            this.cartItems = [];
            this.insertedMoney = 0;
        },
        hasCoins() {
            return Object.values(this.coins).some(quantity => quantity > 0);
        },
    },
};
</script>

<style>
body {
    background: linear-gradient(to bottom, #1a1a1a, #333);
    color: white;
    font-family: "Arial", sans-serif;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.vending-machine {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #333;
    padding: 20px;
    border-radius: 15px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
    width: 1100px;
    color: white;
    position: relative;
}

.machine-title {
    font-size: 2rem;
    font-weight: bold;
    color: #f1c40f;
    margin-bottom: 20px;
    text-shadow: 0 2px 5px rgba(0, 0, 0, 0.7);
    text-align: center;
}

.machine-content {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    width: 100%;
}

.product-display {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid #999;
    border-radius: 10px;
    padding: 15px;
    flex: 3;
}

.product-slot {
    text-align: center;
    background: #444;
    border-radius: 10px;
    padding: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.product-image {
    width: 80px;
    height: 80px;
    margin-bottom: 10px;
    border-radius: 5px;
}

.product-name {
    font-size: 1rem;
    margin-bottom: 5px;
}

.product-price {
    font-size: 1rem;
    color: #f1c40f;
    margin-top: 5px;
    font-weight: bold;
}


.product-quantity {
    font-size: 0.9rem;
    color: #f1c40f;
    margin-top: 10px;
}

.quantity-input {
    width: 60px;
    margin-right: 10px;
    padding: 5px;
    border-radius: 5px;
    border: 1px solid #ccc;
}

.input-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin-top: 10px;
}

.buy-button {
    background: #f1c40f;
    color: black;
    border: none;
    padding: 8px 12px;
    border-radius: 5px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.buy-button:hover {
    background: #d4ac0d;
}

.sold-out {
    color: #f1c40f;
    font-size: 0.9rem;
    margin-top: 5px;
    font-weight: bold;
}

.error-message {
    color: red;
    font-size: 0.9rem;
    margin-top: 5px;
}

.info-panel {
    background: #222;
    border-radius: 10px;
    padding: 20px;
    flex: 1;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 545px; 
}

.info-title {
    font-size: 1.2rem;
    font-weight: bold;
    color: #f1c40f;
    text-align: center;
    margin-bottom: 15px;
}

.selected-items {
    flex: 1;
    overflow-y: auto;
    max-height: 50%; 
}

.purchase-item {
    color: #f1c40f;
    font-size: 1rem;
    margin-bottom: 5px;
}

.total-amount {
    margin-top: 10px;
    font-size: 1.2rem;
    font-weight: bold;
    color: #f1c40f;
    text-align: center;
}

.payment-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    max-height: 50%; 
}

.payment-title {
    font-size: 1.2rem;
    font-weight: bold;
    color: #f1c40f;
    text-align: center;
}

.payment-buttons {
    display: flex;
    justify-content: center;
    gap: 5px;
}

.money-button {
    background: #f1c40f;
    color: black;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.money-button:hover {
    background: #d4ac0d;
}

.total-money {
    font-size: 1rem;
    font-weight: bold;
    color: white;
    text-align: center;
}

.change-breakdown {
    margin-top: 10px;
    padding-left: 20px;
    color: #f1c40f;
    font-size: 1rem;
    list-style: disc;
}

.out-of-service-message {
    color: red;
    font-size: 1.2rem;
    text-align: center;
    margin-top: 10px;
    font-weight: bold;
}

.tray-title {
    font-size: 1.5rem;
    font-weight: bold;
    color: #f1c40f;
    margin: 10px 0;
}

.product-tray {
    background: #444;
    width: 90%;
    height: 100px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: inset 0 -3px 6px rgba(0, 0, 0, 0.5);
}

.arrow-container {
    display: flex;
    gap: 25px;
}

.arrow {
    width: 30px;
    height: 30px;
    border-left: 2px solid white;
    border-top: 2px solid white;
    transform: rotate(225deg);
    animation: bounce 1s infinite;
}

@keyframes bounce {
    0%,
    100% {
        transform: translateY(0) rotate(225deg);
    }
    50% {
        transform: translateY(10px) rotate(225deg);
    }
}
</style>
