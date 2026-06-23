import React, { useState } from 'react';
import {
  Search,
  Plus,
  Filter,
  MoreVertical,
  AlertTriangle,
  Edit,
  Trash2 } from
'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
export function Inventory() {
  const inventory = [
  {
    id: 'ITM-001',
    name: 'Unga wa Dola 2kg',
    category: 'Groceries',
    price: 230,
    cost: 190,
    stock: 45,
    status: 'In Stock'
  },
  {
    id: 'ITM-002',
    name: 'Menengai Soap 1kg',
    category: 'Household',
    price: 180,
    cost: 150,
    stock: 5,
    status: 'Low Stock'
  },
  {
    id: 'ITM-003',
    name: 'KCC Milk 500ml',
    category: 'Dairy',
    price: 60,
    cost: 50,
    stock: 100,
    status: 'In Stock'
  },
  {
    id: 'ITM-004',
    name: 'Supaloaf Bread 400g',
    category: 'Bakery',
    price: 65,
    cost: 55,
    stock: 0,
    status: 'Out of Stock'
  },
  {
    id: 'ITM-005',
    name: 'Royco Mchuzi Mix',
    category: 'Spices',
    price: 15,
    cost: 10,
    stock: 200,
    status: 'In Stock'
  },
  {
    id: 'ITM-006',
    name: 'Ketepa Tea Leaves 250g',
    category: 'Beverages',
    price: 140,
    cost: 110,
    stock: 12,
    status: 'Low Stock'
  }];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-text">
            Inventory Management
          </h1>
          <p className="text-muted">
            Manage your products, pricing, and stock levels.
          </p>
        </div>
        <Button leftIcon={<Plus className="w-5 h-5" />}>Add Product</Button>
      </div>

      <Card glass>
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Search products..."
            leftIcon={<Search className="w-5 h-5" />}
            className="sm:max-w-xs" />
          
          <div className="flex gap-2">
            <Button
              variant="secondary"
              leftIcon={<Filter className="w-4 h-4" />}>
              
              Filter
            </Button>
            <select className="bg-surface border border-border rounded-xl px-4 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-brand">
              <option>All Categories</option>
              <option>Groceries</option>
              <option>Household</option>
              <option>Dairy</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-black/5 dark:bg-white/5">
                <th className="p-4 text-sm font-medium text-muted">
                  Product Details
                </th>
                <th className="p-4 text-sm font-medium text-muted">Category</th>
                <th className="p-4 text-sm font-medium text-muted">
                  Price (KES)
                </th>
                <th className="p-4 text-sm font-medium text-muted">
                  Cost (KES)
                </th>
                <th className="p-4 text-sm font-medium text-muted">Stock</th>
                <th className="p-4 text-sm font-medium text-muted">Status</th>
                <th className="p-4 text-sm font-medium text-muted text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {inventory.map((item) =>
              <tr
                key={item.id}
                className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-text">{item.name}</span>
                      <span className="text-xs text-muted">{item.id}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-text">{item.category}</td>
                  <td className="p-4 text-sm font-medium text-text">
                    {item.price}
                  </td>
                  <td className="p-4 text-sm text-muted">{item.cost}</td>
                  <td className="p-4 text-sm font-medium text-text">
                    {item.stock}
                  </td>
                  <td className="p-4">
                    <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status === 'In Stock' ? 'bg-brand/10 text-brand' : item.status === 'Low Stock' ? 'bg-gold/20 text-yellow-700 dark:text-gold' : 'bg-accent/10 text-accent'}`}>
                    
                      {item.status === 'Low Stock' &&
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    }
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-muted hover:text-brand transition-colors rounded-lg hover:bg-brand/10">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-muted hover:text-accent transition-colors rounded-lg hover:bg-accent/10">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between text-sm text-muted">
          <span>Showing 1 to 6 of 124 entries</span>
          <div className="flex gap-1">
            <Button variant="secondary" size="sm" disabled>
              Previous
            </Button>
            <Button variant="secondary" size="sm">
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>);

}