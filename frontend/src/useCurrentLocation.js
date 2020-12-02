import { useEffect, useState } from 'react';

const useCurrentLocation = (options = {}) => {
  // store error message in state
  const [error, setError] = useState();

  // store location in state
  const [location, setLocation] = useState();

  // Success handler for geolocation's `getCurrentPosition` method
  const handleSuccess = (position) => {
    const { latitude, longitude } = position.coords;

    setLocation({
      latitude,
      longitude,
    });
  };

  // Error handler for geolocation's `getCurrentPosition` method
  const handleError = (err) => {
    setError(err.message);
  };

  useEffect(() => {
    // If the geolocation is not defined in the used browser you can handle it as an error
    if (!navigator.geolocation) {
      setError('Geolocation is not supported.');
    } else {
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
    }
  }, []);

  return { location, error };
};

export default useCurrentLocation;
