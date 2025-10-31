#!/bin/bash

# Import All Data to MySQL
# Usage: ./scripts/import_all.sh

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Database credentials from .env
DB_HOST="${DB_HOST:-199.21.172.224}"
DB_PORT="${DB_PORT:-3309}"
DB_USER="${DB_USER:-gracer}"
DB_PASSWORD="${DB_PASSWORD:-bDagkH767s22e422}"
DB_NAME="${DB_NAME:-lingualearn_db}"

echo -e "${YELLOW}==================================${NC}"
echo -e "${YELLOW}  LinguaLearn Database Import${NC}"
echo -e "${YELLOW}==================================${NC}"
echo ""

# Check if mysql client is available
if ! command -v mysql &> /dev/null; then
    echo -e "${RED}✗ Error: mysql client not found${NC}"
    echo "  Please install MySQL client first"
    exit 1
fi

echo -e "${GREEN}Database Connection:${NC}"
echo "  Host: $DB_HOST"
echo "  Port: $DB_PORT"
echo "  User: $DB_USER"
echo "  Database: $DB_NAME"
echo ""

# Test connection
echo -e "${YELLOW}Testing connection...${NC}"
if mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" -e "SELECT 1;" &> /dev/null; then
    echo -e "${GREEN}✓ Connection successful${NC}"
else
    echo -e "${RED}✗ Connection failed${NC}"
    echo "  Please check your database credentials"
    exit 1
fi
echo ""

# Ask for confirmation
echo -e "${YELLOW}This will:${NC}"
echo "  1. Drop existing database (if exists)"
echo "  2. Create new database"
echo "  3. Import schema and initial data"
echo "  4. Import extended verbs (220 total)"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 0
fi

# Step 1: Drop and create database
echo -e "${YELLOW}Step 1: Creating database...${NC}"
mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" << EOF
DROP DATABASE IF EXISTS $DB_NAME;
CREATE DATABASE $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EOF
echo -e "${GREEN}✓ Database created${NC}"
echo ""

# Step 2: Import schema and initial data
echo -e "${YELLOW}Step 2: Importing schema and initial data...${NC}"
if [ -f "database/lingualearn.sql" ]; then
    mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < database/lingualearn.sql
    echo -e "${GREEN}✓ Schema imported${NC}"
else
    echo -e "${RED}✗ Error: database/lingualearn.sql not found${NC}"
    exit 1
fi
echo ""

# Step 3: Import SQLite data (optional)
if [ -f "database/mysql_data_import.sql" ]; then
    echo -e "${YELLOW}Step 3: Importing data from SQLite...${NC}"
    read -p "Import data from SQLite? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < database/mysql_data_import.sql
        echo -e "${GREEN}✓ SQLite data imported${NC}"
    else
        echo -e "${YELLOW}⊙ Skipped SQLite data import${NC}"
    fi
else
    echo -e "${YELLOW}⊙ No SQLite data file found (database/mysql_data_import.sql)${NC}"
    echo "  Run: python3 scripts/export_sqlite_data.py to create it"
fi
echo ""

# Step 4: Import extended verbs
if [ -f "database/verbs-extended.sql" ]; then
    echo -e "${YELLOW}Step 4: Importing extended verbs...${NC}"
    mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < database/verbs-extended.sql
    echo -e "${GREEN}✓ Extended verbs imported${NC}"
else
    echo -e "${YELLOW}⊙ No extended verbs file found (database/verbs-extended.sql)${NC}"
fi
echo ""

# Step 5: Verify import
echo -e "${YELLOW}Step 5: Verifying data...${NC}"
mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" << EOF
SELECT 'languages' as table_name, COUNT(*) as count FROM languages
UNION ALL SELECT 'lessons', COUNT(*) FROM lessons
UNION ALL SELECT 'achievements', COUNT(*) FROM achievements
UNION ALL SELECT 'badges', COUNT(*) FROM badges
UNION ALL SELECT 'challenges', COUNT(*) FROM challenges
UNION ALL SELECT 'missions', COUNT(*) FROM missions
UNION ALL SELECT 'questions', COUNT(*) FROM questions
UNION ALL SELECT 'vocabulary', COUNT(*) FROM vocabulary
UNION ALL SELECT 'verbs', COUNT(*) FROM verbs
UNION ALL SELECT 'users', COUNT(*) FROM users;
EOF
echo ""

echo -e "${GREEN}==================================${NC}"
echo -e "${GREEN}  ✓ Import completed successfully!${NC}"
echo -e "${GREEN}==================================${NC}"
echo ""
echo "Next steps:"
echo "  1. Update your .env file with database credentials"
echo "  2. Restart your Next.js application"
echo "  3. Navigate to http://localhost:3010/auth to create an account"
echo ""

