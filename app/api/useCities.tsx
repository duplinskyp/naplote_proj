import axios from 'axios';
import { useState, useEffect } from 'react';

interface City {
  label: string;
  latlng: number[];
  region: string;
  value: string;
  flag: string;
}

const useCities = (query: string = '') => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length < 3) {
      setCities([]);
      return;
    }

    const fetchCities = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:4002/api/cities?q=${query}`);
        console.log("API Response:", response.data); // Debugging API response
        const data = response.data.map((element: any) => ({
          label: element.label,
          latlng: element.latlng,
          region: element.region,
          value: element.value,
          flag: element.flag,
        }));
        console.log("Mapped Data:", data); // Debugging mapped data
        setCities(data);
      } catch (error) {
        console.error("Error fetching cities from local server", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, [query]);

  const getByValue = (value: string): City | undefined => {
    return cities.find((city) => city.value === value);
  };

  return { cities, loading, getByValue };
};

export default useCities;
