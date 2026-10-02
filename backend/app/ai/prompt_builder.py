from typing import Dict, Any
from app.schemas.blog import BlogGenerateRequest


def get_target_words(req: BlogGenerateRequest) -> int:
    length = (req.blog_length or "Medium").lower()
    if length == "short":
        return 500
    elif length == "medium":
        return 1000
    elif length == "long":
        return 2000
    elif length == "custom":
        return req.custom_word_count or 1000
    return 1000


def build_blog_generation_prompt(req: BlogGenerateRequest) -> str:
    target_words = get_target_words(req)
    keywords_clause = f"\n- Primary & SEO Keywords: {req.keywords}" if req.keywords else ""
    points_clause = f"\n- Key Points to Include: {req.important_points}" if req.important_points else ""
    instructions_clause = f"\n- Additional Instructions: {req.additional_instructions}" if req.additional_instructions else ""
    author_clause = f"\n- Author attribution: {req.author_name}" if req.author_name else ""

    prompt = f"""You are an elite, award-winning editorial writer and subject matter specialist.
Write a comprehensive, captivating, and publication-ready blog post based on the following specifications:

TOPIC: "{req.topic}"
TARGET LENGTH: Approximately {target_words} words
BLOG STYLE/TYPE: {req.blog_type}
TONE: {req.tone}
TARGET AUDIENCE: {req.target_audience}
LANGUAGE: {req.language}{keywords_clause}{points_clause}{instructions_clause}{author_clause}

CRITICAL FORMATTING & STRUCTURE RULES:
1. Return ONLY a valid JSON object matching the exact schema below, with no markdown wrappers, no conversational preambles, and no trailing comments.
2. The blog must be structured with deep intellectual rigor, practical examples, clear logical flow, and engaging storytelling suited to the selected tone.
3. Every section should be substantial, well-developed, and contain insightful subpoints or concrete real-world case studies/analogies.
4. If images are referenced or the language is Hindi or English, write fluently in that designated language.

REQUIRED JSON SCHEMA:
{{
  "title": "A magnetic, high-impact headline",
  "subtitle": "An evocative subtitle expanding on the value proposition",
  "introduction": "An engaging hook, contextual background, and thesis statement setting the stage.",
  "sections": [
    {{
      "heading": "Clear, informative section heading",
      "content": "Rich, multi-paragraph exposition with evidence, analysis, or narrative arc.",
      "subsections": [
        {{
          "title": "Subpoint or actionable breakdown",
          "content": "Detailed explanation with real-world examples, key metrics, or scenarios."
        }}
      ]
    }}
  ],
  "conclusion": "A synthesis of arguments, thoughtful future outlook, and memorable closing thought.",
  "key_takeaways": [
    "Key actionable takeaway 1",
    "Key actionable takeaway 2",
    "Key actionable takeaway 3",
    "Key actionable takeaway 4"
  ]
}}
"""
    return prompt
