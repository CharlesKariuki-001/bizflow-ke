export interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  cost_price: number;
  selling_price: number;
  stock: number;
  image: string;
}

export const demoProducts: Product[] = [
{
  id: '1',
  name: 'Unga wa Dola 2kg',
  category: 'Groceries',
  sku: 'GRO-001',
  cost_price: 190,
  selling_price: 230,
  stock: 45,
  image: '🌽'
},
{
  id: '2',
  name: 'Menengai Soap 1kg',
  category: 'Household',
  sku: 'HOU-001',
  cost_price: 150,
  selling_price: 180,
  stock: 20,
  image: '🧼'
},
{
  id: '3',
  name: 'KCC Milk 500ml',
  category: 'Dairy',
  sku: 'DAI-001',
  cost_price: 50,
  selling_price: 60,
  stock: 100,
  image: '🥛'
},
{
  id: '4',
  name: 'Supaloaf Bread 400g',
  category: 'Bakery',
  sku: 'BAK-001',
  cost_price: 55,
  selling_price: 65,
  stock: 30,
  image: '🍞'
},
{
  id: '5',
  name: 'Royco Mchuzi Mix',
  category: 'Spices',
  sku: 'SPI-001',
  cost_price: 10,
  selling_price: 15,
  stock: 200,
  image: '🌶️'
},
{
  id: '6',
  name: 'Ketepa Tea Leaves 250g',
  category: 'Beverages',
  sku: 'BEV-001',
  cost_price: 110,
  selling_price: 140,
  stock: 50,
  image: '☕'
},
{
  id: '7',
  name: 'Omo Washing Powder 500g',
  category: 'Household',
  sku: 'HOU-002',
  cost_price: 180,
  selling_price: 210,
  stock: 25,
  image: '👕'
},
{
  id: '8',
  name: 'Blue Band Margarine 250g',
  category: 'Groceries',
  sku: 'GRO-002',
  cost_price: 150,
  selling_price: 180,
  stock: 40,
  image: '🧈'
},
{
  id: '9',
  name: 'Kasuku Cooking Fat 1kg',
  category: 'Groceries',
  sku: 'GRO-003',
  cost_price: 280,
  selling_price: 320,
  stock: 15,
  image: '🛢️'
},
{
  id: '10',
  name: 'Tropical Mango Juice 1L',
  category: 'Beverages',
  sku: 'BEV-002',
  cost_price: 140,
  selling_price: 180,
  stock: 35,
  image: '🧃'
}];


export const demoBusiness = {
  name: 'Mama John Supermarket',
  owner: 'John Mwangi',
  county: 'Kiambu',
  town: 'Thika',
  kraPin: 'P051234567X',
  tillNumber: '247247',
  etimsId: 'ETIMS-KE-00123456',
  branches: [
  { id: 'b1', name: 'Main Branch (Thika Town)' },
  { id: 'b2', name: 'Makongeni Branch' },
  { id: 'b3', name: 'Ruiru Branch' }],

  employees: [
  { id: 'e1', name: 'Wanjiku Kamau', role: 'Owner' },
  { id: 'e2', name: 'David Otieno', role: 'Manager' },
  { id: 'e3', name: 'Faith Akinyi', role: 'Cashier' },
  { id: 'e4', name: 'Peter Njoroge', role: 'Cashier' }]

};