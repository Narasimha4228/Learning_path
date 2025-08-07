import streamlit as st
import google.generativeai as genai
import os
import time
from datetime import datetime
from dotenv import load_dotenv

# Must be the first Streamlit command
st.set_page_config(
    page_title="Learning Assistant",
    page_icon="🎓",
    layout="wide"
)

# Load environment variables
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# Custom styling
st.markdown("""
<style>
    .chat-bubble { padding: 15px; border-radius: 15px; margin: 5px 0; max-width: 80%; }
    .user-bubble { background: #007bff; color: white; margin-left: auto; }
    .assistant-bubble { background: #f1f3f4; color: black; }
    .sidebar-stats { padding: 20px; background: #f8f9fa; border-radius: 10px; }
</style>
""", unsafe_allow_html=True)

# Configure API
if not GOOGLE_API_KEY:
    st.error("Please set the GOOGLE_API_KEY in .env file")
    st.stop()
    
genai.configure(api_key=GOOGLE_API_KEY)

# Initialize model with safety settings
safety_settings = [
    {
        "category": "HARM_CATEGORY_HARASSMENT",
        "threshold": "BLOCK_NONE"
    },
    {
        "category": "HARM_CATEGORY_HATE_SPEECH",
        "threshold": "BLOCK_NONE"
    },
    {
        "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        "threshold": "BLOCK_NONE"
    },
    {
        "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
        "threshold": "BLOCK_NONE"
    }
]

model = genai.GenerativeModel(
    model_name='gemini-pro',
    safety_settings=safety_settings
)

def generate_response(prompt, history):
    try:
        with st.spinner("🤔 Thinking..."):
            # Create chat context
            chat = model.start_chat(history=[])
            
            # Format conversation context
            messages = []
            if history:
                for line in history.split('\n'):
                    if line.startswith('user: '):
                        messages.append({'role': 'user', 'content': line[6:]})
                    elif line.startswith('assistant: '):
                        messages.append({'role': 'model', 'content': line[11:]})
            
            # Add current prompt
            messages.append({'role': 'user', 'content': prompt})

            # Set generation config
            generation_config = genai.types.GenerationConfig(
                temperature=0.7,
                top_p=0.8,
                top_k=40,
                max_output_tokens=2048,
            )
            
            # Send messages to chat
            for msg in messages:
                if msg['role'] == 'user':
                    chat.send_message(msg['content'], generation_config=generation_config)
                elif msg['role'] == 'model':
                    # Add assistant's previous responses to context
                    chat._history.append(msg)

            # Generate new response
            response = chat.send_message(
                prompt,
                generation_config=generation_config,
            )

            if response and response.text:
                return response.text.strip()
            else:
                return "I apologize, but I couldn't generate a response. Please try again."
                
    except Exception as e:
        st.error(f"Generation error: {str(e)}")
        st.error("If you see a model not found error, please wait a moment and try again.")
        return "I encountered an error. Please try again in a moment."

def main():
    # Sidebar
    with st.sidebar:
        st.title("📊 Dashboard")
        st.markdown("### Progress Tracker")
        st.metric("Completed Courses", "    1")
        st.metric("Active Courses", "2")

    # Main chat interface
    st.title("🎓 Learning Path Assistant")
    st.markdown("---")

    # Initialize chat history
    if "messages" not in st.session_state:
        st.session_state.messages = []

    # Display chat history
    for msg in st.session_state.messages:
        with st.chat_message(msg["role"]):
            st.markdown(msg["content"])

    # Chat input
    if prompt := st.chat_input("Ask me anything..."):
        st.session_state.messages.append({"role": "user", "content": prompt})
        
        # Generate response
        history = "\n".join([f"{m['role']}: {m['content']}" for m in st.session_state.messages[:-1]])
        response = generate_response(prompt, history)
        
        st.session_state.messages.append({"role": "assistant", "content": response})
        st.rerun()

    st.markdown("---")
    st.markdown("Student Querys !!!")

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        st.error(f"Application error: {str(e)}")
        st.stop()
        