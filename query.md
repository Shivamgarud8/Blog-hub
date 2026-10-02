# PostgreSQL 18 Query & Administration Handbook

This document contains essential PostgreSQL 18 commands, schema inspection queries, administration scripts, and maintenance procedures for the **BloomScript AI Blog Generator** production database.

---

## 1. Connecting to PostgreSQL 18 in Docker

Connect directly to the interactive `psql` command-line interface inside the running PostgreSQL 18 container:

```bash
docker exec -it blog-gen-postgres psql -U blog_user -d blog_gen
```

To connect using custom environment credentials:

```bash
docker exec -it blog-gen-postgres psql -U ${POSTGRES_USER:-blog_user} -d ${POSTGRES_DB:-blog_gen}
```

To connect from the host server using the PostgreSQL client (if `psql` is installed on your Linux host):

```bash
psql -h 127.0.0.1 -p 5432 -U blog_user -d blog_gen
```

---

## 2. PostgreSQL System & Metadata Inspection

### List all databases
```sql
\l
```
Or with human-readable disk sizes:
```sql
\l+
```

### List all schemas
```sql
\dn
```

### List all tables in current database
```sql
\dt
```
Or with disk size and access privilege details:
```sql
\dt+
```

### Check PostgreSQL version
```sql
SELECT version();
```

### Check current database, user, and server port
```sql
SELECT current_database(), current_user, inet_server_port();
```

---

## 3. Table Schema & Structure Descriptions

### Describe `users` table
```sql
\d users
```
Detailed column info, types, constraints, and indexes:
```sql
\d+ users
```

### Describe `blogs` table
```sql
\d blogs
```
Detailed structure with foreign keys:
```sql
\d+ blogs
```

### Describe `blog_images` table
```sql
\d blog_images
```

---

## 4. User Account Queries

> **Security Note:** In accordance with security best practices, queries intentionally omit `password_hash` to avoid exposing bcrypt secrets in terminal logs or presentations.

### List all registered users (sanitized)
```sql
SELECT 
    id, 
    full_name, 
    email, 
    mobile_number, 
    profession, 
    gender, 
    age, 
    is_active, 
    created_at 
FROM users 
ORDER BY id ASC;
```

### Total user count
```sql
SELECT COUNT(*) AS total_registered_users FROM users;
```

### Most recently registered users
```sql
SELECT 
    id, 
    email, 
    full_name, 
    profession, 
    created_at 
FROM users 
ORDER BY created_at DESC 
LIMIT 10;
```

### Find user by email
```sql
SELECT 
    id, 
    email, 
    full_name, 
    mobile_number, 
    date_of_birth, 
    created_at 
FROM users 
WHERE email = 'priya.sharma@example.com';
```

---

## 5. Blog Content Queries

### Total blogs count
```sql
SELECT COUNT(*) AS total_blogs_created FROM blogs;
```

### Count blogs by status
```sql
SELECT 
    status, 
    COUNT(*) AS count 
FROM blogs 
GROUP BY status;
```

### Count blogs by category/type
```sql
SELECT 
    blog_type, 
    COUNT(*) AS blog_count, 
    ROUND(AVG(word_count), 0) AS avg_word_count 
FROM blogs 
GROUP BY blog_type 
ORDER BY blog_count DESC;
```

### Recent blogs with word counts
```sql
SELECT 
    id, 
    user_id, 
    title, 
    blog_type, 
    tone, 
    language, 
    word_count, 
    created_at 
FROM blogs 
ORDER BY created_at DESC 
LIMIT 10;
```

---

## 6. Relational JOIN Queries

### Show blogs with author details
```sql
SELECT 
    b.id AS blog_id, 
    b.title, 
    b.blog_type, 
    b.word_count, 
    u.full_name AS author_name, 
    u.email AS author_email, 
    b.created_at AS published_at 
FROM blogs b
INNER JOIN users u ON b.user_id = u.id
ORDER BY b.created_at DESC;
```

### Top authors ranked by published blogs and total word count
```sql
SELECT 
    u.id AS user_id, 
    u.full_name, 
    u.email, 
    COUNT(b.id) AS total_blogs, 
    COALESCE(SUM(b.word_count), 0) AS total_words_written, 
    MAX(b.created_at) AS last_blog_date 
FROM users u
LEFT JOIN blogs b ON u.id = b.user_id
GROUP BY u.id, u.full_name, u.email
ORDER BY total_blogs DESC;
```

### Blogs with attached uploaded images
```sql
SELECT 
    b.id AS blog_id, 
    b.title, 
    COUNT(bi.id) AS uploaded_images_count, 
    STRING_AGG(bi.image_url, ', ') AS image_urls 
FROM blogs b
LEFT JOIN blog_images bi ON b.id = bi.blog_id
GROUP BY b.id, b.title;
```

---

## 7. Performance & Database Health

### Check database size on disk
```sql
SELECT 
    pg_database.datname, 
    pg_size_pretty(pg_database_size(pg_database.datname)) AS size_pretty 
FROM pg_database 
WHERE datname = 'blog_gen';
```

### Check table sizes including indexes
```sql
SELECT 
    relname AS table_name, 
    pg_size_pretty(pg_total_relation_size(relid)) AS total_size, 
    pg_size_pretty(pg_relation_size(relid)) AS table_size, 
    pg_size_pretty(pg_indexes_size(relid)) AS index_size 
FROM pg_catalog.pg_statio_user_tables 
ORDER BY pg_total_relation_size(relid) DESC;
```

### Check active database connections
```sql
SELECT 
    pid, 
    usename, 
    client_addr, 
    state, 
    query_start, 
    query 
FROM pg_stat_activity 
WHERE datname = 'blog_gen' 
  AND pid <> pg_backend_pid();
```

### Check indexes on all application tables
```sql
SELECT 
    tablename, 
    indexname, 
    indexdef 
FROM pg_indexes 
WHERE schemaname = 'public' 
ORDER BY tablename, indexname;
```

### Check foreign key constraints
```sql
SELECT 
    conrelid::regclass AS table_from, 
    conname AS constraint_name, 
    pg_get_constraintdef(c.oid) AS constraint_definition 
FROM pg_constraint c 
JOIN pg_namespace n ON n.oid = c.connamespace 
WHERE contype = 'f' AND n.nspname = 'public';
```

---

## 8. Backup & Restore Procedures

### Create a full database backup
Execute this on the Linux host running Docker:
```bash
docker exec blog-gen-postgres pg_dump -U blog_user -d blog_gen > blog_gen_backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore database from SQL dump
```bash
# 1. Ensure target database exists
docker exec -i blog-gen-postgres psql -U blog_user -d blog_gen -c "SELECT 1;"

# 2. Feed the dump into PostgreSQL container
cat blog_gen_backup_*.sql | docker exec -i blog-gen-postgres psql -U blog_user -d blog_gen
```

### Export a single table to CSV
```bash
docker exec -i blog-gen-postgres psql -U blog_user -d blog_gen -c \
  "\copy (SELECT id, title, topic, word_count, created_at FROM blogs) TO STDOUT WITH CSV HEADER" > blogs_export.csv
```
