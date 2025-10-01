/**
 * Nominatim Geocoding Proxy
 * وكيل Nominatim للجغرافيا - لوكس بايت
 */

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        success: false,
        error: 'Latitude and longitude are required'
      });
    }

    // Validate coordinates
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid coordinates'
      });
    }

    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return res.status(400).json({
        success: false,
        error: 'Coordinates out of range'
      });
    }

    // Build Nominatim URL
    const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=ar&addressdetails=1&zoom=18`;

    // Make request to Nominatim
    const response = await fetch(nominatimUrl, {
      headers: {
        'User-Agent': 'LuxbyteBot/1.0 (support@luxbyte.eg)',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Nominatim API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Cache the response for 10 minutes
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=60');

    // Ensure we always return a proper JSON response
    const response = {
      success: true,
      data: data
    };
    
    return res.status(200).json(response);

  } catch (error) {
    console.error('Geocoding error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error: ' + error.message
    });
  }
}
