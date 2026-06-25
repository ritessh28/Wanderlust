const sampleListings = [
{
title: "Modern Studio in Bangalore",
description: "A stylish studio apartment in Bangalore with a queen bed, modular kitchen, and clean bathroom. Ideal for professionals and couples.",
images: [
{url:"https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800",filename:"listingimage"},
{url:"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",filename:"listingimage"},
{url:"https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",filename:"listingimage"},
{url:"https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800",filename:"listingimage"},
{url:"https://images.unsplash.com/photo-1560067174-8947c9fa12a9?w=800",filename:"listingimage"}
],
price: 2200, guests:2, bedrooms:1, beds:1, bathrooms:1,
amenities:["WiFi","AC","Kitchen","TV","Workspace"],
location:"Bangalore", country:"India",
owner:"68f38051903f6a08b28c657c"
},

{
title: "Sea View Room in Goa",
description: "Relax in this cozy beachside room with balcony and sea view. Perfect for vacation stays.",
images: [
{url:"https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800",filename:"listingimage"},
{url:"https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800",filename:"listingimage"},
{url:"https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800",filename:"listingimage"},
{url:"https://images.unsplash.com/photo-1560067174-8947c9fa12a9?w=800",filename:"listingimage"},
{url:"https://images.unsplash.com/photo-1505691723518-36a5ac3be353?w=800",filename:"listingimage"}
],
price: 3000, guests:3, bedrooms:1, beds:2, bathrooms:1,
amenities:["WiFi","Beach Access","AC","Balcony"],
location:"Goa", country:"India",
owner:"68e76d4fd5f5cf5d4ca99976"
},

{
title: "Luxury Apartment in Mumbai",
description: "Premium apartment with city skyline view, spacious living room, and modern interiors.",
images: [
{url:"https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",filename:"listingimage"},
{url:"https://images.unsplash.com/photo-1560448075-bb4caa6c6c3e?w=800",filename:"listingimage"},
{url:"https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800",filename:"listingimage"},
{url:"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",filename:"listingimage"},
{url:"https://images.unsplash.com/photo-1584622781867-6a6dbb6d5b1f?w=800",filename:"listingimage"}
],
price: 4500, guests:4, bedrooms:2, beds:2, bathrooms:2,
amenities:["WiFi","AC","TV","Kitchen","Parking"],
location:"Mumbai", country:"India",
owner:"68f47c98135a2d0b687087dd"
},

{
title: "Hill View Cottage in Manali",
description: "Peaceful cottage with mountain views, wooden interiors and fireplace.",
images: [
{url:"https://images.unsplash.com/photo-1505691723518-36a5ac3be353?w=800",filename:"listingimage"},
{url:"https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800",filename:"listingimage"},
{url:"https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800",filename:"listingimage"},
{url:"https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800",filename:"listingimage"},
{url:"https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800",filename:"listingimage"}
],
price: 1800, guests:3, bedrooms:1, beds:2, bathrooms:1,
amenities:["WiFi","Heater","Mountain View"],
location:"Manali", country:"India",
owner:"68e76d4fd5f5cf5d4ca99976"
},

{
title: "Cozy Room in Delhi",
description: "Budget-friendly private room in Delhi with essential amenities.",
images: [
{url:"https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",filename:"listingimage"},
{url:"https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800",filename:"listingimage"},
{url:"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",filename:"listingimage"},
{url:"https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800",filename:"listingimage"},
{url:"https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800",filename:"listingimage"}
],
price: 1200, guests:2, bedrooms:1, beds:1, bathrooms:1,
amenities:["WiFi","Fan","TV"],
location:"Delhi", country:"India",
owner:"68f38051903f6a08b28c657c"
},

{
title: "Lake View Stay in Udaipur",
description: "Romantic room overlooking the beautiful lake with balcony.",
images: [
{url:"https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800",filename:"listingimage"},
{url:"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",filename:"listingimage"},
{url:"https://images.unsplash.com/photo-1584622781867-6a6dbb6d5b1f?w=800",filename:"listingimage"},
{url:"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",filename:"listingimage"},
{url:"https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800",filename:"listingimage"}
],
price: 2600, guests:2, bedrooms:1, beds:1, bathrooms:1,
amenities:["WiFi","Balcony","AC"],
location:"Udaipur", country:"India",
owner:"68f47c98135a2d0b687087dd"
},

// ----------- INTERNATIONAL -----------

{
title: "Apartment in New York",
description: "Modern apartment in NYC with stylish interiors and city views.",
images: [
{url:"https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",filename:"listingimage"},
{url:"https://images.unsplash.com/photo-1560448075-bb4caa6c6c3e?w=800",filename:"listingimage"},
{url:"https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800",filename:"listingimage"},
{url:"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",filename:"listingimage"},
{url:"https://images.unsplash.com/photo-1584622781867-6a6dbb6d5b1f?w=800",filename:"listingimage"}
],
price: 6000, guests:4, bedrooms:2, beds:2, bathrooms:2,
amenities:["WiFi","AC","Kitchen"],
location:"New York", country:"USA",
owner:"68f38051903f6a08b28c657c"
},

{
title: "Beach Villa in Bali",
description: "Luxury villa with private pool and beach access.",
images: [
{url:"https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800",filename:"listingimage"},
{url:"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",filename:"listingimage"},
{url:"https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",filename:"listingimage"},
{url:"https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800",filename:"listingimage"},
{url:"https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800",filename:"listingimage"}
],
price: 5500, guests:5, bedrooms:2, beds:3, bathrooms:2,
amenities:["Pool","WiFi","AC"],
location:"Bali", country:"Indonesia",
owner:"68e76d4fd5f5cf5d4ca99976"
},

{
title: "Studio in Paris",
description: "Elegant studio apartment in central Paris.",
images: [
{url:"https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800",filename:"listingimage"},
{url:"https://images.unsplash.com/photo-1560448075-bb4caa6c6c3e?w=800",filename:"listingimage"},
{url:"https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800",filename:"listingimage"},
{url:"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",filename:"listingimage"},
{url:"https://images.unsplash.com/photo-1584622781867-6a6dbb6d5b1f?w=800",filename:"listingimage"}
],
price: 4800, guests:2, bedrooms:1, beds:1, bathrooms:1,
amenities:["WiFi","Kitchen"],
location:"Paris", country:"France",
owner:"68f47c98135a2d0b687087dd"
}

];
module.exports = { data: sampleListings };