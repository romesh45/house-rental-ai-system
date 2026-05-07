"""
data_generator.py
Generates synthetic training data for Indian rental properties and saves it as rental_data.csv.
Run this script once before launching app.py to produce the dataset.
"""

import numpy as np
import pandas as pd

# Fix the random seed so every run produces the same dataset
np.random.seed(42)

N = 1000  # number of synthetic property samples

# ── City pool and their base monthly rents (INR) ──────────────────────────────
# These reflect approximate median rents in each metro as of 2024.
CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai',
          'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad']

BASE_RENT = {
    'Mumbai':    35000,
    'Delhi':     28000,
    'Bangalore': 25000,
    'Chennai':   18000,
    'Hyderabad': 16000,
    'Pune':      15000,
    'Kolkata':   12000,
    'Ahmedabad': 11000,
}

# ── Raw feature generation ─────────────────────────────────────────────────────
city       = np.random.choice(CITIES, size=N)
bedrooms   = np.random.randint(1, 6, size=N)        # 1–5 BHK
bathrooms  = np.random.randint(1, 5, size=N)        # 1–4 bathrooms
area_sqft  = np.random.randint(400, 4001, size=N)   # 400–4000 sq ft

furnishing = np.random.choice(
    ['Unfurnished', 'Semi-Furnished', 'Fully-Furnished'], size=N
)

# Binary amenity flags (0 = absent, 1 = present)
has_parking  = np.random.randint(0, 2, size=N)
has_gym      = np.random.randint(0, 2, size=N)
has_pool     = np.random.randint(0, 2, size=N)
has_wifi     = np.random.randint(0, 2, size=N)
has_security = np.random.randint(0, 2, size=N)

# ── Rent calculation ───────────────────────────────────────────────────────────
# Step 1: start from city base rent
base = np.array([BASE_RENT[c] for c in city], dtype=float)

# Step 2: each extra bedroom adds ₹3,000; each bathroom adds ₹1,500
base += bedrooms  * 3000
base += bathrooms * 1500

# Step 3: per-square-foot contribution (₹8 / sqft captures size premium)
base += area_sqft * 8

# Step 4: furnishing multiplier — furnished units command higher rent
FURNISHING_MULTIPLIER = {
    'Unfurnished':    1.0,
    'Semi-Furnished': 1.2,
    'Fully-Furnished': 1.5,
}
multiplier = np.array([FURNISHING_MULTIPLIER[f] for f in furnishing])
base *= multiplier

# Step 5: each amenity present adds ₹2,000 to reflect lifestyle premium
amenity_bonus = (has_parking + has_gym + has_pool + has_wifi + has_security) * 2000
base += amenity_bonus

# Step 6: add realistic market noise (±₹2,000) so the data isn't perfectly linear
noise = np.random.uniform(-2000, 2000, size=N)
rent_amount = (base + noise).astype(int)

# ── Assemble DataFrame and save ───────────────────────────────────────────────
df = pd.DataFrame({
    'city':          city,
    'bedrooms':      bedrooms,
    'bathrooms':     bathrooms,
    'area_sqft':     area_sqft,
    'furnishing':    furnishing,
    'has_parking':   has_parking,
    'has_gym':       has_gym,
    'has_pool':      has_pool,
    'has_wifi':      has_wifi,
    'has_security':  has_security,
    'rent_amount':   rent_amount,
})

output_path = 'rental_data.csv'
df.to_csv(output_path, index=False)

print(f"Dataset saved → {output_path}")
print(f"Shape: {df.shape}")
print(df.head())
print(df.describe())
