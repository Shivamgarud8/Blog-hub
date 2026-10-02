"""
Development Database Seed Script
Creates initial demo accounts and sample blogs for testing.
ONLY FOR DEVELOPMENT. Never use hardcoded credentials in production.
"""
from datetime import datetime, date
from app.database import SessionLocal, Base, engine
from app.models.user import User
from app.models.blog import Blog
from app.models.image import BlogImage
from app.auth.security import get_password_hash


def seed_database():
    print("🌱 Initializing development database seed...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if demo user already exists
        demo_email = "priya.sharma@example.com"
        existing = db.query(User).filter(User.email == demo_email).first()
        if existing:
            print("✨ Demo account already seeded.")
            return

        # 1. Create Demo User
        demo_user = User(
            email=demo_email,
            password_hash=get_password_hash("password123"),
            full_name="Priya Sharma",
            mobile_number="+91 9876543210",
            age=26,
            date_of_birth=date(1998, 5, 14),
            gender="Female",
            profession="AI Research Specialist & Content Creator",
            education="Master of Science in Computer Science",
            marital_status="Single",
            bio="Passionate technologist, writer, and researcher exploring the intersection of generative AI, ethical computing, and human creativity.",
            profile_image="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
            is_active=True
        )
        db.add(demo_user)
        db.commit()
        db.refresh(demo_user)
        print(f"👤 Created demo user: {demo_user.email} (ID: {demo_user.id})")

        # 2. Create Sample Blogs
        sample_blog_1 = Blog(
            user_id=demo_user.id,
            title="The Renaissance of Generative Intelligence: Redefining Digital Craftsmanship",
            subtitle="How thoughtful human direction and neural synthesis are forging an unprecedented creative paradigm",
            topic="The future of artificial intelligence in creative workflows",
            content="""# The Renaissance of Generative Intelligence

> *How thoughtful human direction and neural synthesis are forging an unprecedented creative paradigm*

In an era characterized by exponential computational leaps, the discourse surrounding artificial intelligence has shifted from speculative curiosity to structural transformation. Writers, designers, and developers are no longer passive consumers of digital utilities; they have become conductors of sophisticated neural ensembles.

## 1. Beyond Automation: The Emergence of Co-Creation

Historically, technological disruptions sought to minimize human labor through sheer mechanical speed. From assembly lines to algorithmic compilers, the focus was throughput. Generative models, however, invert this dynamic. Rather than replacing human intent, they amplify conceptual velocity.

```python
def synthesize_perspective(human_intent: str, domain_context: dict) -> EditorialNarrative:
    # Co-creative synthesis loop
    structured_thesis = distill_core_principles(human_intent)
    return refine_with_editorial_rigor(structured_thesis, domain_context)
```

By offloading syntactic overhead—drafting structural outlines, verifying contextual citations, and harmonizing tonal cadences—creators preserve their cognitive bandwidth for philosophical framing and emotional resonance.

## 2. The Architectural Pillars of High-Impact Content

Sustainable editorial impact hinges on three interrelated disciplines:

1. **Epistemic Integrity**: Grounding computational synthesis in rigorous verifiable truths.
2. **Distinctive Voice**: Rejecting generic corporate uniformity in favor of nuanced, provocative perspectives.
3. **Architectural Clarity**: Structuring complex thematic arcs into intuitive cognitive pathways.

## Conclusion

The future belongs not to algorithms operating in isolation, nor to practitioners who resist technological evolution. It belongs to thoughtful craftspeople who wield intelligence as a brush—sculpting narratives that educate, inspire, and endure.

### Key Takeaways
- Generative AI functions as a creative cognitive amplifier, not a substitute for human taste.
- Thoughtful prompt architecture separates mundane summaries from seminal editorial thought.
- Long-term credibility requires unwavering commitment to authenticity and rigorous verification.
""",
            blog_type="Technical",
            tone="Inspirational",
            target_audience="Developers",
            language="English",
            word_count=420,
            keywords="Generative AI, Creative Workflows, Editorial Architecture, Future of Work",
            status="published",
            featured_image="https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80"
        )

        sample_blog_2 = Blog(
            user_id=demo_user.id,
            title="Mindful Engineering: Cultivating Focus in an Era of Hyper-Connectivity",
            subtitle="Practical mental models and architectural habits for deep work",
            topic="Focus and mindfulness for software engineers",
            content="""# Mindful Engineering: Cultivating Focus in an Era of Hyper-Connectivity

> *Practical mental models and architectural habits for deep work*

The modern engineering workspace is a battlefield of notifications, context switches, and cognitive fragmentation. While our developer tools have grown astronomically more powerful, our capacity for sustained, uninterrupted contemplation has never been more vulnerable.

## The Cognitive Cost of Context Switching

Every interruption leaves an attention residue. Research shows that recovering full immersion after a minor interruption takes upwards of 23 minutes. In software architecture, where mental call stacks are 7 levels deep, a single ping can demolish an entire conceptual framework.

## Strategies for Deep Intellectual Flow

- **Time-Blocked Deep Work Sprints**: Reserve uninterrupted 90-minute blocks for hard problem solving.
- **Asynchronous Communication Protocols**: Batch review pull requests and messages instead of reacting instantaneously.
- **Cognitive Decoupling**: Disconnect completely from screens during breaks to foster subconscious synthesis.

## Conclusion

Excellence in engineering is not measured by the velocity of your Slack replies, but by the elegance, resilience, and clarity of the systems you build. Protect your focus with the same rigor you apply to your production databases.
""",
            blog_type="Educational",
            tone="Conversational",
            target_audience="Professionals",
            language="English",
            word_count=350,
            keywords="Deep Work, Engineering Habits, Productivity, Mental Models",
            status="published",
            featured_image="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
        )

        db.add_all([sample_blog_1, sample_blog_2])
        db.commit()
        print("✅ Seeded sample blogs successfully.")

    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
