import React, { useState } from 'react';
import { User, Phone, CreditCard, Truck, Package, MapPin } from 'lucide-react';
import { FormInput } from '@/components/shared/form/FormInput';
import { FormSelect, SelectOption } from '@/components/shared/form/FormSelect';
import { Button } from '@/components/shared/ui/Button';
import { RoomManagement, Room } from './RoomManagement';

// Form data interface
export interface AddProductFormData {
  customerName: string;
  customerNumber: string;
  advancePayment: string;
  transportationCharge: string;
  marbleType: string;
  orderType: string;
  rooms: Room[];
}

// Form errors interface
interface FormErrors {
  customerName?: string;
  customerNumber?: string;
  advancePayment?: string;
  transportationCharge?: string;
  marbleType?: string;
  orderType?: string;
}

interface AddProductFormProps {
  onSubmit: (data: AddProductFormData) => void | Promise<void>;
  loading?: boolean;
  initialData?: Partial<AddProductFormData>;
}

// Dropdown options
const marbleOptions: SelectOption[] = [
  { value: 'italian-marble', label: 'Italian Marble' },
  { value: 'indian-marble', label: 'Indian Marble' },
  { value: 'granite', label: 'Granite' },
  { value: 'quartz', label: 'Quartz' },
  { value: 'ceramic', label: 'Ceramic' },
];

const orderTypeOptions: SelectOption[] = [
  { value: 'local', label: 'Local' },
  { value: 'station', label: 'Station' },
];

export const AddProductForm: React.FC<AddProductFormProps> = ({
  onSubmit,
  loading = false,
  initialData,
}) => {
  const [formData, setFormData] = useState<AddProductFormData>({
    customerName: initialData?.customerName || '',
    customerNumber: initialData?.customerNumber || '',
    advancePayment: initialData?.advancePayment || '',
    transportationCharge: initialData?.transportationCharge || '',
    marbleType: initialData?.marbleType || '',
    orderType: initialData?.orderType || '',
    rooms: initialData?.rooms || [],
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }

    if (!formData.customerNumber.trim()) {
      newErrors.customerNumber = 'Customer number is required';
    } else if (!/^\d{10}$/.test(formData.customerNumber)) {
      newErrors.customerNumber = 'Please enter a valid 10-digit number';
    }

    if (!formData.marbleType) {
      newErrors.marbleType = 'Please select marble type';
    }

    if (!formData.orderType) {
      newErrors.orderType = 'Please select order type';
    }

    if (formData.advancePayment && isNaN(parseFloat(formData.advancePayment))) {
      newErrors.advancePayment = 'Please enter a valid amount';
    }

    if (formData.transportationCharge && isNaN(parseFloat(formData.transportationCharge))) {
      newErrors.transportationCharge = 'Please enter a valid amount';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      await onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Information */}
      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>

        <FormInput
          label="Customer Name"
          icon={User}
          type="text"
          value={formData.customerName}
          onChange={(value) => setFormData({ ...formData, customerName: value })}
          placeholder="Enter customer name"
          required
          error={errors.customerName}
        />

        <FormInput
          label="Customer Number"
          icon={Phone}
          type="tel"
          value={formData.customerNumber}
          onChange={(value) => setFormData({ ...formData, customerNumber: value })}
          placeholder="Enter 10-digit mobile number"
          required
          error={errors.customerNumber}
        />
      </div>

      {/* Room Management */}
      <RoomManagement
        rooms={formData.rooms}
        onRoomsChange={(rooms) => setFormData({ ...formData, rooms })}
      />

      {/* Payment & Order Details */}
      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment & Order Details</h2>

        <FormInput
          label="Advance Payment"
          icon={CreditCard}
          type="text"
          value={formData.advancePayment}
          onChange={(value) => setFormData({ ...formData, advancePayment: value })}
          placeholder="Enter advance payment amount"
          error={errors.advancePayment}
        />

        <FormInput
          label="Transportation Charge"
          icon={Truck}
          type="text"
          value={formData.transportationCharge}
          onChange={(value) => setFormData({ ...formData, transportationCharge: value })}
          placeholder="Enter transportation charge"
          error={errors.transportationCharge}
        />

        <FormSelect
          label="Marble Type"
          icon={Package}
          value={formData.marbleType}
          onChange={(value) => setFormData({ ...formData, marbleType: value })}
          options={marbleOptions}
          placeholder="Select marble type"
          required
          error={errors.marbleType}
        />

        <FormSelect
          label="Order Type"
          icon={MapPin}
          value={formData.orderType}
          onChange={(value) => setFormData({ ...formData, orderType: value })}
          options={orderTypeOptions}
          placeholder="Select order type"
          required
          error={errors.orderType}
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        loading={loading}
        className="w-full text-lg py-4"
      >
        Post Order
      </Button>
    </form>
  );
};
