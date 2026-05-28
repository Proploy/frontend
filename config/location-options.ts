export const OTHER_CITY_VALUE = '__other_city__'

export type LocationOption = {
  value: string
  label: string
}

type CountryLocation = LocationOption & {
  cities: string[]
}

const COUNTRY_LOCATIONS: CountryLocation[] = [
  {
    value: 'United States',
    label: 'United States',
    cities: ['San Francisco', 'New York', 'Seattle', 'Austin', 'Boston', 'Los Angeles', 'Chicago', 'Denver', 'Raleigh'],
  },
  {
    value: 'Canada',
    label: 'Canada',
    cities: ['Toronto', 'Vancouver', 'Montreal', 'Ottawa', 'Calgary', 'Waterloo'],
  },
  {
    value: 'United Kingdom',
    label: 'United Kingdom',
    cities: ['London', 'Manchester', 'Cambridge', 'Oxford', 'Edinburgh', 'Bristol'],
  },
  {
    value: 'Ireland',
    label: 'Ireland',
    cities: ['Dublin', 'Cork', 'Galway', 'Limerick'],
  },
  {
    value: 'Germany',
    label: 'Germany',
    cities: ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne', 'Stuttgart'],
  },
  {
    value: 'France',
    label: 'France',
    cities: ['Paris', 'Lyon', 'Toulouse', 'Nantes', 'Lille'],
  },
  {
    value: 'Netherlands',
    label: 'Netherlands',
    cities: ['Amsterdam', 'Rotterdam', 'Utrecht', 'Eindhoven', 'The Hague'],
  },
  {
    value: 'Sweden',
    label: 'Sweden',
    cities: ['Stockholm', 'Gothenburg', 'Malmo', 'Uppsala'],
  },
  {
    value: 'Switzerland',
    label: 'Switzerland',
    cities: ['Zurich', 'Geneva', 'Lausanne', 'Basel', 'Bern'],
  },
  {
    value: 'Spain',
    label: 'Spain',
    cities: ['Madrid', 'Barcelona', 'Valencia', 'Malaga', 'Bilbao'],
  },
  {
    value: 'Poland',
    label: 'Poland',
    cities: ['Warsaw', 'Krakow', 'Wroclaw', 'Gdansk', 'Poznan'],
  },
  {
    value: 'Estonia',
    label: 'Estonia',
    cities: ['Tallinn', 'Tartu'],
  },
  {
    value: 'United Arab Emirates',
    label: 'United Arab Emirates',
    cities: ['Dubai', 'Abu Dhabi', 'Sharjah'],
  },
  {
    value: 'India',
    label: 'India',
    cities: ['Bengaluru', 'Hyderabad', 'Pune', 'Mumbai', 'Delhi', 'New Delhi', 'Gurugram', 'Noida', 'Chennai'],
  },
  {
    value: 'Singapore',
    label: 'Singapore',
    cities: ['Singapore'],
  },
  {
    value: 'Australia',
    label: 'Australia',
    cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Canberra', 'Adelaide'],
  },
  {
    value: 'New Zealand',
    label: 'New Zealand',
    cities: ['Auckland', 'Wellington', 'Christchurch'],
  },
  {
    value: 'Japan',
    label: 'Japan',
    cities: ['Tokyo', 'Osaka', 'Kyoto', 'Fukuoka', 'Yokohama'],
  },
  {
    value: 'South Korea',
    label: 'South Korea',
    cities: ['Seoul', 'Busan', 'Pangyo', 'Incheon'],
  },
  {
    value: 'Israel',
    label: 'Israel',
    cities: ['Tel Aviv', 'Jerusalem', 'Haifa', 'Herzliya'],
  },
  {
    value: 'Brazil',
    label: 'Brazil',
    cities: ['Sao Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Florianopolis'],
  },
  {
    value: 'Mexico',
    label: 'Mexico',
    cities: ['Mexico City', 'Guadalajara', 'Monterrey'],
  },
  {
    value: 'South Africa',
    label: 'South Africa',
    cities: ['Cape Town', 'Johannesburg', 'Pretoria', 'Durban'],
  },
]

export const COUNTRY_OPTIONS: LocationOption[] = COUNTRY_LOCATIONS.map(({ value, label }) => ({
  value,
  label,
}))

export const TIMEZONE_OPTIONS: LocationOption[] = [
  { value: 'America/Los_Angeles', label: 'America/Los_Angeles (Pacific Time)' },
  { value: 'America/Denver', label: 'America/Denver (Mountain Time)' },
  { value: 'America/Chicago', label: 'America/Chicago (Central Time)' },
  { value: 'America/New_York', label: 'America/New_York (Eastern Time)' },
  { value: 'America/Toronto', label: 'America/Toronto' },
  { value: 'America/Mexico_City', label: 'America/Mexico_City' },
  { value: 'America/Sao_Paulo', label: 'America/Sao_Paulo' },
  { value: 'Europe/London', label: 'Europe/London' },
  { value: 'Europe/Dublin', label: 'Europe/Dublin' },
  { value: 'Europe/Berlin', label: 'Europe/Berlin' },
  { value: 'Europe/Paris', label: 'Europe/Paris' },
  { value: 'Europe/Amsterdam', label: 'Europe/Amsterdam' },
  { value: 'Europe/Stockholm', label: 'Europe/Stockholm' },
  { value: 'Europe/Zurich', label: 'Europe/Zurich' },
  { value: 'Europe/Madrid', label: 'Europe/Madrid' },
  { value: 'Europe/Warsaw', label: 'Europe/Warsaw' },
  { value: 'Europe/Tallinn', label: 'Europe/Tallinn' },
  { value: 'Asia/Dubai', label: 'Asia/Dubai' },
  { value: 'Asia/Jerusalem', label: 'Asia/Jerusalem' },
  { value: 'Asia/Kolkata', label: 'Asia/Kolkata (India Standard Time)' },
  { value: 'Asia/Singapore', label: 'Asia/Singapore' },
  { value: 'Asia/Tokyo', label: 'Asia/Tokyo' },
  { value: 'Asia/Seoul', label: 'Asia/Seoul' },
  { value: 'Australia/Sydney', label: 'Australia/Sydney' },
  { value: 'Australia/Melbourne', label: 'Australia/Melbourne' },
  { value: 'Pacific/Auckland', label: 'Pacific/Auckland' },
  { value: 'Africa/Johannesburg', label: 'Africa/Johannesburg' },
  { value: 'UTC', label: 'UTC' },
]

export function getCityOptionsForCountry(country: string): LocationOption[] {
  const location = COUNTRY_LOCATIONS.find((item) => item.value === country)
  const cities = location?.cities ?? []
  return [
    ...cities.map((city) => ({ value: city, label: city })),
    { value: OTHER_CITY_VALUE, label: 'Other city' },
  ]
}

export function isKnownCityForCountry(country: string, city: string): boolean {
  const location = COUNTRY_LOCATIONS.find((item) => item.value === country)
  return Boolean(location?.cities.includes(city))
}
