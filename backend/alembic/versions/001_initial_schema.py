"""Initial PostgreSQL 18 schema for users, blogs, and blog_images

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-10-02 12:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = '001_initial_schema'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. users table
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('password_hash', sa.String(length=255), nullable=False),
        sa.Column('full_name', sa.String(length=150), nullable=False),
        sa.Column('mobile_number', sa.String(length=30), nullable=True),
        sa.Column('age', sa.Integer(), nullable=True),
        sa.Column('date_of_birth', sa.Date(), nullable=True),
        sa.Column('gender', sa.String(length=50), nullable=True),
        sa.Column('profession', sa.String(length=100), nullable=True),
        sa.Column('education', sa.String(length=150), nullable=True),
        sa.Column('marital_status', sa.String(length=50), nullable=True),
        sa.Column('bio', sa.Text(), nullable=True),
        sa.Column('profile_image', sa.String(length=500), nullable=True),
        sa.Column('is_active', sa.Boolean(), server_default=sa.text('true'), nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)

    # 2. blogs table
    op.create_table(
        'blogs',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(length=300), nullable=False),
        sa.Column('subtitle', sa.String(length=500), nullable=True),
        sa.Column('topic', sa.String(length=300), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('blog_type', sa.String(length=50), server_default='Educational', nullable=False),
        sa.Column('tone', sa.String(length=50), server_default='Professional', nullable=False),
        sa.Column('target_audience', sa.String(length=50), server_default='General Audience', nullable=False),
        sa.Column('language', sa.String(length=50), server_default='English', nullable=False),
        sa.Column('word_count', sa.Integer(), server_default='0', nullable=False),
        sa.Column('keywords', sa.String(length=500), nullable=True),
        sa.Column('status', sa.String(length=20), server_default='published', nullable=False),
        sa.Column('featured_image', sa.String(length=500), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_blogs_id'), 'blogs', ['id'], unique=False)
    op.create_index(op.f('ix_blogs_user_id'), 'blogs', ['user_id'], unique=False)
    op.create_index(op.f('ix_blogs_title'), 'blogs', ['title'], unique=False)
    op.create_index(op.f('ix_blogs_created_at'), 'blogs', ['created_at'], unique=False)

    # 3. blog_images table
    op.create_table(
        'blog_images',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('blog_id', sa.Integer(), nullable=True),
        sa.Column('image_path', sa.String(length=500), nullable=False),
        sa.Column('image_url', sa.String(length=500), nullable=False),
        sa.Column('alt_text', sa.String(length=255), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['blog_id'], ['blogs.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_blog_images_id'), 'blog_images', ['id'], unique=False)
    op.create_index(op.f('ix_blog_images_blog_id'), 'blog_images', ['blog_id'], unique=False)


def downgrade() -> None:
    op.drop_table('blog_images')
    op.drop_table('blogs')
    op.drop_table('users')
