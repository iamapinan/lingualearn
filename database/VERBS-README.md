# คู่มือการเพิ่มคำ Verbs

## จำนวน Verbs ทั้งหมด

### ในไฟล์ `lingualearn.sql` (ข้อมูลเริ่มต้น)
- **Irregular Verbs**: 50 คำ
- **Regular Verbs**: 20 คำ
- **รวม**: 70 คำ

### ในไฟล์ `verbs-extended.sql` (ข้อมูลเพิ่มเติม)
- **Irregular Verbs**: 80 คำ
- **Regular Verbs**: 70 คำ
- **รวม**: 150 คำ

### **รวมทั้งหมด: 220 คำ**

## การจัดแบ่งตามระดับความยาก

### Difficulty 1 (Easy) - ง่าย
- Irregular: 35 คำ
- Regular: 45 คำ
- คำที่ใช้บ่อยทุกวัน, โครงสร้างง่าย

### Difficulty 2 (Medium) - ปานกลาง
- Irregular: 55 คำ
- Regular: 45 คำ
- คำที่ใช้บ่อย แต่มีการเปลี่ยนรูปซับซ้อนกว่า

### Difficulty 3 (Hard) - ยาก
- Irregular: 40 คำ
- Regular: 20 คำ
- คำที่ใช้ในระดับ advanced, academic

## การ Import ข้อมูล

### วิธีที่ 1: Import ทั้งหมดพร้อมกัน (แนะนำ)
```bash
# Import ฐานข้อมูลหลักพร้อม verbs 70 คำ
mysql -u root -p < database/lingualearn.sql

# เพิ่ม verbs อีก 150 คำ
mysql -u root -p < database/verbs-extended.sql
```

### วิธีที่ 2: Import ผ่าน MySQL Shell
```bash
mysql -u root -p

# ใน MySQL shell
source /path/to/lingualearn/database/lingualearn.sql;
source /path/to/lingualearn/database/verbs-extended.sql;
```

### วิธีที่ 3: Import เฉพาะ verbs เพิ่มเติม (ถ้า import ไฟล์หลักแล้ว)
```bash
mysql -u root -p lingualearn_db < database/verbs-extended.sql
```

## ตรวจสอบข้อมูลที่ import แล้ว

```sql
USE lingualearn_db;

-- นับจำนวน verbs ทั้งหมด
SELECT COUNT(*) as total_verbs FROM verbs;
-- ควรได้ 220

-- นับตาม category
SELECT category, COUNT(*) as count 
FROM verbs 
GROUP BY category;
-- irregular: 130
-- regular: 90

-- นับตาม difficulty
SELECT difficulty, category, COUNT(*) as count 
FROM verbs 
GROUP BY difficulty, category 
ORDER BY difficulty, category;
```

## รายการ Verbs ตามหมวดหมู่

### Irregular Verbs ที่สำคัญ

**Difficulty 1 (ง่าย):**
- be, have, do, go, get, make, see, come, take, know
- give, find, think, say, tell, buy, eat, drink, sleep, sit
- cut, put, let, set, hit, hurt, shut, cost, quit, bet
- cast, spread, split, shed, bend

**Difficulty 2 (ปานกลาง):**
- write, read, speak, run, swim, sing, drive, fly, wear, teach
- learn, feel, meet, leave, hear, send, lose, win, break, choose
- stand, pay, mean, keep, hold, sell, bring, fight, seek, catch
- hang, stick, strike, dig, spin, wake, shake, steal, tear, blow
- show, hide, bite, ride, shine, rise, freeze, ring, sink, spring
- swear, weep, sweep

**Difficulty 3 (ยาก):**
- understand, forget, begin, build, catch, draw, fall, grow, throw, become
- forbid, forgive, arise, bear, beat, bind, breed, broadcast, burst
- deal, feed, flee, grind, lay, lead, lend, light, overcome, shoot
- slide, sow, spend, spill, spoil, sting, stink, stride, swell, undertake

### Regular Verbs ที่สำคัญ

**Difficulty 1 (ง่าย):**
- walk, talk, work, play, watch, listen, help, cook, clean, open
- look, call, ask, answer, start, finish, stop, wait, turn, move
- close, wash, brush, touch, jump, push, pull, point, smile, laugh
- cry, rain, snow, mail, park

**Difficulty 2 (ปานกลาง):**
- study, try, visit, travel, dance, live, love, like, want, need
- arrive, believe, belong, change, collect, compare, complete, continue
- count, cover, create, decide, deliver, develop, discover, enjoy
- enter, escape, examine, explain, follow, happen, improve, include, increase

**Difficulty 3 (ยาก):**
- achieve, appreciate, communicate, concentrate, consider, demonstrate
- determine, eliminate, emphasize, establish, evaluate, generate
- identify, implement, investigate, maintain, participate, recognize
- recommend, represent

## ตัวอย่างประโยค

แต่ละ verb มีประโยคตัวอย่างที่เหมาะสมกับระดับความยาก:

**Easy:**
- "I am a student." (be)
- "I have a book." (have)

**Medium:**
- "I write a letter." (write)
- "She sings beautifully." (sing)

**Hard:**
- "Overcome obstacles." (overcome)
- "Implement the plan." (implement)

## การใช้งานใน Application

### API Endpoints
```javascript
// ดึง verbs ทั้งหมด
GET /api/verbs

// กรองตาม category
GET /api/verbs?category=irregular

// กรองตาม difficulty
GET /api/verbs?difficulty=1

// ดึง verbs ที่ต้องทบทวน
GET /api/verbs?needsReview=true
```

### ฟีเจอร์การเรียนรู้
1. **Spaced Repetition**: ระบบจะจัดการทบทวนอัตโนมัติ
2. **Progress Tracking**: ติดตามความถูกต้อง
3. **Difficulty Adjustment**: ปรับระดับความยากตาม performance

## หมายเหตุ

- คำแปลเป็นภาษาไทยที่ใกล้เคียงความหมายมากที่สุด
- บาง verbs มีหลายความหมาย แต่เลือกความหมายที่ใช้บ่อยที่สุด
- ประโยคตัวอย่างเหมาะกับผู้เรียนระดับเริ่มต้นถึงกลาง

## การอัพเดทข้อมูล

ถ้าต้องการเพิ่ม verbs เพิ่มเติม:

```sql
INSERT INTO verbs (user_id, base_form, past_simple, past_participle, translation, category, language_id, language_code, difficulty, example_sentence, last_reviewed, next_review) VALUES
(1, 'new_verb', 'past_form', 'past_participle', 'แปลภาษาไทย', 'regular|irregular', 1, 'en', 1|2|3, 'Example sentence.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY));
```

## สถิติ

- **รวม**: 220 verbs
- **Irregular**: 130 verbs (59%)
- **Regular**: 90 verbs (41%)
- **แบ่งตามระดับ**:
  - Easy: 80 verbs (36%)
  - Medium: 100 verbs (45%)
  - Hard: 40 verbs (18%)

