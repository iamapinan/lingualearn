#!/usr/bin/env python3
"""
Convert SQLite dump to MySQL compatible SQL
"""
import re
import sys

def convert_sqlite_to_mysql(input_file, output_file):
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove SQLite specific commands
    content = re.sub(r'PRAGMA.*?;', '', content)
    content = re.sub(r'BEGIN TRANSACTION;', 'START TRANSACTION;', content)
    content = re.sub(r'COMMIT;', 'COMMIT;', content)
    
    # Convert CREATE TABLE statements
    # SQLite uses INTEGER PRIMARY KEY, MySQL uses INT AUTO_INCREMENT PRIMARY KEY
    content = re.sub(r'INTEGER PRIMARY KEY AUTOINCREMENT', 'INT AUTO_INCREMENT PRIMARY KEY', content, flags=re.IGNORECASE)
    content = re.sub(r'INTEGER PRIMARY KEY', 'INT AUTO_INCREMENT PRIMARY KEY', content, flags=re.IGNORECASE)
    
    # Convert data types
    content = re.sub(r'\bINTEGER\b', 'INT', content, flags=re.IGNORECASE)
    content = re.sub(r'\bTEXT\b', 'VARCHAR(255)', content, flags=re.IGNORECASE)
    content = re.sub(r'\bREAL\b', 'DOUBLE', content, flags=re.IGNORECASE)
    content = re.sub(r'\bBLOB\b', 'BLOB', content, flags=re.IGNORECASE)
    
    # Convert DATETIME to TIMESTAMP for better MySQL compatibility
    content = re.sub(r'\bDATETIME\b', 'TIMESTAMP', content, flags=re.IGNORECASE)
    
    # Remove SQLite's IF NOT EXISTS in a way that's more compatible
    # Actually, MySQL supports IF NOT EXISTS, so keep it
    
    # Convert boolean values
    content = re.sub(r"'t'", '1', content)
    content = re.sub(r"'f'", '0', content)
    
    # Add MySQL specific headers
    mysql_header = """-- MySQL dump converted from SQLite
-- Database: lingualearn_db
-- 

SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lingualearn_db`
--

"""
    
    mysql_footer = """
SET FOREIGN_KEY_CHECKS=1;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
"""
    
    # Combine
    final_content = mysql_header + content + mysql_footer
    
    # Write output
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(final_content)
    
    print(f"✓ Converted {input_file} to {output_file}")
    print(f"  File size: {len(final_content)} characters")

if __name__ == "__main__":
    input_file = "database/sqlite_dump.sql"
    output_file = "database/mysql_import_from_sqlite.sql"
    
    try:
        convert_sqlite_to_mysql(input_file, output_file)
        print("\n✓ Conversion completed successfully!")
        print(f"\nTo import into MySQL, run:")
        print(f"mysql -h YOUR_HOST -P YOUR_PORT -u YOUR_USER -p YOUR_DB < {output_file}")
    except Exception as e:
        print(f"✗ Error: {e}", file=sys.stderr)
        sys.exit(1)

