import { create } from 'zustand';

export interface Address {
  id: string;
  type: string;
  address: string;
  flatNo?: string;
  landmark?: string;
  pincode?: string;
  city?: string;
  phone?: string;
  distance?: string;
  isDefault: boolean;
  latitude?: number;
  longitude?: number;
}

interface AddressState {
  addresses: Address[];
  addAddress: (address: Omit<Address, 'id'>) => Address;
  setDefaultAddress: (id: string) => void;
  removeAddress: (id: string) => void;
  getActiveAddress: () => Address | undefined;
}

export const useAddressStore = create<AddressState>((set, get) => ({
  addresses: [
    { 
      id: '1', 
      type: 'Home', 
      address: '402 Primark Lake View, Mangalam, Tirupati, Andhra Pradesh',
      distance: '0 m',
      isDefault: true 
    },
    { 
      id: '2', 
      type: 'Hospital', 
      address: 'Sankalpa Super Speciality Hospital, Karakambadi Bazar Street, Tata Nagar, Tirupati',
      distance: '1.9 km',
      isDefault: false 
    },
    {
      id: '3',
      type: 'Work',
      address: 'Bangalore Bus Stand Area, Mallaiah Gunta, Tirupati',
      distance: '2.2 km',
      isDefault: false
    }
  ],
  addAddress: (address) => {
    const newAddress: Address = {
      ...address,
      id: Math.random().toString(36).substring(2, 9),
    };
    
    set((state) => {
      const updatedAddresses = address.isDefault
        ? state.addresses.map((a) => ({ ...a, isDefault: false }))
        : state.addresses;
        
      return {
        addresses: [newAddress, ...updatedAddresses],
      };
    });

    return newAddress;
  },
  setDefaultAddress: (id) => set((state) => ({
    addresses: state.addresses.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }))
  })),
  removeAddress: (id) => set((state) => {
    const remaining = state.addresses.filter((a) => a.id !== id);
    // If we removed the default address, make the first remaining address default
    if (remaining.length > 0 && !remaining.some((a) => a.isDefault)) {
      remaining[0].isDefault = true;
    }
    return { addresses: remaining };
  }),
  getActiveAddress: () => {
    const state = get();
    return state.addresses.find((a) => a.isDefault) || state.addresses[0];
  }
}));
