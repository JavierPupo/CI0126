<template>
    <div class="vending-machine">
      <h1 class="machine-title">Coffeely: Tu Máquina de Café Perfecto</h1>
  
      <div class="machine-content">
        <div class="product-display">
          <div v-for="cafe in cafes" :key="cafe.id" class="product-slot">
            <img :src="require(`@/assets/${cafe.image}`)" :alt="`Imagen de ${cafe.nombre}`" class="product-image" />
            <h3 class="product-name">{{ cafe.nombre }}</h3>
            <p class="product-price">₡{{ cafe.precio }}</p>
            <p class="product-quantity">Disponible: {{ cafe.cantidad }}</p>
            <button class="buy-button" @click="comprarCafe(cafe)">Comprar</button>
          </div>
        </div>
      </div>
  
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
        cafes: [
          { id: 1, nombre: "Americano", precio: 950, image: "CafeAmericano.png", cantidad: 10 },
          { id: 2, nombre: "Capuchino", precio: 1200, image: "Capuchino.png", cantidad: 8 },
          { id: 3, nombre: "Late", precio: 1350, image: "Late.png", cantidad: 10 },
          { id: 4, nombre: "Mocachino", precio: 1500, image: "Mocachino.png", cantidad: 15 },
        ],
        selectedItems: [],
      };
    },
    methods: {
      comprarCafe(cafe) {
        if (cafe.cantidad > 0) {
          cafe.cantidad -= 1;
        } else {
          alert(`El café ${cafe.nombre} está agotado.`);
        }
      },
    },
  };
  </script>
  
  <style>
  body {
    background: linear-gradient(to bottom, #1a1a1a, #333);
    color: white;
    font-family: 'Arial', sans-serif;
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
    font-size: 0.9rem;
    color: #ccc;
  }
  
  .product-quantity {
    font-size: 0.9rem;
    color: #f1c40f;
    margin-top: 5px;
  }
  
  .buy-button {
    background: #f1c40f;
    color: black;
    border: none;
    padding: 8px 12px;
    border-radius: 5px;
    font-size: 0.9rem;
    cursor: pointer;
    margin-top: 10px;
    transition: background-color 0.3s ease;
  }
  
  .buy-button:hover {
    background: #d4ac0d;
  }

  .product-tray {
    background: #444;
    width: 90%;
    height: 100px;
    margin-top: 20px;
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
  