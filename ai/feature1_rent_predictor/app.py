"""
app.py  —  AI Rent Price Predictor (Streamlit)
Trains a Random Forest model on synthetic Indian rental data and lets users
predict monthly rent by entering property details.

Run:
    streamlit run app.py
(Make sure rental_data.csv exists in the same folder — run data_generator.py first.)
"""

import os
import streamlit as st
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score, mean_squared_error

# ─────────────────────────────────────────────────────────────────────────────
# CONSTANTS
# ─────────────────────────────────────────────────────────────────────────────

CITIES      = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai',
               'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad']
FURNISHINGS = ['Unfurnished', 'Semi-Furnished', 'Fully-Furnished']

FEATURE_COLS = [
    'city', 'bedrooms', 'bathrooms', 'area_sqft', 'furnishing',
    'has_parking', 'has_gym', 'has_pool', 'has_wifi', 'has_security',
]
TARGET_COL = 'rent_amount'

# ─────────────────────────────────────────────────────────────────────────────
# DATA LOADING & MODEL TRAINING  (cached so it runs only once per session)
# ─────────────────────────────────────────────────────────────────────────────

@st.cache_resource
def load_and_train():
    """
    Load rental_data.csv, encode categoricals, train a Random Forest, and
    return everything the UI needs.

    Why Random Forest?
    ------------------
    • Handles mixed feature types (numeric + label-encoded categoricals) well.
    • Naturally non-linear — captures interactions like "Mumbai + Fully-Furnished"
      without manual feature engineering.
    • Built-in feature_importances_ attribute gives interpretability for free.
    • Robust to outliers and doesn't require feature scaling.
    • Ensemble of 100 decision trees reduces variance vs. a single tree.
    """

    # Resolve path relative to this script so the app works from any cwd
    data_path = os.path.join(os.path.dirname(__file__), 'rental_data.csv')
    df = pd.read_csv(data_path)

    # ── Label Encoding ────────────────────────────────────────────────────────
    # Random Forest (like all sklearn estimators) requires numeric inputs.
    # LabelEncoder converts each unique string category to an integer:
    #   e.g. 'Ahmedabad' → 0, 'Bangalore' → 1, 'Chennai' → 2, …
    # We store the fitted encoders so we can transform user input the same way.
    le_city       = LabelEncoder().fit(df['city'])
    le_furnishing = LabelEncoder().fit(df['furnishing'])

    df['city']       = le_city.transform(df['city'])
    df['furnishing'] = le_furnishing.transform(df['furnishing'])

    X = df[FEATURE_COLS]
    y = df[TARGET_COL]

    # ── Train / Test Split ────────────────────────────────────────────────────
    # 80 % of rows for training, 20 % held out to evaluate generalisation.
    # random_state=42 makes the split reproducible.
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    # ── Model Training ────────────────────────────────────────────────────────
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    # ── Evaluation Metrics ────────────────────────────────────────────────────
    # R² (coefficient of determination): fraction of variance in rent explained
    # by the model. 1.0 = perfect; 0.0 = no better than predicting the mean.
    #
    # RMSE (Root Mean Squared Error): average prediction error in rupees.
    # Lower is better; same units as rent_amount (INR).
    y_pred = model.predict(X_test)
    r2   = r2_score(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))

    return model, le_city, le_furnishing, r2, rmse, len(X_train)


# ─────────────────────────────────────────────────────────────────────────────
# STREAMLIT UI
# ─────────────────────────────────────────────────────────────────────────────

st.set_page_config(page_title="AI Rent Predictor", page_icon="🏠", layout="wide")

# Load model (cached after first run)
model, le_city, le_furnishing, r2, rmse, n_train = load_and_train()

# ── Page header ───────────────────────────────────────────────────────────────
st.title("🏠 AI Rent Price Predictor")
st.markdown("**Predict fair monthly rent for any property in India**")
st.markdown("---")

# ── Sidebar — model performance summary ──────────────────────────────────────
with st.sidebar:
    st.header("📊 Model Performance")

    # R² as a percentage makes it more intuitive for non-technical users
    st.metric("Model Accuracy (R²)", f"{r2 * 100:.1f}%")

    # RMSE formatted in Indian rupee style
    st.metric("Avg. Error (RMSE)", f"₹{rmse:,.0f}")

    st.metric("Training Samples", f"{n_train:,}")

    st.markdown("---")
    st.caption(
        "Model: Random Forest (100 trees)\n\n"
        "**R²** — % of rent variation explained by the model.\n\n"
        "**RMSE** — average prediction error in ₹."
    )

# ── Main input form ───────────────────────────────────────────────────────────
with st.form("prediction_form"):
    col1, col2 = st.columns(2)

    with col1:
        city       = st.selectbox("🏙️ City", CITIES)
        bedrooms   = st.slider("🛏️ Bedrooms", min_value=1, max_value=5, value=2)
        bathrooms  = st.slider("🚿 Bathrooms", min_value=1, max_value=4, value=1)
        area_sqft  = st.number_input(
            "📐 Area (sq ft)", min_value=400, max_value=4000, value=900, step=50
        )
        furnishing = st.selectbox("🛋️ Furnishing Status", FURNISHINGS)

    with col2:
        st.markdown("#### 🏢 Amenities")
        has_parking  = int(st.checkbox("🚗 Parking"))
        has_gym      = int(st.checkbox("💪 Gym"))
        has_pool     = int(st.checkbox("🏊 Swimming Pool"))
        has_wifi     = int(st.checkbox("📶 WiFi"))
        has_security = int(st.checkbox("🔒 Security"))

    submitted = st.form_submit_button("🔮 Predict Rent", use_container_width=True)

# ── Prediction & results ──────────────────────────────────────────────────────
if submitted:
    # Encode user inputs using the same LabelEncoders used during training.
    # If we used raw strings the model would receive unknown dtypes.
    city_enc       = le_city.transform([city])[0]
    furnishing_enc = le_furnishing.transform([furnishing])[0]

    input_data = pd.DataFrame([{
        'city':          city_enc,
        'bedrooms':      bedrooms,
        'bathrooms':     bathrooms,
        'area_sqft':     area_sqft,
        'furnishing':    furnishing_enc,
        'has_parking':   has_parking,
        'has_gym':       has_gym,
        'has_pool':      has_pool,
        'has_wifi':      has_wifi,
        'has_security':  has_security,
    }])

    predicted_rent = int(model.predict(input_data)[0])

    st.markdown("---")
    st.markdown("### 🎯 Prediction Result")

    # Display predicted rent prominently
    st.markdown(
        f"<h2 style='color:#2ecc71;'>Estimated Monthly Rent: "
        f"₹{predicted_rent:,}</h2>",
        unsafe_allow_html=True,
    )

    # Price range: ±₹5,000 around the prediction to reflect market variability
    low  = max(0, predicted_rent - 5000)
    high = predicted_rent + 5000
    st.info(f"**Expected Range:** ₹{low:,}  —  ₹{high:,} per month")

    # ── Feature Importance chart ──────────────────────────────────────────────
    # Random Forest computes feature_importances_ as the mean decrease in
    # impurity (Gini) across all trees and all splits on each feature.
    # Higher value → feature has more influence on the predicted rent.
    st.markdown("### 📊 Feature Importance")
    st.caption("How much each feature influenced this model's rent predictions.")

    importances = model.feature_importances_
    feat_names  = [
        'City', 'Bedrooms', 'Bathrooms', 'Area (sqft)', 'Furnishing',
        'Parking', 'Gym', 'Pool', 'WiFi', 'Security',
    ]

    # Sort by importance so the chart reads cleanly (largest bar at top)
    sorted_idx   = np.argsort(importances)
    sorted_imp   = importances[sorted_idx]
    sorted_names = [feat_names[i] for i in sorted_idx]

    fig, ax = plt.subplots(figsize=(8, 5))
    bars = ax.barh(sorted_names, sorted_imp, color='#3498db', edgecolor='white')
    ax.set_xlabel("Importance Score", fontsize=11)
    ax.set_title("Feature Importance (Random Forest)", fontsize=13, fontweight='bold')
    ax.bar_label(bars, fmt='%.3f', padding=4, fontsize=9)
    ax.spines[['top', 'right']].set_visible(False)
    plt.tight_layout()

    st.pyplot(fig)
