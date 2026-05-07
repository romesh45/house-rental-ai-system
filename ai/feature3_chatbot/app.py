"""
app.py  —  Property Assistant Chatbot (Streamlit + Groq + LLaMA 3)

Groq is a free-tier AI inference API that runs open-source models like LLaMA 3
at very high speed. Unlike OpenAI, Groq's free tier has generous rate limits
and requires no credit card, making it ideal for projects and prototypes.

LLaMA 3 (llama3-8b-8192) is Meta's open-source large language model. The
8b variant has 8 billion parameters and supports a context window of 8,192
tokens — large enough to hold a full conversation with property context.

Run:
    streamlit run app.py
(Replace GROQ_API_KEY in .env with your real key from console.groq.com)
"""

import os
import streamlit as st
from groq import Groq
from dotenv import load_dotenv

# Load environment variables from the .env file in this directory.
# We store API keys in .env (and keep it out of git) so that secrets are
# never hard-coded in source code — protecting them from accidental exposure
# if the code is shared or pushed to a public repository.
load_dotenv()

# Initialise the Groq client once using the key from the environment.
# Groq raises an AuthenticationError at call-time if the key is invalid.
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# ─────────────────────────────────────────────────────────────────────────────
# PROPERTY KNOWLEDGE BASE
# ─────────────────────────────────────────────────────────────────────────────

PROPERTY_CONTEXT = """Our rental platform has the following available properties:

1. 2BHK Apartment in Bandra, Mumbai - Rent: Rs.55,000/month - Fully Furnished - Amenities: Parking, Gym, WiFi, Security
2. 1BHK Studio in Andheri West, Mumbai - Rent: Rs.28,000/month - Semi Furnished - Amenities: WiFi, Security
3. 3BHK Villa in Juhu, Mumbai - Rent: Rs.1,20,000/month - Fully Furnished - Amenities: Parking, Gym, Pool, WiFi, Security
4. 2BHK Apartment in Dwarka, Delhi - Rent: Rs.32,000/month - Semi Furnished - Amenities: Parking, WiFi, Security
5. 4BHK House in Vasant Kunj, Delhi - Rent: Rs.75,000/month - Unfurnished - Amenities: Parking, WiFi, Security
6. 1BHK Apartment in Lajpat Nagar, Delhi - Rent: Rs.18,000/month - Unfurnished - Amenities: Security
7. 2BHK Apartment in Koramangala, Bangalore - Rent: Rs.35,000/month - Fully Furnished - Amenities: Parking, Gym, WiFi, Security
8. 3BHK Villa in Whitefield, Bangalore - Rent: Rs.65,000/month - Fully Furnished - Amenities: Parking, Gym, Pool, WiFi, Security
9. Studio Apartment in Indiranagar, Bangalore - Rent: Rs.16,000/month - Semi Furnished - Amenities: WiFi
10. 4BHK House in Sarjapur Road, Bangalore - Rent: Rs.85,000/month - Unfurnished - Amenities: Parking, WiFi, Security

Booking Process: Tenants can register on the platform, browse properties, and submit booking requests. Owners review and approve or reject requests. Tenants can track their booking status.

Platform Features: Property search by city and budget, detailed property views with images, booking request system, owner dashboard, tenant dashboard."""

# ─────────────────────────────────────────────────────────────────────────────
# SYSTEM PROMPT
# ─────────────────────────────────────────────────────────────────────────────

# A system prompt is a hidden instruction sent to the AI at the start of every
# conversation. It defines the assistant's role, personality, and constraints
# before the user says anything. The model treats it as ground truth and shapes
# all of its responses accordingly.
SYSTEM_PROMPT = f"""You are a helpful and friendly property rental assistant for the House Rental AI System platform.

You help tenants find properties, understand rental terms, learn about amenities, and navigate the booking process.

You have access to the following property knowledge base:
{PROPERTY_CONTEXT}

Guidelines:
- Only answer questions related to properties, rentals, booking, amenities, and this platform.
- Be concise, warm, and helpful. Avoid long unnecessary explanations.
- If the user asks about something completely unrelated to properties or rentals, politely say you can only assist with rental-related queries and redirect them.
- Always respond in English.
- When listing properties, format them clearly so they are easy to read.
"""

# ─────────────────────────────────────────────────────────────────────────────
# STREAMLIT PAGE CONFIG
# ─────────────────────────────────────────────────────────────────────────────

st.set_page_config(page_title="Property Assistant Chatbot", page_icon="🏠", layout="wide")

st.title("🏠 Property Assistant Chatbot")
st.markdown("**Ask me anything about our rental properties**")
st.markdown("---")

# ─────────────────────────────────────────────────────────────────────────────
# CHAT HISTORY  (stored in Streamlit session state)
# ─────────────────────────────────────────────────────────────────────────────

# st.session_state persists values across Streamlit reruns within the same
# browser session. We store the full message list here so the model receives
# the entire conversation on every API call — this is how LLMs maintain context.
# Without this history, each message would be answered in isolation.
if "messages" not in st.session_state:
    st.session_state.messages = [
        {
            "role": "assistant",
            "content": (
                "Hello! I am your property rental assistant. "
                "I can help you find properties, answer questions about rent, "
                "amenities, booking process, and more. "
                "What are you looking for today?"
            ),
        }
    ]

# ─────────────────────────────────────────────────────────────────────────────
# SIDEBAR
# ─────────────────────────────────────────────────────────────────────────────

with st.sidebar:
    st.header("💬 Quick Questions")
    st.caption("Click any question to send it instantly.")

    # Each button injects its label directly into the chat as a user message
    QUICK_QUESTIONS = [
        "What properties are available in Mumbai?",
        "Show me properties under Rs.30,000",
        "How do I book a property?",
        "Which properties have a gym?",
        "What is the most expensive property?",
    ]

    for question in QUICK_QUESTIONS:
        if st.button(question, use_container_width=True):
            # Store the clicked question so the main loop processes it below
            st.session_state["quick_input"] = question

    st.markdown("---")

    if st.button("🗑️ Clear Chat", use_container_width=True):
        # Reset to just the welcome message
        st.session_state.messages = [
            {
                "role": "assistant",
                "content": (
                    "Hello! I am your property rental assistant. "
                    "I can help you find properties, answer questions about rent, "
                    "amenities, booking process, and more. "
                    "What are you looking for today?"
                ),
            }
        ]
        st.rerun()

# ─────────────────────────────────────────────────────────────────────────────
# DISPLAY CHAT HISTORY
# ─────────────────────────────────────────────────────────────────────────────

for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# ─────────────────────────────────────────────────────────────────────────────
# HELPER: call Groq and stream the response into chat history
# ─────────────────────────────────────────────────────────────────────────────

def get_ai_response(user_text: str):
    """Add user_text to history, call Groq, display and store the reply."""

    # Append user message to history and display it immediately
    st.session_state.messages.append({"role": "user", "content": user_text})
    with st.chat_message("user"):
        st.markdown(user_text)

    # Build the message list the API expects:
    # [system prompt] + [full conversation history]
    # Sending the entire history lets LLaMA 3 understand prior context
    # (e.g. "the second one" referring to a property mentioned earlier).
    api_messages = [{"role": "system", "content": SYSTEM_PROMPT}] + [
        {"role": m["role"], "content": m["content"]}
        for m in st.session_state.messages
    ]

    try:
        # temperature controls how creative / random the model's output is.
        # 0.0 = deterministic and factual; 1.0 = more varied and creative.
        # 0.7 strikes a balance: helpful and accurate, but natural-sounding.
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=api_messages,
            max_tokens=500,
            temperature=0.7,
        )
        reply = response.choices[0].message.content

    except Exception as e:
        reply = (
            f"Sorry, I encountered an error while processing your request: {e}\n\n"
            "Please check your GROQ_API_KEY in the .env file and try again."
        )

    # Display and persist the assistant reply
    with st.chat_message("assistant"):
        st.markdown(reply)
    st.session_state.messages.append({"role": "assistant", "content": reply})


# ─────────────────────────────────────────────────────────────────────────────
# INPUT HANDLING  (typed input OR sidebar quick-question button)
# ─────────────────────────────────────────────────────────────────────────────

# Handle quick-question button clicks (set in the sidebar above)
if "quick_input" in st.session_state:
    quick_text = st.session_state.pop("quick_input")
    get_ai_response(quick_text)
    st.rerun()

# Handle typed input from the chat box
if prompt := st.chat_input("Ask about properties, rent, amenities..."):
    get_ai_response(prompt)
