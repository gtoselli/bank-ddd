export type CustomersRepo = ReturnType<typeof CustomersRepo>;
export function CustomersRepo() {
  const state: Customer[] = [];

  async function create(customer: Customer) {
    state.push(customer);
  }

  async function getOrThrow(id: string) {
    const res = state.find((c) => c.id === id);
    if (!res) throw new Error("Customer not found");
    return res;
  }

  async function update(customer: Customer) {
    const index = state.findIndex((c) => c.id === customer.id);
    state[index] = customer;
  }

  async function remove(id: string) {
    const index = state.findIndex((c) => c.id === id);
    state.splice(index, 1);
  }

  async function list() {
    return state;
  }

  return { create, getOrThrow, update, remove, list };
}

type Customer = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};
