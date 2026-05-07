"""
app.py  —  Smart Property Recommendation System (Streamlit)
Recommends the best matching rental properties to a tenant using cosine similarity.

Run:
    streamlit run app.py
"""

import streamlit as st
import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, MinMaxScaler
from sklearn.metrics.pairwise import cosine_similarity

# ─────────────────────────────────────────────────────────────────────────────
# SAMPLE PROPERTY DATA
# ─────────────────────────────────────────────────────────────────────────────
# 20 realistic Indian rental properties spread across 6 cities.
# is_furnished: 0 = Unfurnished, 1 = Semi-Furnished, 2 = Fully-Furnished

RAW_PROPERTIES = [
    # Mumbai
    {"property_id": 1,  "title": "2BHK Apartment in Bandra",          "city": "Mumbai",    "property_type": "apartment", "bedrooms": 2, "bathrooms": 2, "area_sqft": 950,  "rent_amount": 55000, "has_parking": 1, "has_gym": 1, "has_pool": 0, "has_wifi": 1, "has_security": 1, "is_furnished": 2},
    {"property_id": 2,  "title": "1BHK Studio in Andheri West",       "city": "Mumbai",    "property_type": "studio",    "bedrooms": 1, "bathrooms": 1, "area_sqft": 480,  "rent_amount": 28000, "has_parking": 0, "has_gym": 0, "has_pool": 0, "has_wifi": 1, "has_security": 1, "is_furnished": 1},
    {"property_id": 3,  "title": "3BHK Villa in Juhu",                "city": "Mumbai",    "property_type": "villa",     "bedrooms": 3, "bathrooms": 3, "area_sqft": 2200, "rent_amount": 120000,"has_parking": 1, "has_gym": 1, "has_pool": 1, "has_wifi": 1, "has_security": 1, "is_furnished": 2},
    # Delhi
    {"property_id": 4,  "title": "2BHK Apartment in Dwarka",          "city": "Delhi",     "property_type": "apartment", "bedrooms": 2, "bathrooms": 2, "area_sqft": 1050, "rent_amount": 32000, "has_parking": 1, "has_gym": 0, "has_pool": 0, "has_wifi": 1, "has_security": 1, "is_furnished": 1},
    {"property_id": 5,  "title": "4BHK House in Vasant Kunj",         "city": "Delhi",     "property_type": "house",     "bedrooms": 4, "bathrooms": 3, "area_sqft": 2800, "rent_amount": 75000, "has_parking": 1, "has_gym": 0, "has_pool": 0, "has_wifi": 1, "has_security": 1, "is_furnished": 0},
    {"property_id": 6,  "title": "1BHK Apartment in Lajpat Nagar",    "city": "Delhi",     "property_type": "apartment", "bedrooms": 1, "bathrooms": 1, "area_sqft": 600,  "rent_amount": 18000, "has_parking": 0, "has_gym": 0, "has_pool": 0, "has_wifi": 0, "has_security": 1, "is_furnished": 0},
    # Bangalore
    {"property_id": 7,  "title": "2BHK Apartment in Koramangala",     "city": "Bangalore", "property_type": "apartment", "bedrooms": 2, "bathrooms": 2, "area_sqft": 1100, "rent_amount": 35000, "has_parking": 1, "has_gym": 1, "has_pool": 0, "has_wifi": 1, "has_security": 1, "is_furnished": 2},
    {"property_id": 8,  "title": "3BHK Villa in Whitefield",          "city": "Bangalore", "property_type": "villa",     "bedrooms": 3, "bathrooms": 3, "area_sqft": 2400, "rent_amount": 65000, "has_parking": 1, "has_gym": 1, "has_pool": 1, "has_wifi": 1, "has_security": 1, "is_furnished": 2},
    {"property_id": 9,  "title": "Studio Apartment in Indiranagar",   "city": "Bangalore", "property_type": "studio",    "bedrooms": 1, "bathrooms": 1, "area_sqft": 450,  "rent_amount": 16000, "has_parking": 0, "has_gym": 0, "has_pool": 0, "has_wifi": 1, "has_security": 0, "is_furnished": 1},
    {"property_id": 10, "title": "4BHK House in Sarjapur Road",       "city": "Bangalore", "property_type": "house",     "bedrooms": 4, "bathrooms": 4, "area_sqft": 3200, "rent_amount": 85000, "has_parking": 1, "has_gym": 0, "has_pool": 0, "has_wifi": 1, "has_security": 1, "is_furnished": 0},
    # Chennai
    {"property_id": 11, "title": "2BHK Apartment in T. Nagar",        "city": "Chennai",   "property_type": "apartment", "bedrooms": 2, "bathrooms": 2, "area_sqft": 1000, "rent_amount": 22000, "has_parking": 1, "has_gym": 0, "has_pool": 0, "has_wifi": 1, "has_security": 1, "is_furnished": 1},
    {"property_id": 12, "title": "3BHK House in Adyar",               "city": "Chennai",   "property_type": "house",     "bedrooms": 3, "bathrooms": 2, "area_sqft": 1800, "rent_amount": 38000, "has_parking": 1, "has_gym": 0, "has_pool": 0, "has_wifi": 0, "has_security": 1, "is_furnished": 0},
    {"property_id": 13, "title": "1BHK Studio in Anna Nagar",         "city": "Chennai",   "property_type": "studio",    "bedrooms": 1, "bathrooms": 1, "area_sqft": 500,  "rent_amount": 12000, "has_parking": 0, "has_gym": 0, "has_pool": 0, "has_wifi": 1, "has_security": 0, "is_furnished": 1},
    # Hyderabad
    {"property_id": 14, "title": "3BHK Villa in Jubilee Hills",       "city": "Hyderabad", "property_type": "villa",     "bedrooms": 3, "bathrooms": 3, "area_sqft": 2600, "rent_amount": 58000, "has_parking": 1, "has_gym": 1, "has_pool": 1, "has_wifi": 1, "has_security": 1, "is_furnished": 2},
    {"property_id": 15, "title": "2BHK Apartment in Gachibowli",      "city": "Hyderabad", "property_type": "apartment", "bedrooms": 2, "bathrooms": 2, "area_sqft": 1150, "rent_amount": 25000, "has_parking": 1, "has_gym": 1, "has_pool": 0, "has_wifi": 1, "has_security": 1, "is_furnished": 1},
    {"property_id": 16, "title": "1BHK Apartment in Banjara Hills",   "city": "Hyderabad", "property_type": "apartment", "bedrooms": 1, "bathrooms": 1, "area_sqft": 650,  "rent_amount": 14000, "has_parking": 0, "has_gym": 0, "has_pool": 0, "has_wifi": 1, "has_security": 1, "is_furnished": 0},
    # Pune
    {"property_id": 17, "title": "2BHK Apartment in Kothrud",         "city": "Pune",      "property_type": "apartment", "bedrooms": 2, "bathrooms": 2, "area_sqft": 1000, "rent_amount": 20000, "has_parking": 1, "has_gym": 0, "has_pool": 0, "has_wifi": 1, "has_security": 1, "is_furnished": 1},
    {"property_id": 18, "title": "3BHK House in Baner",               "city": "Pune",      "property_type": "house",     "bedrooms": 3, "bathrooms": 3, "area_sqft": 1900, "rent_amount": 42000, "has_parking": 1, "has_gym": 0, "has_pool": 1, "has_wifi": 1, "has_security": 1, "is_furnished": 2},
    {"property_id": 19, "title": "5BHK Villa in Kalyani Nagar",       "city": "Pune",      "property_type": "villa",     "bedrooms": 5, "bathrooms": 4, "area_sqft": 3500, "rent_amount": 95000, "has_parking": 1, "has_gym": 1, "has_pool": 1, "has_wifi": 1, "has_security": 1, "is_furnished": 2},
    {"property_id": 20, "title": "1BHK Studio in Wakad",              "city": "Pune",      "property_type": "studio",    "bedrooms": 1, "bathrooms": 1, "area_sqft": 420,  "rent_amount": 9500,  "has_parking": 0, "has_gym": 0, "has_pool": 0, "has_wifi": 0, "has_security": 0, "is_furnished": 0},
]

df = pd.DataFrame(RAW_PROPERTIES)

# ─────────────────────────────────────────────────────────────────────────────
# ENCODING & SCALING  (done once at module load, not inside the form callback)
# ─────────────────────────────────────────────────────────────────────────────

# LabelEncoder maps each unique string to an integer so sklearn can process it.
# We fit on the full known category list (not just df) to guarantee consistent
# integer assignments even if a category appears only in user input.
CITIES          = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune']
PROPERTY_TYPES  = ['apartment', 'house', 'villa', 'studio']

le_city = LabelEncoder().fit(CITIES)
le_type = LabelEncoder().fit(PROPERTY_TYPES)

FEATURE_COLS = [
    'city', 'property_type', 'bedrooms', 'bathrooms', 'area_sqft',
    'rent_amount', 'has_parking', 'has_gym', 'has_pool',
    'has_wifi', 'has_security', 'is_furnished',
]

# Build the numeric feature matrix from the property catalogue
df_encoded = df.copy()
df_encoded['city']          = le_city.transform(df['city'])
df_encoded['property_type'] = le_type.transform(df['property_type'])

# MinMaxScaler rescales every feature to [0, 1].
# Why normalization matters: without it, high-magnitude features like
# rent_amount (5 000–150 000) or area_sqft (400–3 500) would dominate the
# cosine similarity calculation and drown out binary amenity flags (0/1).
# After scaling, each feature contributes proportionally.
scaler = MinMaxScaler()
property_matrix = scaler.fit_transform(df_encoded[FEATURE_COLS])

# ─────────────────────────────────────────────────────────────────────────────
# RECOMMENDATION FUNCTION
# ─────────────────────────────────────────────────────────────────────────────

def recommend(city, prop_type, bedrooms, bathrooms, area, budget,
              parking, gym, pool, wifi, security, furnishing):
    """
    Build a preference vector from user inputs, scale it with the same
    MinMaxScaler fitted on the catalogue, then rank properties by cosine
    similarity.

    Why cosine similarity?
    ----------------------
    Cosine similarity measures the angle between two vectors rather than their
    absolute distance. This means a property that matches the *direction* of
    your preferences (e.g. luxury + spacious + amenity-rich) scores highly even
    if its raw numbers differ slightly. It works well for recommendation because
    we care about pattern alignment, not exact numeric closeness.
    Range: 0 (completely different) to 1 (identical preference profile).
    """

    # Encode the user's categorical choices using the same encoders
    city_enc = le_city.transform([city])[0]
    type_enc = le_type.transform([prop_type])[0]

    # Assemble raw preference vector (same column order as FEATURE_COLS)
    pref_raw = np.array([[
        city_enc, type_enc, bedrooms, bathrooms, area, budget,
        int(parking), int(gym), int(pool), int(wifi), int(security), furnishing,
    ]])

    # Scale using the already-fitted scaler — critical that we use transform()
    # (not fit_transform()) so the scale stays consistent with the catalogue.
    pref_scaled = scaler.transform(pref_raw)

    # Cosine similarity returns a (1 × N) array; flatten to 1-D
    scores = cosine_similarity(pref_scaled, property_matrix).flatten()

    # Attach scores to the original (human-readable) dataframe and sort
    result_df = df.copy()
    result_df['match_score'] = scores
    result_df = result_df.sort_values('match_score', ascending=False).head(5)

    return result_df, scores.max()


# ─────────────────────────────────────────────────────────────────────────────
# STREAMLIT UI
# ─────────────────────────────────────────────────────────────────────────────

st.set_page_config(page_title="Property Recommender", page_icon="🏡", layout="wide")

st.title("🏡 Smart Property Recommender")
st.markdown("**Find your perfect rental property based on your preferences**")
st.markdown("---")

# ── Input form ────────────────────────────────────────────────────────────────
with st.form("preference_form"):
    col1, col2 = st.columns(2)

    with col1:
        pref_city      = st.selectbox("🏙️ Preferred City", CITIES)
        pref_type      = st.selectbox("🏠 Property Type", PROPERTY_TYPES)
        pref_bedrooms  = st.slider("🛏️ Bedrooms Needed", 1, 5, 2)
        pref_bathrooms = st.slider("🚿 Bathrooms Needed", 1, 4, 1)
        pref_area      = st.slider("📐 Area Preference (sq ft)", 400, 3500, 1000, step=50)
        pref_budget    = st.slider("💰 Maximum Budget (₹/month)", 5000, 150000, 30000, step=1000)

    with col2:
        st.markdown("#### 🏢 Amenity Preferences")
        pref_parking  = st.checkbox("🚗 Parking")
        pref_gym      = st.checkbox("💪 Gym")
        pref_pool     = st.checkbox("🏊 Swimming Pool")
        pref_wifi     = st.checkbox("📶 WiFi")
        pref_security = st.checkbox("🔒 Security")

        st.markdown("#### 🛋️ Furnishing Preference")
        furnishing_label = st.selectbox(
            "Furnishing", ["Any", "Unfurnished", "Semi-Furnished", "Fully-Furnished"]
        )
        # Map label to numeric value used in the dataset
        furnishing_map = {"Any": 1, "Unfurnished": 0, "Semi-Furnished": 1, "Fully-Furnished": 2}
        pref_furnishing = furnishing_map[furnishing_label]

    submitted = st.form_submit_button("🔍 Find Best Properties", use_container_width=True)

# ── Results ───────────────────────────────────────────────────────────────────
if submitted:
    top5, best_score = recommend(
        pref_city, pref_type, pref_bedrooms, pref_bathrooms,
        pref_area, pref_budget, pref_parking, pref_gym,
        pref_pool, pref_wifi, pref_security, pref_furnishing,
    )

    st.markdown("---")
    st.markdown("### 🎯 Top 5 Recommended Properties")

    # Warn the user when even the best match isn't very close
    if best_score < 0.5:
        st.warning("⚠️ No close matches found — showing best available properties.")

    # Helper: build an amenity icon string for a property row
    def amenity_icons(row):
        icons = []
        if row['has_parking']:  icons.append("🚗 Parking")
        if row['has_gym']:      icons.append("💪 Gym")
        if row['has_pool']:     icons.append("🏊 Pool")
        if row['has_wifi']:     icons.append("📶 WiFi")
        if row['has_security']: icons.append("🔒 Security")
        return "  ".join(icons) if icons else "None"

    furnishing_label = {0: "Unfurnished", 1: "Semi-Furnished", 2: "Fully-Furnished"}

    # Render each recommended property as a styled card
    for _, row in top5.iterrows():
        match_pct = row['match_score'] * 100

        # Color the match badge: green ≥ 80 %, orange ≥ 60 %, red below
        if match_pct >= 80:
            badge_color = "#2ecc71"
        elif match_pct >= 60:
            badge_color = "#f39c12"
        else:
            badge_color = "#e74c3c"

        with st.container():
            st.markdown(
                f"""
                <div style="border:1px solid #ddd; border-radius:10px;
                            padding:16px 20px; margin-bottom:14px;
                            background:#fafafa;">
                  <div style="display:flex; justify-content:space-between;
                               align-items:center;">
                    <div>
                      <h4 style="margin:0;">{row['title']}</h4>
                      <span style="color:#555;">📍 {row['city']} &nbsp;|&nbsp;
                            {row['property_type'].capitalize()}</span>
                    </div>
                    <div style="text-align:right;">
                      <span style="font-size:1.4rem; font-weight:700;
                                   color:#2c3e50;">₹{row['rent_amount']:,}/mo</span>
                    </div>
                  </div>
                  <hr style="margin:10px 0;">
                  <div style="display:flex; gap:32px; flex-wrap:wrap;">
                    <span>🛏️ {row['bedrooms']} Bed</span>
                    <span>🚿 {row['bathrooms']} Bath</span>
                    <span>📐 {row['area_sqft']:,} sq ft</span>
                    <span>🛋️ {furnishing_label[row['is_furnished']]}</span>
                  </div>
                  <div style="margin-top:8px; color:#555;">
                    {amenity_icons(row)}
                  </div>
                  <div style="margin-top:12px;">
                    <span style="font-weight:600; color:{badge_color};">
                      Match: {match_pct:.1f}%
                    </span>
                  </div>
                </div>
                """,
                unsafe_allow_html=True,
            )
            # Native Streamlit progress bar (value 0.0–1.0)
            st.progress(min(row['match_score'], 1.0))

# ─────────────────────────────────────────────────────────────────────────────
# FULL PROPERTY BROWSE TABLE
# ─────────────────────────────────────────────────────────────────────────────
st.markdown("---")
st.markdown("### 🗂️ Browse All Properties")

# Build a display-friendly version of the full catalogue
display_df = df.copy()
furnishing_map = {0: 'Unfurnished', 1: 'Semi-Furnished', 2: 'Fully-Furnished'}
display_df['furnishing']     = display_df['is_furnished'].map(furnishing_map)
display_df['rent_amount']    = display_df['rent_amount'].apply(lambda x: f"₹{x:,}")
display_df['amenities']      = display_df.apply(
    lambda r: ", ".join(filter(None, [
        "Parking"  if r['has_parking']  else "",
        "Gym"      if r['has_gym']      else "",
        "Pool"     if r['has_pool']     else "",
        "WiFi"     if r['has_wifi']     else "",
        "Security" if r['has_security'] else "",
    ])) or "None",
    axis=1,
)

st.dataframe(
    display_df[['property_id', 'title', 'city', 'property_type',
                'bedrooms', 'bathrooms', 'area_sqft', 'rent_amount',
                'furnishing', 'amenities']].rename(columns={
        'property_id':   'ID',
        'title':         'Property',
        'city':          'City',
        'property_type': 'Type',
        'bedrooms':      'Beds',
        'bathrooms':     'Baths',
        'area_sqft':     'Area (sqft)',
        'rent_amount':   'Rent/Month',
        'furnishing':    'Furnishing',
        'amenities':     'Amenities',
    }),
    use_container_width=True,
    hide_index=True,
)

# ─────────────────────────────────────────────────────────────────────────────
# HOW DOES THIS WORK?
# ─────────────────────────────────────────────────────────────────────────────
with st.expander("ℹ️ How does this work?"):
    st.markdown(
        """
        Think of every property as a point in space, where each dimension
        represents one feature — city, size, rent, amenities, and so on.
        Your preferences form another point in that same space.

        **Cosine similarity** measures how closely your point and a property's
        point are *pointing in the same direction*. A score of 100 % means the
        property perfectly mirrors your taste profile; 0 % means it shares
        nothing in common.

        Before the comparison, all numbers are rescaled to the same 0–1 range
        so that a high rent figure doesn't overshadow a small amenity flag —
        every feature gets an equal say.

        The five properties with the highest similarity scores are shown as
        your top recommendations.
        """
    )
