import React, { useEffect, useState } from 'react';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Banknote,
  Smartphone,
  ShoppingCart,
  WifiOff,
  Printer,
  CheckCircle2,
  Loader2,
  X } from
'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { motion, AnimatePresence } from 'framer-motion';
export function POS() {
  const [isOffline, setIsOffline] = useState(false);
  const [showMpesaModal, setShowMpesaModal] = useState(false);
  const [mpesaState, setMpesaState] = useState<'idle' | 'waiting' | 'success'>(
    'idle'
  );
  const [showReceipt, setShowReceipt] = useState(false);
  const [phone, setPhone] = useState('07');
  // Simulate offline toggle for demo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'o') {
        setIsOffline((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  const handleMpesaPayment = () => {
    setShowMpesaModal(true);
    setMpesaState('idle');
  };
  const triggerMpesaPush = () => {
    setMpesaState('waiting');
    // Simulate STK push delay
    setTimeout(() => {
      setMpesaState('success');
      setTimeout(() => {
        setShowMpesaModal(false);
        setShowReceipt(true);
        setCart([]); // Clear cart
      }, 2000);
    }, 3000);
  };
  const [cart, setCart] = useState([
  {
    id: 1,
    name: 'Unga wa Dola 2kg',
    price: 230,
    qty: 2
  },
  {
    id: 2,
    name: 'Menengai Soap 1kg',
    price: 180,
    qty: 1
  }]
  );
  const products = [
  {
    id: 1,
    name: 'Unga wa Dola 2kg',
    category: 'Groceries',
    price: 230,
    stock: 45,
    image: '🌽'
  },
  {
    id: 2,
    name: 'Menengai Soap 1kg',
    category: 'Household',
    price: 180,
    stock: 20,
    image: '🧼'
  },
  {
    id: 3,
    name: 'KCC Milk 500ml',
    category: 'Dairy',
    price: 60,
    stock: 100,
    image: '🥛'
  },
  {
    id: 4,
    name: 'Supaloaf Bread 400g',
    category: 'Bakery',
    price: 65,
    stock: 30,
    image: '🍞'
  },
  {
    id: 5,
    name: 'Royco Mchuzi Mix',
    category: 'Spices',
    price: 15,
    stock: 200,
    image: '🌶️'
  },
  {
    id: 6,
    name: 'Ketepa Tea Leaves 250g',
    category: 'Beverages',
    price: 140,
    stock: 50,
    image: '☕'
  },
  {
    id: 7,
    name: 'Omo Washing Powder 500g',
    category: 'Household',
    price: 210,
    stock: 25,
    image: '👕'
  },
  {
    id: 8,
    name: 'Blue Band Margarine 250g',
    category: 'Groceries',
    price: 180,
    stock: 40,
    image: '🧈'
  }];

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = subtotal * 0.16; // 16% VAT
  const total = subtotal + tax;
  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-6 relative">
      {/* Offline Indicator */}
      <AnimatePresence>
        {isOffline &&
        <motion.div
          initial={{
            opacity: 0,
            y: -50
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          exit={{
            opacity: 0,
            y: -50
          }}
          className="absolute top-0 left-1/2 -translate-x-1/2 z-50 bg-accent text-white px-4 py-2 rounded-b-xl shadow-lg flex items-center gap-2 text-sm font-medium">
          
            <WifiOff className="w-4 h-4" />
            Offline Mode — Changes will sync when reconnected
          </motion.div>
        }
      </AnimatePresence>

      {/* Products Section */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="mb-4 flex gap-4">
          <Input
            placeholder="Search products by name or barcode..."
            leftIcon={<Search className="w-5 h-5" />}
            className="flex-1" />
          
          <select className="bg-surface border border-border rounded-xl px-4 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-brand">
            <option>All Categories</option>
            <option>Groceries</option>
            <option>Household</option>
            <option>Dairy</option>
          </select>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pb-4">
            {products.map((product) =>
            <motion.div
              whileHover={{
                scale: 1.02
              }}
              whileTap={{
                scale: 0.98
              }}
              key={product.id}>
              
                <Card
                className="cursor-pointer hover:border-brand transition-colors group h-full"
                onClick={() => {
                  const existing = cart.find((item) => item.id === product.id);
                  if (existing) {
                    setCart(
                      cart.map((item) =>
                      item.id === product.id ?
                      {
                        ...item,
                        qty: item.qty + 1
                      } :
                      item
                      )
                    );
                  } else {
                    setCart([
                    ...cart,
                    {
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      qty: 1
                    }]
                    );
                  }
                }}>
                
                  <CardContent className="p-4 flex flex-col items-center text-center h-full">
                    <div className="w-16 h-16 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center text-3xl mb-3 group-hover:scale-110 transition-transform">
                      {product.image}
                    </div>
                    <h4 className="text-sm font-medium text-text mb-1 line-clamp-2 flex-1">
                      {product.name}
                    </h4>
                    <p className="text-brand font-bold">KES {product.price}</p>
                    <p className="text-xs text-muted mt-1">
                      {product.stock} in stock
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Cart Section */}
      <Card className="w-full lg:w-96 flex flex-col h-full shrink-0" glass>
        <div className="p-4 border-b border-border bg-surface/50 rounded-t-2xl">
          <h2 className="font-display font-bold text-lg text-text">
            Current Order
          </h2>
          <p className="text-sm text-muted">Order #ORD-2026-001</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          <AnimatePresence initial={false}>
            {cart.map((item) =>
            <motion.div
              key={item.id}
              initial={{
                opacity: 0,
                x: 20
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              exit={{
                opacity: 0,
                x: -20
              }}
              className="flex items-center justify-between gap-3">
              
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-text truncate">
                    {item.name}
                  </h4>
                  <p className="text-xs text-muted">KES {item.price} each</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                  className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center text-text hover:bg-black/10 transition-colors"
                  onClick={() => {
                    if (item.qty > 1) {
                      setCart(
                        cart.map((i) =>
                        i.id === item.id ?
                        {
                          ...i,
                          qty: i.qty - 1
                        } :
                        i
                        )
                      );
                    } else {
                      setCart(cart.filter((i) => i.id !== item.id));
                    }
                  }}>
                  
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-6 text-center text-sm font-medium">
                    {item.qty}
                  </span>
                  <button
                  className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center text-text hover:bg-black/10 transition-colors"
                  onClick={() =>
                  setCart(
                    cart.map((i) =>
                    i.id === item.id ?
                    {
                      ...i,
                      qty: i.qty + 1
                    } :
                    i
                    )
                  )
                  }>
                  
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-right w-20">
                  <p className="text-sm font-bold text-text">
                    KES {item.price * item.qty}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {cart.length === 0 &&
          <motion.div
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            className="h-full flex flex-col items-center justify-center text-muted">
            
              <ShoppingCart className="w-12 h-12 mb-2 opacity-20" />
              <p>Cart is empty</p>
            </motion.div>
          }
        </div>

        <div className="p-4 border-t border-border bg-surface/50 rounded-b-2xl space-y-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-muted">
              <span>Subtotal</span>
              <span>KES {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted">
              <span>VAT (16%)</span>
              <span>KES {tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-text pt-2 border-t border-border">
              <span>Total</span>
              <span className="text-brand">KES {total.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="secondary"
              className="flex flex-col items-center gap-1 h-auto py-3">
              
              <Banknote className="w-5 h-5" />
              <span className="text-xs">Cash</span>
            </Button>
            <Button
              variant="secondary"
              onClick={handleMpesaPayment}
              className="flex flex-col items-center gap-1 h-auto py-3 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900 text-green-700 dark:text-green-400 hover:bg-green-100 transition-colors">
              
              <Smartphone className="w-5 h-5" />
              <span className="text-xs">M-Pesa</span>
            </Button>
            <Button
              variant="secondary"
              className="flex flex-col items-center gap-1 h-auto py-3">
              
              <CreditCard className="w-5 h-5" />
              <span className="text-xs">Card</span>
            </Button>
          </div>

          <Button
            className="w-full"
            size="lg"
            disabled={cart.length === 0}
            onClick={() => setShowReceipt(true)}>
            
            Complete Payment
          </Button>
        </div>
      </Card>

      {/* M-Pesa Modal */}
      <AnimatePresence>
        {showMpesaModal &&
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
            initial={{
              opacity: 0,
              scale: 0.95
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            exit={{
              opacity: 0,
              scale: 0.95
            }}
            className="bg-surface rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            
              <div className="bg-[#4CB748] p-6 text-white text-center relative">
                <button
                onClick={() => setShowMpesaModal(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white">
                
                  <X className="w-5 h-5" />
                </button>
                <Smartphone className="w-12 h-12 mx-auto mb-2 opacity-90" />
                <h2 className="text-2xl font-bold">Lipa na M-Pesa</h2>
                <p className="text-white/80 mt-1">
                  Till Number: <strong>543210</strong>
                </p>
              </div>

              <div className="p-6 space-y-6">
                {mpesaState === 'idle' &&
              <motion.div
                initial={{
                  opacity: 0
                }}
                animate={{
                  opacity: 1
                }}
                className="space-y-4">
                
                    <div className="text-center">
                      <p className="text-sm text-muted mb-1">Amount to pay</p>
                      <p className="text-3xl font-bold text-text">
                        KES {total.toFixed(2)}
                      </p>
                    </div>
                    <Input
                  label="Customer Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="07XX XXX XXX"
                  autoFocus />
                
                    <Button
                  className="w-full bg-[#4CB748] hover:bg-[#3da039] text-white"
                  size="lg"
                  onClick={triggerMpesaPush}>
                  
                      Send Payment Request
                    </Button>
                  </motion.div>
              }

                {mpesaState === 'waiting' &&
              <motion.div
                initial={{
                  opacity: 0
                }}
                animate={{
                  opacity: 1
                }}
                className="py-8 flex flex-col items-center text-center space-y-4">
                
                    <Loader2 className="w-12 h-12 text-[#4CB748] animate-spin" />
                    <div>
                      <h3 className="text-lg font-bold text-text">
                        Waiting for customer...
                      </h3>
                      <p className="text-muted text-sm mt-1">
                        Ask the customer to enter their PIN on their phone.
                      </p>
                    </div>
                  </motion.div>
              }

                {mpesaState === 'success' &&
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.9
                }}
                animate={{
                  opacity: 1,
                  scale: 1
                }}
                className="py-8 flex flex-col items-center text-center space-y-4">
                
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-text">
                        Payment Received!
                      </h3>
                      <p className="text-muted text-sm mt-1">
                        Transaction ID: QWE123RTY4
                      </p>
                    </div>
                  </motion.div>
              }
              </div>
            </motion.div>
          </div>
        }
      </AnimatePresence>

      {/* Receipt Modal (Thermal Printer Style) */}
      <AnimatePresence>
        {showReceipt &&
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
            initial={{
              opacity: 0,
              y: 50
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              y: 50
            }}
            className="w-full max-w-sm flex flex-col items-center">
            
              {/* Receipt Paper */}
              <div className="bg-white text-black p-6 w-full rounded-t-sm shadow-2xl relative overflow-hidden font-mono text-sm">
                {/* Jagged bottom edge simulation */}
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cG9seWdvbiBwb2ludHM9IjAsOCA0LDAgOCw4IiBmaWxsPSIjZmZmIi8+Cjwvc3ZnPg==')] bg-repeat-x"></div>
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold uppercase tracking-widest">
                    BizFlow KE
                  </h2>
                  <p className="text-xs mt-1">Nairobi CBD Branch</p>
                  <p className="text-xs">Tel: 0712 345 678</p>
                  <p className="text-xs">PIN: P051234567X</p>
                  <div className="border-b-2 border-dashed border-gray-300 my-3"></div>
                  <p className="text-xs">Receipt: BIZ-NRB-2026-001</p>
                  <p className="text-xs">{new Date().toLocaleString()}</p>
                  <p className="text-xs">Cashier: Admin</p>
                  <div className="border-b-2 border-dashed border-gray-300 my-3"></div>
                </div>
                <div className="space-y-2 mb-4">
                  {cart.length > 0 ?
                cart.map((item, i) =>
                <div key={i} className="flex justify-between text-xs">
                        <span className="flex-1">
                          {item.qty}x {item.name}
                        </span>
                        <span>{item.price * item.qty}</span>
                      </div>
                ) :

                <div className="flex justify-between text-xs">
                      <span className="flex-1">1x Sample Item</span>
                      <span>{total.toFixed(2)}</span>
                    </div>
                }
                </div>
                <div className="border-b-2 border-dashed border-gray-300 my-3"></div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>SUBTOTAL</span>
                    <span>{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>VAT (16%)</span>
                    <span>{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm mt-2 pt-2 border-t border-gray-300">
                    <span>TOTAL</span>
                    <span>KES {total.toFixed(2)}</span>
                  </div>
                </div>
                <div className="border-b-2 border-dashed border-gray-300 my-3"></div>
                <div className="text-center text-xs space-y-1">
                  <p>Paid via M-Pesa (QWE123RTY4)</p>
                  <p className="mt-4 font-bold">ASANTE SANA!</p>
                  <p>Welcome Again</p>
                </div>
                <div className="h-4"></div> {/* Space for jagged edge */}
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6 w-full">
                <Button
                variant="secondary"
                className="flex-1 bg-white text-black hover:bg-gray-100"
                onClick={() => {
                  setShowReceipt(false);
                  setCart([]);
                }}>
                
                  New Sale
                </Button>
                <Button
                className="flex-1"
                leftIcon={<Printer className="w-4 h-4" />}>
                
                  Print
                </Button>
              </div>
            </motion.div>
          </div>
        }
      </AnimatePresence>
    </div>);

}