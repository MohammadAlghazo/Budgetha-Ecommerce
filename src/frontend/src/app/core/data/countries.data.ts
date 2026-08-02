export interface CountryData {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
  phoneLength: number | number[];
  states?: string[];
}

export const COUNTRIES: CountryData[] = [
  { name: 'Jordan', code: 'JO', dialCode: '+962', flag: '🇯🇴', phoneLength: 9, states: ['Amman', 'Zarqa', 'Irbid', 'Aqaba', 'Karak', 'Madaba', 'Jerash', 'Ajloun', 'Mafraq', 'Tafila', 'Ma\'an', 'Balqa'] },
  { name: 'Saudi Arabia', code: 'SA', dialCode: '+966', flag: '🇸🇦', phoneLength: 9, states: ['Riyadh', 'Mecca', 'Medina', 'Eastern Province', 'Asir', 'Tabuk', 'Qassim', 'Ha\'il', 'Jizan', 'Najran', 'Al Bahah', 'Northern Borders', 'Al Jawf'] },
  { name: 'United Arab Emirates', code: 'AE', dialCode: '+971', flag: '🇦🇪', phoneLength: 9, states: ['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah'] },
  { name: 'Kuwait', code: 'KW', dialCode: '+965', flag: '🇰🇼', phoneLength: 8, states: ['Al Asimah', 'Hawalli', 'Farwaniyah', 'Ahmadi', 'Jahra', 'Mubarak Al-Kabeer'] },
  { name: 'Bahrain', code: 'BH', dialCode: '+973', flag: '🇧🇭', phoneLength: 8, states: ['Capital', 'Muharraq', 'Northern', 'Southern'] },
  { name: 'Qatar', code: 'QA', dialCode: '+974', flag: '🇶🇦', phoneLength: 8, states: ['Doha', 'Al Rayyan', 'Al Wakrah', 'Al Khor', 'Al Shamal', 'Al Daayen', 'Al Sheehaniya', 'Umm Salal'] },
  { name: 'Oman', code: 'OM', dialCode: '+968', flag: '🇴🇲', phoneLength: 8, states: ['Muscat', 'Dhofar', 'Musandam', 'Al Buraymi', 'Ad Dakhiliyah', 'Al Batinah North', 'Al Batinah South', 'Ash Sharqiyah North', 'Ash Sharqiyah South', 'Al Dhahirah', 'Al Wusta'] },
  { name: 'Egypt', code: 'EG', dialCode: '+20', flag: '🇪🇬', phoneLength: 10, states: ['Cairo', 'Alexandria', 'Giza', 'Qalyubia', 'Port Said', 'Suez', 'Luxor', 'Aswan', 'Asyut', 'Sohag', 'Qena', 'Red Sea', 'Beheira', 'Fayoum', 'Gharbia', 'Ismailia', 'Menofia', 'Minya', 'Dakahlia', 'Damietta', 'Sharqia', 'Kafr el-Sheikh', 'Matruh', 'New Valley', 'North Sinai', 'South Sinai'] },
  { name: 'Lebanon', code: 'LB', dialCode: '+961', flag: '🇱🇧', phoneLength: 7, states: ['Beirut', 'Mount Lebanon', 'North Lebanon', 'South Lebanon', 'Bekaa', 'Nabatiyeh', 'Akkar', 'Baalbek-Hermel'] },
  { name: 'Iraq', code: 'IQ', dialCode: '+964', flag: '🇮🇶', phoneLength: 10, states: ['Baghdad', 'Basra', 'Nineveh', 'Erbil', 'Sulaymaniyah', 'Kirkuk', 'Najaf', 'Karbala', 'Wasit', 'Babylon', 'Diyala', 'Anbar', 'Saladin', 'Dohuk', 'Muthanna', 'Dhi Qar', 'Maysan', 'Qadisiyyah'] },
  { name: 'United States', code: 'US', dialCode: '+1', flag: '🇺🇸', phoneLength: 10, states: ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'] },
  { name: 'United Kingdom', code: 'GB', dialCode: '+44', flag: '🇬🇧', phoneLength: 10, states: ['England', 'Scotland', 'Wales', 'Northern Ireland'] },
  { name: 'Canada', code: 'CA', dialCode: '+1', flag: '🇨🇦', phoneLength: 10, states: ['Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador', 'Northwest Territories', 'Nova Scotia', 'Nunavut', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan', 'Yukon'] },
  { name: 'Germany', code: 'DE', dialCode: '+49', flag: '🇩🇪', phoneLength: [10, 11], states: ['Baden-Württemberg', 'Bavaria', 'Berlin', 'Brandenburg', 'Bremen', 'Hamburg', 'Hesse', 'Lower Saxony', 'Mecklenburg-Vorpommern', 'North Rhine-Westphalia', 'Rhineland-Palatinate', 'Saarland', 'Saxony', 'Saxony-Anhalt', 'Schleswig-Holstein', 'Thuringia'] },
  { name: 'France', code: 'FR', dialCode: '+33', flag: '🇫🇷', phoneLength: 9, states: ['Île-de-France', 'Auvergne-Rhône-Alpes', 'Nouvelle-Aquitaine', 'Occitanie', 'Hauts-de-France', 'Grand Est', 'Normandy', 'Pays de la Loire', 'Bretagne', 'Bourgogne-Franche-Comté', 'Centre-Val de Loire', 'Provence-Alpes-Côte d\'Azur', 'Corsica'] },
  { name: 'Australia', code: 'AU', dialCode: '+61', flag: '🇦🇺', phoneLength: 9, states: ['New South Wales', 'Victoria', 'Queensland', 'Western Australia', 'South Australia', 'Tasmania', 'Australian Capital Territory', 'Northern Territory'] },
  { name: 'Turkey', code: 'TR', dialCode: '+90', flag: '🇹🇷', phoneLength: 10, states: ['Istanbul', 'Ankara', 'Izmir', 'Bursa', 'Antalya', 'Adana', 'Konya', 'Gaziantep', 'Mersin', 'Kayseri'] },
  { name: 'Pakistan', code: 'PK', dialCode: '+92', flag: '🇵🇰', phoneLength: 10, states: ['Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan', 'Islamabad', 'Gilgit-Baltistan', 'Azad Kashmir'] },
  { name: 'India', code: 'IN', dialCode: '+91', flag: '🇮🇳', phoneLength: 10, states: ['Andhra Pradesh', 'Delhi', 'Gujarat', 'Karnataka', 'Kerala', 'Maharashtra', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal'] },
];
