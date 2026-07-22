import { create } from 'zustand';

export interface Address {
  id: string;
  type: string;
  address: string;
  isDefault: boolean;
  latitude?: number;
  longitude?: number;
}

interface AddressState {
  addresses: Address[];
  addAddress: (address: Omit<Address, 'id'>) => void;
  setDefaultAddress: (id: string) => void;
  removeAddress: (id: string) => void;
}

export const useAddressStore = create<AddressState>((set) => ({
  addresses: [
    { 
      id: '1', 
      type: 'Home', 
      address: 'Flat 402, Alpine Eco Apartments, Marathahalli Outer Ring Road, Bangalore - 560037',
      isDefault: true 
    },
    { 
      id: '2', 
      type: 'Work', 
      address: 'Tower B, RMZ Ecospace, Bellandur, Bangalore - 560103',
      isDefault: false 
    }
  ],
  addAddress: (address) => set((state) => {
    const newAddress = { ...address, id: Math.random().toString(36).substr(2, 9) };
    if (address.isDefault) {
      return {
        addresses: [
          newAddress,
          ...state.addresses.map(a => ({ ...a, isDefault: false }))
        ]
      };
    }
    return { addresses: [newAddress, ...state.addresses] };
  }),
  setDefaultAddress: (id) => set((state) => ({
    addresses: state.addresses.map(a => ({
      ...a,
      isDefault: a.id === id
    }))
  })),
  removeAddress: (id) => set((state) => ({
    addresses: state.addresses.filter(a => a.id !== id)
  }))
}));
