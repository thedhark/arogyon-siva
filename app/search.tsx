import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  FlatList, 
  Platform, 
  Keyboard 
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, Search, Mic, X, Sparkles, Clock, Star, MapPin, ChevronRight, CheckCircle2 } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Fonts } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBookingStore } from '@/hooks/useBookingStore';
import AnimatedScreen from '@/components/AnimatedScreen';
import FloatingCartBar from '@/components/booking/FloatingCartBar';

// "Think it, search it" prompt pills (Reference Image 2)
const INSPIRATION_PILLS = [
  { id: '1', label: 'Quick consultation', query: 'General Physician' },
  { id: '2', label: 'Second opinion', query: 'Cardiologist' },
  { id: '3', label: 'Full body checkup', query: 'Checkup' },
  { id: '4', label: 'Skin care specialist', query: 'Dermatologist' },
  { id: '5', label: 'Child specialist', query: 'Pediatrician' },
];

// Initial Recent Searches (Reference Image 2)
const INITIAL_RECENT_SEARCHES = [
  'Dr. Sneha Iyer',
  'Dermatologist',
  'Fever & Cold',
  'Physiotherapy'
];

// "WHAT'S ON YOUR MIND?" Specialty Categories (Reference Image 2 Grid)
const MIND_CATEGORIES = [
  { 
    id: 'c0', 
    title: 'Under ₹500', 
    query: 'Under 500', 
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=300' 
  },
  { 
    id: 'c1', 
    title: 'General Doctor', 
    query: 'General Physician', 
    image: 'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?q=80&w=300' 
  },
  { 
    id: 'c2', 
    title: 'Cardiologist', 
    query: 'Cardiologist', 
    image: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?q=80&w=300' 
  },
  { 
    id: 'c3', 
    title: 'Dermatologist', 
    query: 'Dermatologist', 
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=300' 
  },
  { 
    id: 'c4', 
    title: 'Pediatrician', 
    query: 'Pediatrician', 
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=300' 
  },
  { 
    id: 'c5', 
    title: 'Orthopedist', 
    query: 'Orthopedist', 
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=300' 
  },
  { 
    id: 'c6', 
    title: 'Gynaecologist', 
    query: 'Gynaecologist', 
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300' 
  },
  { 
    id: 'c7', 
    title: 'Dentist', 
    query: 'Dentist', 
    image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=300' 
  },
  { 
    id: 'c8', 
    title: 'Eye Specialist', 
    query: 'Ophthalmologist', 
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=300' 
  },
  { 
    id: 'c9', 
    title: 'ENT Specialist', 
    query: 'ENT', 
    image: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1cdb?q=80&w=300' 
  },
  { 
    id: 'c10', 
    title: 'Neurologist', 
    query: 'Neurologist', 
    image: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?q=80&w=300' 
  },
  { 
    id: 'c11', 
    title: 'Psychiatrist', 
    query: 'Psychiatrist', 
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300' 
  },
];

export default function SearchScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>(INITIAL_RECENT_SEARCHES);
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const doctors = useBookingStore(state => state.doctors);
  const doctorList = Object.values(doctors);

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleSelectQuery = (text: string) => {
    setQuery(text);
    if (!recentSearches.includes(text)) {
      setRecentSearches(prev => [text, ...prev.slice(0, 4)]);
    }
  };

  const handleClearRecents = () => {
    setRecentSearches([]);
  };

  const handleVoiceSearch = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setQuery('Dermatologist');
    }, 1500);
  };

  // Filter doctors based on query
  const filteredDoctors = query.trim()
    ? doctorList.filter(doc => 
        doc.name.toLowerCase().includes(query.toLowerCase()) ||
        doc.speciality.toLowerCase().includes(query.toLowerCase()) ||
        doc.about.toLowerCase().includes(query.toLowerCase()) ||
        doc.location.toLowerCase().includes(query.toLowerCase()) ||
        (query.toLowerCase().includes('under 500') && parseInt(doc.fee) <= 700)
      )
    : [];

  return (
    <AnimatedScreen entrance="fade" style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F9FAFB' }]}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Search Header Bar (Matches Reference Image 2 Top Layout) */}
      <View style={[styles.header, { paddingTop: insets.top + 8, backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderBottomColor: isDark ? '#2D2D2D' : '#F3F4F6' }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <ArrowLeft size={22} color={colors.text} />
        </TouchableOpacity>
        
        <View style={[styles.searchBox, { backgroundColor: isDark ? '#2A2A2A' : '#F3F4F6' }]}>
          <Search size={18} color="#9CA3AF" />
          <TextInput
            ref={inputRef}
            style={[styles.input, { color: colors.text }]}
            placeholder="Doctor name, specialty, or a symptom..."
            placeholderTextColor="#9CA3AF"
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} style={styles.clearInputBtn}>
              <X size={16} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity 
          style={[
            styles.micBtn, 
            { 
              backgroundColor: isListening ? '#F43F5E' : (isDark ? '#2A2A2A' : '#FFF0F2'),
              borderColor: isListening ? '#F43F5E' : (isDark ? '#3D3D3D' : '#FCE7F3')
            }
          ]}
          onPress={handleVoiceSearch}
          activeOpacity={0.8}
        >
          <Mic size={18} color={isListening ? '#FFFFFF' : '#F43F5E'} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* If Query Exists: Show Live Search Results */}
        {query.trim().length > 0 ? (
          <View style={styles.resultsContainer}>
            <Text style={[styles.resultsHeader, { color: colors.text }]}>
              Search Results for <Text style={{ color: '#F43F5E' }}>"{query}"</Text>
            </Text>

            {filteredDoctors.length > 0 ? (
              filteredDoctors.map(doc => (
                <TouchableOpacity 
                  key={doc.id}
                  style={[styles.docResultCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#E5E7EB' }]}
                  onPress={() => router.push(`/doctor/${doc.id}`)}
                  activeOpacity={0.85}
                >
                  <Image source={{ uri: doc.image }} style={styles.docAvatar} />
                  <View style={styles.docInfo}>
                    <View style={styles.docNameRow}>
                      <Text style={[styles.docName, { color: colors.text }]}>{doc.name}</Text>
                      {doc.verified && <CheckCircle2 size={16} color="#10B981" fill="#D1FAE5" />}
                    </View>
                    <Text style={styles.docSpeciality}>{doc.speciality}</Text>
                    
                    <View style={styles.metaRow}>
                      <View style={styles.ratingBadge}>
                        <Star size={11} color="#F59E0B" fill="#F59E0B" />
                        <Text style={styles.ratingText}>{doc.rating}</Text>
                      </View>
                      <Text style={styles.metaDivider}>•</Text>
                      <Text style={styles.metaText}>{doc.experience}</Text>
                      <Text style={styles.metaDivider}>•</Text>
                      <Text style={[styles.feeText, { color: colors.text }]}>₹{doc.fee}</Text>
                    </View>
                  </View>
                  <ChevronRight size={18} color="#9CA3AF" />
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyResults}>
                <Text style={[styles.emptyText, { color: colors.text }]}>No doctors or specialties found matching "{query}"</Text>
                <Text style={styles.emptySubtext}>Try searching for "Physiotherapist", "Gynaecologist", or "Dermatologist"</Text>
              </View>
            )}
          </View>
        ) : (
          /* Default Discovery Content (Matching Image 2 Reference) */
          <>
            {/* Section 1: "Think it, search it" Prompt Pills (Reference Image 2) */}
            <View style={styles.inspirationSection}>
              <Text style={styles.thinkItHeader}>Think it, search it</Text>
              
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                contentContainerStyle={styles.pillsRow}
              >
                {INSPIRATION_PILLS.map((pill) => (
                  <TouchableOpacity
                    key={pill.id}
                    style={[
                      styles.inspirationPill,
                      { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#E5E7EB' }
                    ]}
                    onPress={() => handleSelectQuery(pill.query)}
                    activeOpacity={0.75}
                  >
                    <Sparkles size={14} color="#F43F5E" />
                    <Text style={[styles.inspirationPillText, { color: colors.text }]}>{pill.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Section 2: "YOUR RECENT SEARCHES" (Reference Image 2) */}
            {recentSearches.length > 0 && (
              <View style={styles.recentsSection}>
                <View style={styles.sectionTitleRow}>
                  <Text style={styles.sectionTitle}>YOUR RECENT SEARCHES</Text>
                  <TouchableOpacity onPress={handleClearRecents} activeOpacity={0.7}>
                    <Text style={styles.clearBtnText}>Clear</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false} 
                  contentContainerStyle={styles.recentsRow}
                >
                  {recentSearches.map((item, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={[
                        styles.recentChip,
                        { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#E5E7EB' }
                      ]}
                      onPress={() => handleSelectQuery(item)}
                      activeOpacity={0.75}
                    >
                      <Clock size={13} color="#9CA3AF" />
                      <Text style={[styles.recentChipText, { color: colors.text }]}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Section 3: "WHAT'S ON YOUR MIND?" Specialty Grid (Reference Image 2) */}
            <View style={styles.mindSection}>
              <Text style={styles.sectionTitle}>WHAT'S ON YOUR MIND?</Text>
              
              <View style={styles.categoryGrid}>
                {MIND_CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={styles.categoryItem}
                    onPress={() => handleSelectQuery(cat.query)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.categoryImageWrapper}>
                      <Image source={{ uri: cat.image }} style={styles.categoryImage} />
                    </View>
                    <Text style={[styles.categoryTitle, { color: colors.text }]} numberOfLines={1}>
                      {cat.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        )}
      </ScrollView>

      <FloatingCartBar bottomOffset={20} />
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 10,
    borderBottomWidth: 1,
  },
  backBtn: {
    padding: 6,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    borderRadius: 23,
    paddingHorizontal: 14,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    height: '100%',
  },
  clearInputBtn: {
    padding: 4,
  },
  micBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  inspirationSection: {
    marginTop: 18,
    paddingHorizontal: 16,
  },
  thinkItHeader: {
    fontFamily: Platform.OS === 'ios' ? 'Snell Roundhand' : 'sans-serif-italic',
    fontSize: 22,
    fontWeight: '600',
    fontStyle: 'italic',
    color: '#F43F5E',
    marginBottom: 12,
  },
  pillsRow: {
    gap: 10,
    paddingRight: 16,
  },
  inspirationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  inspirationPillText: {
    fontSize: 13,
    fontWeight: '600',
  },
  recentsSection: {
    marginTop: 22,
    paddingHorizontal: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#9CA3AF',
    letterSpacing: 0.8,
  },
  clearBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F43F5E',
  },
  recentsRow: {
    gap: 10,
    paddingRight: 16,
  },
  recentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
  },
  recentChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  mindSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 14,
    rowGap: 20,
  },
  categoryItem: {
    width: '33.33%',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  categoryImageWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 8,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  categoryTitle: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  resultsContainer: {
    padding: 16,
  },
  resultsHeader: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 14,
  },
  docResultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
    gap: 12,
  },
  docAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E5E7EB',
  },
  docInfo: {
    flex: 1,
  },
  docNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  docName: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.15,
  },
  docSpeciality: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginVertical: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#D97706',
  },
  metaDivider: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  metaText: {
    fontSize: 11,
    color: '#6B7280',
  },
  feeText: {
    fontSize: 12,
    fontWeight: '800',
    marginLeft: 4,
  },
  emptyResults: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
  },
  emptySubtext: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
});
