import prisma from "@/app/libs/prismadb";

export interface IListingsParams {
  userId?: string;
  dimensionsX?: string; // Zmena na string
  dimensionsY?: string; // Zmena na string
  locationValue?: string;
  coordinates?: number[];
  category?: string;
}

export default async function getListings(params: IListingsParams) {
  try {
    const {
      userId,
      dimensionsX,
      dimensionsY,
      locationValue,
      coordinates,
      category,
    } = params;

    let query: any = {};

    console.log('Received params:', params);

    if (userId) {
      query.userId = userId;
    }

    if (category) {
      query.category = category;
    }

    // Log raw values of dimensionsX and dimensionsY
    console.log(`Raw dimensionsX: ${dimensionsX}, dimensionsY: ${dimensionsY}`);

    // Konverzia na čísla hneď pri prijatí parametrov
    const parsedDimensionsX = dimensionsX ? parseFloat(dimensionsX) : undefined;
    const parsedDimensionsY = dimensionsY ? parseFloat(dimensionsY) : undefined;

    // Log parsed values of dimensionsX and dimensionsY
    console.log(`Parsed dimensionsX: ${parsedDimensionsX}, dimensionsY: ${parsedDimensionsY}`);

    if (!isNaN(parsedDimensionsX)) {
      query.dimensionsX = {
        gte: parsedDimensionsX
      };
      console.log(`Filtering by dimensionsX >= ${parsedDimensionsX}`);
    }

    if (!isNaN(parsedDimensionsY)) {
      query.dimensionsY = {
        gte: parsedDimensionsY
      };
      console.log(`Filtering by dimensionsY >= ${parsedDimensionsY}`);
    }

    if (locationValue) {
      query.locationValue = {
        contains: locationValue,
        mode: 'insensitive'
      };
      console.log(`Filtering by locationValue contains '${locationValue}'`);
    }

    console.log('Constructed Query:', JSON.stringify(query, null, 2)); // Logovanie query pre kontrolu

    const listings = await prisma.listing.findMany({
      where: query,
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('Listings fetched from database:', listings);

    const safeListings = listings.map((listing) => ({
      ...listing,
      createdAt: listing.createdAt.toISOString(),
      coordinates: listing.coordinates,
    }));

    console.log('Listings fetched before filtering by coordinates:', safeListings); // Debugging API response

    // Ak sú poskytnuté súradnice, filtrovať výsledky na základe vzdialenosti
    if (coordinates && coordinates.length === 2) {
      const [lat1, lon1] = coordinates;
      const R = 6371; // Polomer Zeme v kilometroch

      const toRad = (value: number) => (value * Math.PI) / 180;

      const calculateDistance = (lat2: number, lon2: number) => {
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
      };

      const filteredListings = safeListings.filter(listing => {
        const [lat2, lon2] = listing.coordinates;
        const distance = calculateDistance(lat2, lon2);
        console.log(`Distance from (${lat1}, ${lon1}) to (${lat2}, ${lon2}): ${distance} km`); // Logovanie vzdialeností
        return distance <= 100; // Filtrovanie podľa 100 km polomeru
      });

      console.log('Listings fetched after filtering by coordinates:', filteredListings); // Debugging API response after filtering

      return filteredListings;
    }

    return safeListings;
  } catch (error: any) {
    console.error('Error fetching listings:', error);
    throw new Error(error);
  }
}
