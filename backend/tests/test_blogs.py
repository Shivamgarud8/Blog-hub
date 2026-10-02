import pytest
from app.services.blog_service import count_words, format_structured_blog_markdown
from app.schemas.blog import StructuredBlogContent, BlogSection


def test_word_count_calculation():
    text = "The quick brown fox jumps over the lazy dog."
    assert count_words(text) == 9

    complex_text = "AI-powered blog generator with 100% test coverage."
    assert count_words(complex_text) >= 6


def test_structured_blog_formatting():
    structured = StructuredBlogContent(
        title="Test Title",
        subtitle="Test Subtitle",
        introduction="This is the introduction.",
        sections=[
            BlogSection(
                heading="First Section",
                content="Detailed body paragraph.",
                subsections=[
                    {"title": "Subpoint", "content": "Actionable detail."}
                ]
            )
        ],
        conclusion="In conclusion, this test passed.",
        key_takeaways=["Takeaway 1", "Takeaway 2"]
    )

    md = format_structured_blog_markdown(structured)
    assert "# Test Title" not in md  # Subtitle formatted as quote
    assert "Test Subtitle" in md
    assert "This is the introduction." in md
    assert "## First Section" in md
    assert "### Subpoint" in md
    assert "## Conclusion" in md
    assert "- Takeaway 1" in md
