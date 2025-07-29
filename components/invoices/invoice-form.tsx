'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Trash2, Plus, Save, X } from 'lucide-react';

interface InvoiceItem {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

interface InvoiceFormData {
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  issueDate: string;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  notes: string;
  items: InvoiceItem[];
}

interface InvoiceFormProps {
  invoice?: any; // For editing existing invoice
  onSave: (data: InvoiceFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function InvoiceForm({ invoice, onSave, onCancel, isLoading = false }: InvoiceFormProps) {
  const [formData, setFormData] = useState<InvoiceFormData>({
    invoiceNumber: '',
    clientName: '',
    clientEmail: '',
    issueDate: '',
    dueDate: '',
    status: 'draft',
    notes: '',
    items: [{ description: '', quantity: 1, unitPrice: 0, amount: 0 }]
  });

  // Load existing invoice data for editing
  useEffect(() => {
    if (invoice) {
      setFormData({
        invoiceNumber: invoice.invoiceNumber || '',
        clientName: invoice.clientName || '',
        clientEmail: invoice.clientEmail || '',
        issueDate: invoice.issueDate ? new Date(invoice.issueDate).toISOString().split('T')[0] : '',
        dueDate: invoice.dueDate ? new Date(invoice.dueDate).toISOString().split('T')[0] : '',
        status: invoice.status || 'draft',
        notes: invoice.notes || '',
        items: invoice.items?.length > 0 
          ? invoice.items.map((item: any) => ({
              id: item.id,
              description: item.description || '',
              quantity: item.quantity || 1,
              unitPrice: item.unitPrice || 0,
              amount: item.amount || 0
            }))
          : [{ description: '', quantity: 1, unitPrice: 0, amount: 0 }]
      });
    }
  }, [invoice]);

  // Calculate item amount when quantity or unit price changes
  const updateItemAmount = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Recalculate amount
    if (field === 'quantity' || field === 'unitPrice') {
      const quantity = field === 'quantity' ? Number(value) : newItems[index].quantity;
      const unitPrice = field === 'unitPrice' ? Number(value) : newItems[index].unitPrice;
      newItems[index].amount = quantity * unitPrice;
    }
    
    setFormData({ ...formData, items: newItems });
  };

  // Add new item
  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, unitPrice: 0, amount: 0 }]
    });
  };

  // Remove item
  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData({ ...formData, items: newItems });
    }
  };

  // Calculate total
  const total = formData.items.reduce((sum, item) => sum + item.amount, 0);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.invoiceNumber.trim()) {
      toast.error('Invoice number is required');
      return;
    }
    if (!formData.clientName.trim()) {
      toast.error('Client name is required');
      return;
    }
    if (!formData.clientEmail.trim()) {
      toast.error('Client email is required');
      return;
    }
    if (!formData.issueDate) {
      toast.error('Issue date is required');
      return;
    }
    if (!formData.dueDate) {
      toast.error('Due date is required');
      return;
    }

    // Validate items
    const validItems = formData.items.filter(item => 
      item.description.trim() && item.quantity > 0 && item.unitPrice > 0
    );
    
    if (validItems.length === 0) {
      toast.error('At least one valid item is required');
      return;
    }

    onSave({
      ...formData,
      items: validItems
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Invoice Number */}
        <div className="space-y-2">
          <Label htmlFor="invoiceNumber">Invoice Number *</Label>
          <Input
            id="invoiceNumber"
            value={formData.invoiceNumber}
            onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
            placeholder="INV-2024-001"
            required
          />
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Client Name */}
        <div className="space-y-2">
          <Label htmlFor="clientName">Client Name *</Label>
          <Input
            id="clientName"
            value={formData.clientName}
            onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
            placeholder="John Doe"
            required
          />
        </div>

        {/* Client Email */}
        <div className="space-y-2">
          <Label htmlFor="clientEmail">Client Email *</Label>
          <Input
            id="clientEmail"
            type="email"
            value={formData.clientEmail}
            onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
            placeholder="john@example.com"
            required
          />
        </div>

        {/* Issue Date */}
        <div className="space-y-2">
          <Label htmlFor="issueDate">Issue Date *</Label>
          <Input
            id="issueDate"
            type="date"
            value={formData.issueDate}
            onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
            required
          />
        </div>

        {/* Due Date */}
        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date *</Label>
          <Input
            id="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            required
          />
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Additional notes..."
          rows={3}
        />
      </div>

      {/* Invoice Items */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Invoice Items</Label>
          <Button type="button" onClick={addItem} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>

        <div className="space-y-3">
          {formData.items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 items-end p-3 border rounded-lg">
              <div className="col-span-5">
                <Label>Description</Label>
                <Input
                  value={item.description}
                  onChange={(e) => updateItemAmount(index, 'description', e.target.value)}
                  placeholder="Item description"
                />
              </div>
              <div className="col-span-2">
                <Label>Qty</Label>
                <Input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateItemAmount(index, 'quantity', Number(e.target.value))}
                />
              </div>
              <div className="col-span-2">
                <Label>Unit Price</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.unitPrice}
                  onChange={(e) => updateItemAmount(index, 'unitPrice', Number(e.target.value))}
                />
              </div>
              <div className="col-span-2">
                <Label>Amount</Label>
                <Input
                  type="number"
                  value={item.amount.toFixed(2)}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
              <div className="col-span-1">
                <Button
                  type="button"
                  onClick={() => removeItem(index)}
                  variant="ghost"
                  size="sm"
                  disabled={formData.items.length === 1}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="flex justify-end">
          <div className="text-lg font-semibold">
            Total: ${total.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-2">
        <Button type="button" onClick={onCancel} variant="outline">
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? 'Saving...' : (invoice ? 'Update Invoice' : 'Create Invoice')}
        </Button>
      </div>
    </form>
  );
} 