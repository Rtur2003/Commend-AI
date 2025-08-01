import google.generativeai as genai
from ..config import Config

# API anahtarını yapılandır
GEMINI_API_KEY = Config.GEMINI_API_KEY
if not GEMINI_API_KEY:
    print("ERROR: GEMINI_API_KEY not found in .env file.")
    model = None
else:
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel('gemma-3-27b-it')
    except Exception as e:
        print(f"Error configuring Gemini API: {e}")
        model = None

def generate_comment_text(details, comment_style, language, existing_comments=None):
    if not model:
        return "Gemini API is not configured correctly. Please check your API key.", True

    comment_section = "No comments available to analyze."
    if existing_comments:
        comment_section = "\n".join(
            [f"- '{c['text']}' (by {c['author']})" for c in existing_comments]
        )

    # --- NİHAİ PROMPT (İSTATİSTİKSEL ZEKALI) ---
    prompt_template = f"""
### ROLE & GOAL ###
You are CommendAI, a highly perceptive and emotionally intelligent YouTube commenter. Your goal is to write an authentic, engaging comment that perfectly matches the video's emotional tone and context. Generate the comment in: **{language}**.

### STEP 1: CONTEXT & TONE ANALYSIS ###
First, analyze all provided data to understand the video's topic, tone, popularity, and community vibe.

**Video Data:**
- Title: {details['title']}
- Channel: {details['channel_name']}
- Description (excerpt): {details['description'][:500]}

**Statistical Context:**
- View Count: {details.get('view_count', 'N/A')}
- Like Count: {details.get('like_count', 'N/A')}
- Video Duration: {details.get('duration', 'N/A')}
- Channel Subscriber Count: {details.get('subscriber_count', 'N/A')}

**Existing Viewer Comments (to understand the vibe):**
{comment_section}

### STEP 2: TONE ADAPTATION & COMMENTING INSTRUCTIONS ###
Based on your analysis, adapt your writing style:
- **For highly popular videos/channels:** Acknowledge their success and impact. Your tone can be more reverent or celebratory.
- **For less popular videos/channels:** Be more encouraging and supportive. Highlight their unique strengths.
- **For serious/somber topics:** Be empathetic and respectful. Avoid hyperbole.
- **For humorous/exciting topics:** Be witty, passionate, and use creative exaggeration.

### GENERAL RULES (Apply to all tones) ###
1.  **Be Specific:** Reference a specific detail from the video.
2.  **Language:** The ENTIRE comment MUST be in **{language}**.
3.  **Disclaimer:** On a new line, after the comment, you MUST add a disclaimer (e.g., "Not: Bu yorum bir yapay zeka tarafından oluşturulmuştur.").

### YOUR TASK ###
Following all steps, write a high-quality, context-aware YouTube comment in **{language}**.

**Generated Comment:**
"""

    try:
        response = model.generate_content(prompt_template)
        return response.text, None
    except Exception as e:
        print(f"An error occurred during Gemini API call: {e}")
        return f"Error generating comment: {e}", True