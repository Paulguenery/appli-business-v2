import React, { useState, useEffect } from 'react';
import { Search, MapPin, ChevronRight, Check } from 'lucide-react';
import { useLocationStore } from '@/stores/location';
import { MapContainer, TileLayer, Circle, Marker, useMap } from 'react-leaflet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import type { City } from '@/lib/types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';
import { RayonSlider } from './RayonSlider';

interface LocationSearchProps {
  onClose: () => void;
}

// Fix for Leaflet default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  return null;
}

export function LocationSearch({ onClose }: LocationSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<City[]>([]);
  const { radius, selectedCity, setRadius, setSelectedCity } = useLocationStore();
  const [mapCenter, setMapCenter] = useState<[number, number]>([46.603354, 1.888334]); // France center
  const [mapZoom, setMapZoom] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tempCity, setTempCity] = useState<City | null>(null);
  const [tempRadius, setTempRadius] = useState(radius || 10);
  const [popularCities, setPopularCities] = useState<City[]>([]);
  const [recentCities, setRecentCities] = useState<City[]>([]);

  // Load popular cities on component mount
  useEffect(() => {
    const fetchPopularCities = async () => {
      try {
        setError(null);
        const { data, error: supabaseError } = await supabase
          .from('cities')
          .select('*')
          .in('name', ['Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Lille', 'Toulouse', 'Nantes', 'Strasbourg', 'Montpellier', 'Rennes', 'Nice', 'Grenoble'])
          .limit(12);

        if (supabaseError) {
          throw new Error(supabaseError.message);
        }
        
        if (!data) {
          throw new Error('No data received from the server');
        }
        
        setPopularCities(data);
      } catch (err) {
        console.error('Error fetching popular cities:', err);
        setError('Unable to load popular cities. Please try again later.');
        setPopularCities([]);
      }
    };

    // Load recently used cities from local storage
    const loadRecentCities = () => {
      try {
        const storedCities = localStorage.getItem('recentCities');
        if (storedCities) {
          setRecentCities(JSON.parse(storedCities));
        }
      } catch (error) {
        console.error('Error loading recent cities:', error);
        setRecentCities([]);
      }
    };

    fetchPopularCities();
    loadRecentCities();
  }, []);

  useEffect(() => {
    if (searchTerm.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data, error: supabaseError } = await supabase.rpc('search_cities', {
          search_term: searchTerm,
          max_results: 5
        });

        if (supabaseError) {
          throw new Error(supabaseError.message);
        }

        if (!data) {
          throw new Error('No data received from the server');
        }

        setSuggestions(data);
      } catch (err) {
        console.error('Error searching cities:', err);
        setError('Unable to search cities. Please try again later.');
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleCitySelect = (city: City) => {
    setTempCity(city);
    setMapCenter([city.latitude, city.longitude]);
    setMapZoom(12);
    setSuggestions([]);
    setSearchTerm(`${city.name} (${city.postal_code})`);
    
    // Add to recent cities
    try {
      const updatedRecentCities = [city, ...recentCities.filter(c => c.id !== city.id)].slice(0, 5);
      setRecentCities(updatedRecentCities);
      localStorage.setItem('recentCities', JSON.stringify(updatedRecentCities));
    } catch (error) {
      console.error('Error saving recent cities:', error);
    }
  };

  const handleValidate = () => {
    if (tempCity) {
      setSelectedCity(tempCity);
      setRadius(tempRadius);
      onClose();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="h-5 w-5 text-blue-600" />
        {tempCity ? (
          <div>
            <div className="font-medium">{tempCity.name}</div>
            <div className="text-sm text-gray-500">
              {tempCity.postal_code} - {tempCity.department}
            </div>
          </div>
        ) : (
          <div className="text-gray-500">Sélectionnez une ville</div>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher une ville ou un code postal..."
          className="pl-10"
        />
      </div>

      {error && (
        <div className="p-4 text-sm text-red-600 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

      {searchTerm.length > 0 ? (
        <div className="rounded-lg border border-gray-200">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              Recherche en cours...
            </div>
          ) : suggestions.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {suggestions.map((city) => (
                <li key={city.id}>
                  <button
                    onClick={() => handleCitySelect(city)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium">{city.name}</div>
                      <div className="text-sm text-gray-500">
                        {city.postal_code} - {city.department}
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-500">
              Aucun résultat trouvé
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {recentCities.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700">Recherches récentes</h3>
              <div className="grid grid-cols-2 gap-2">
                {recentCities.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => handleCitySelect(city)}
                    className="text-left p-2 border border-gray-200 rounded-md hover:bg-gray-50 flex items-center gap-2"
                  >
                    <MapPin className="h-3 w-3 text-gray-400" />
                    <div>
                      <div className="font-medium text-sm">{city.name}</div>
                      <div className="text-xs text-gray-500">{city.department}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Villes populaires</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {popularCities.map((city) => (
                <button
                  key={city.id}
                  onClick={() => handleCitySelect(city)}
                  className="text-left p-2 border border-gray-200 rounded-md hover:bg-gray-50"
                >
                  <div className="font-medium">{city.name}</div>
                  <div className="text-xs text-gray-500">{city.department}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="h-64 rounded-lg overflow-hidden border border-gray-300 mt-4">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapUpdater center={mapCenter} zoom={mapZoom} />
          {tempCity && (
            <>
              <Marker position={[tempCity.latitude, tempCity.longitude]} />
              <Circle
                center={[tempCity.latitude, tempCity.longitude]}
                radius={tempRadius * 1000}
                pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.1 }}
              />
            </>
          )}
        </MapContainer>
      </div>

      {tempCity && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Rayon de recherche</h3>
            <RayonSlider value={tempRadius} onChange={setTempRadius} />
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <Button
          variant="outline"
          onClick={onClose}
        >
          Annuler
        </Button>
        <Button
          onClick={handleValidate}
          disabled={!tempCity}
          className="flex items-center gap-2"
        >
          <Check className="h-4 w-4" />
          Valider la sélection
        </Button>
      </div>
    </div>
  );
}