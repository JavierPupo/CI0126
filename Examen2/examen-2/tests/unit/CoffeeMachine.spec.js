import { shallowMount } from "@vue/test-utils";
import CoffeeMachine from "@/components/CoffeeMachine.vue";

describe("CoffeeMachine.vue", () => {
  window.alert = jest.fn();

  it("renders the correct title", () => {
    const wrapper = shallowMount(CoffeeMachine);
    expect(wrapper.find("h1").text()).toBe("Coffeely: Tu Máquina de Café Perfecto");
  });

  it("adds an item to the cart correctly", () => {
    const wrapper = shallowMount(CoffeeMachine);
    wrapper.vm.addToCart(wrapper.vm.coffees[0]); 
    expect(wrapper.vm.cartItems.length).toBe(1);
    expect(wrapper.vm.cartItems[0].name).toBe("Americano");
  });

  it("validates cart input correctly", () => {
    const wrapper = shallowMount(CoffeeMachine);
    const coffee = wrapper.vm.coffees[0];
    coffee.selectedQuantity = 0;
    expect(wrapper.vm.validateCart(coffee)).toBe(false);

    coffee.selectedQuantity = 100;
    coffee.quantity = 10;
    expect(wrapper.vm.validateCart(coffee)).toBe(false);
  });

  it("calculates the total correctly", () => {
    const wrapper = shallowMount(CoffeeMachine);
    wrapper.vm.cartItems = [
      { id: 1, name: "Americano", quantity: 2, total: 1900 },
      { id: 2, name: "Capuchino", quantity: 1, total: 1200 },
    ];
    expect(wrapper.vm.calculateTotal()).toBe(3100);
  });

  it("handles insufficient funds correctly", () => {
    const wrapper = shallowMount(CoffeeMachine);
    wrapper.vm.cartItems = [
      { id: 1, name: "Americano", quantity: 2, total: 1900 },
    ];
    wrapper.vm.insertedMoney = 1000;

    wrapper.vm.completePurchase();
    expect(wrapper.vm.changeMessage).toBe("Dinero insuficiente. Por favor, ingrese más dinero.");
    expect(wrapper.vm.changeBreakdown.length).toBe(0);
  });
});
