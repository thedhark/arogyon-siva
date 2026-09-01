import { create } from 'zustand';

export interface LocationItem {
  id: string;
  city: string;
  area: string;
  fullAddress: string;
  latitude?: number;
  longitude?: number;
  isDefault?: boolean;
}

// Backward-compatible Address interface for existing components
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
  currentLocation: LocationItem;
  addresses: Address[];
  setLocation: (location: Omit<LocationItem, 'id'>) => void;
  addAddress: (address: Omit<Address, 'id'>) => Address;
  setDefaultAddress: (id: string) => void;
  removeAddress: (id: string) => void;
  getActiveAddress: () => Address;
}

const DEFAULT_LOCATION: LocationItem = {
  id: 'loc-1',
  city: 'Tirupati',
  area: 'Mangalam',
  fullAddress: 'Mangalam, Tirupati, Andhra Pradesh',
  latitude: 13.635,
  longitude: 79.430,
  isDefault: true,
};

export const useAddressStore = create<AddressState>((set, get) => ({
  currentLocation: DEFAULT_LOCATION,
  addresses: [
    { 
      id: '1', 
      type: DEFAULT_LOCATION.city, 
      address: DEFAULT_LOCATION.fullAddress,
      city: DEFAULT_LOCATION.city,
      distance: '0 m',
      isDefault: true,
      latitude: DEFAULT_LOCATION.latitude,
      longitude: DEFAULT_LOCATION.longitude,
    }
  ],
  setLocation: (loc) => {
    const newLoc: LocationItem = {
      ...loc,
      id: Math.random().toString(36).substring(2, 9),
      isDefault: true,
    };
    set({
      currentLocation: newLoc,
      addresses: [
        {
          id: newLoc.id,
          type: newLoc.city || newLoc.area || 'Location',
          address: newLoc.fullAddress,
          city: newLoc.city,
          distance: '0 m',
          isDefault: true,
          latitude: newLoc.latitude,
          longitude: newLoc.longitude,
        }
      ]
    });
  },
  addAddress: (address) => {
    const newAddress: Address = {
      ...address,
      id: Math.random().toString(36).substring(2, 9),
    };
    
    set({
      currentLocation: {
        id: newAddress.id,
        city: newAddress.city || newAddress.type || 'Selected Location',
        area: newAddress.type,
        fullAddress: newAddress.address,
        latitude: newAddress.latitude,
        longitude: newAddress.longitude,
        isDefault: true,
      },
      addresses: [newAddress],
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
    if (remaining.length > 0 && !remaining.some((a) => a.isDefault)) {
      remaining[0].isDefault = true;
    }
    return { addresses: remaining.length > 0 ? remaining : [{ id: '1', type: 'Tirupati', address: 'Tirupati, Andhra Pradesh', isDefault: true }] };
  }),
  getActiveAddress: () => {
    const state = get();
    return state.addresses.find((a) => a.isDefault) || state.addresses[0] || {
      id: '1',
      type: state.currentLocation.city,
      address: state.currentLocation.fullAddress,
      isDefault: true,
    };
  }
}));
