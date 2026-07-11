import React from 'react';
import { View, StyleSheet } from 'react-native';
import DirectoryCard from '@/components/DirectoryCard';
import { MEDICAL_ILLUSTRATIONS } from '@/constants/medical-illustrations';

export default function DirectoryContent({ activeTab }: { activeTab: string }) {
  return (
    <View style={styles.container}>
      {activeTab === 'Hospitals' && (
        <>
          <DirectoryCard 
            image={MEDICAL_ILLUSTRATIONS.hospital}
            logo="https://s3.ap-south-1.amazonaws.com/s3.dhan.co/images/apollo.png"
            typeTag="Multi-speciality Hospital"
            title="Apollo Hospitals"
            subtitle="Compassionate care. Advanced expertise."
            address="Bannerghatta Road"
            distance="2.3 km away"
            fee="₹500 onwards"
            nextAvailable="Today, 11:30 AM"
            insurance="32+ Providers"
            trustedCount="12,000+"
            rating="4.8"
            reviews="2.3K"
          />
          <DirectoryCard 
            image={MEDICAL_ILLUSTRATIONS.clinic}
            logo="https://i.pinimg.com/736x/8f/33/2c/8f332c1c68f2abce60292b3472beceb0.jpg"
            typeTag="Super Speciality"
            title="Fortis Healthcare"
            subtitle="World class healthcare delivery system."
            address="Cunningham Road"
            distance="4.1 km away"
            fee="₹800 onwards"
            nextAvailable="Today, 02:00 PM"
            insurance="28+ Providers"
            trustedCount="8,000+"
            rating="4.6"
            reviews="1.8K"
          />
          <DirectoryCard 
            image={MEDICAL_ILLUSTRATIONS.physiotherapy}
            logo="https://img.freepik.com/premium-vector/medical-cross-hospital-logo-vector-design_535862-238.jpg"
            typeTag="Physiotherapy Center"
            title="Active Physio Care"
            subtitle="Movement is medicine. Start healing today."
            address="Koramangala"
            distance="800 m away"
            fee="₹800 onwards"
            nextAvailable="Tomorrow, 09:00 AM"
            insurance="15+ Providers"
            trustedCount="4,500+"
            rating="4.9"
            reviews="1.2K"
          />
        </>
      )}
      
      {activeTab === 'Gyms' && (
        <>
          <DirectoryCard 
            image={MEDICAL_ILLUSTRATIONS.fitness}
            logo="https://i.pinimg.com/736x/5b/7e/3c/5b7e3cae4010e6a82d2fb4fcbfeb4e5e.jpg"
            typeTag="Premium Gym"
            title="Cult.fit Center"
            subtitle="State of the art fitness equipment."
            address="Indiranagar"
            distance="1.2 km away"
            fee="₹1500/mo"
            nextAvailable="Open Now"
            insurance="N/A"
            trustedCount="5,000+"
            rating="4.9"
            reviews="3.5K"
          />
          <DirectoryCard 
            image={MEDICAL_ILLUSTRATIONS.weightLoss}
            logo="https://i.pinimg.com/736x/29/77/83/297783c5096ab6ebba68e7e17441584c.jpg"
            typeTag="Fitness Studio"
            title="Gold's Gym"
            subtitle="Legacy of strength and fitness."
            address="Koramangala"
            distance="3.0 km away"
            fee="₹2000/mo"
            nextAvailable="Open 24x7"
            insurance="N/A"
            trustedCount="15,000+"
            rating="4.5"
            reviews="8.1K"
          />
        </>
      )}

      {activeTab === 'Rehabs' && (
        <>
           <DirectoryCard 
            image={MEDICAL_ILLUSTRATIONS.rehab}
            logo="https://img.freepik.com/premium-vector/medical-cross-hospital-logo-vector-design_535862-238.jpg"
            typeTag="Rehabilitation Center"
            title="Hope Rehab Clinic"
            subtitle="Expert care for complete recovery."
            address="HSR Layout"
            distance="2.5 km away"
            fee="₹1200 onwards"
            nextAvailable="Today, 04:00 PM"
            insurance="10+ Providers"
            trustedCount="2,500+"
            rating="4.8"
            reviews="950"
          />
        </>
      )}

      {activeTab === 'Clinics' && (
        <>
          <DirectoryCard
            image={MEDICAL_ILLUSTRATIONS.clinic}
            logo="https://img.freepik.com/premium-vector/medical-cross-hospital-logo-vector-design_535862-238.jpg"
            typeTag="Primary Care Clinic"
            title="Arogyon Family Clinic"
            subtitle="Doctors, nurses, labs and pharmacy under one roof."
            address="Indiranagar"
            distance="1.1 km away"
            fee="INR 350 onwards"
            nextAvailable="Today, 05:30 PM"
            insurance="18+ Providers"
            trustedCount="6,200+"
            rating="4.7"
            reviews="1.1K"
          />
          <DirectoryCard
            image={MEDICAL_ILLUSTRATIONS.homeCare}
            logo="https://img.freepik.com/premium-vector/medical-cross-hospital-logo-vector-design_535862-238.jpg"
            typeTag="Home Care Team"
            title="Arogyon Care at Home"
            subtitle="Nursing, eldercare and recovery support at home."
            address="Whitefield"
            distance="3.4 km away"
            fee="INR 900 onwards"
            nextAvailable="Today, 07:00 PM"
            insurance="12+ Providers"
            trustedCount="3,800+"
            rating="4.8"
            reviews="860"
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    paddingBottom: 80,
    gap: 20,
    minHeight: 600, // Ensure it fills the screen so sticky header works
  },
  emptyState: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
  }
});
