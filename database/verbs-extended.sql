-- ============================================
-- เพิ่มคำ Verbs เพิ่มเติม (150 คำใหม่)
-- รวมกับที่มีอยู่แล้ว 70 คำ = 220 คำทั้งหมด
-- ============================================

USE lingualearn_db;

-- ============================================
-- Irregular Verbs เพิ่มเติม (80 คำ)
-- ============================================

-- Difficulty 1 (Easy - 15 verbs เพิ่ม)
INSERT INTO verbs (user_id, base_form, past_simple, past_participle, translation, category, language_id, language_code, difficulty, example_sentence, last_reviewed, next_review) VALUES
(1, 'cut', 'cut', 'cut', 'ตัด', 'irregular', 1, 'en', 1, 'I cut the paper.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'put', 'put', 'put', 'วาง', 'irregular', 1, 'en', 1, 'Put it on the table.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'let', 'let', 'let', 'ให้, อนุญาต', 'irregular', 1, 'en', 1, 'Let me help you.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'set', 'set', 'set', 'ตั้ง, วาง', 'irregular', 1, 'en', 1, 'Set the alarm.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'hit', 'hit', 'hit', 'ตี, ชน', 'irregular', 1, 'en', 1, 'He hit the ball.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'hurt', 'hurt', 'hurt', 'เจ็บ, ทำร้าย', 'irregular', 1, 'en', 1, 'My leg hurts.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'shut', 'shut', 'shut', 'ปิด', 'irregular', 1, 'en', 1, 'Shut the door.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'cost', 'cost', 'cost', 'มีราคา', 'irregular', 1, 'en', 1, 'It cost 100 baht.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'quit', 'quit', 'quit', 'เลิก, ลาออก', 'irregular', 1, 'en', 1, 'He quit smoking.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'bet', 'bet', 'bet', 'เดิมพัน', 'irregular', 1, 'en', 1, 'I bet you are right.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'cast', 'cast', 'cast', 'โยน, หล่อ', 'irregular', 1, 'en', 1, 'Cast your vote.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'spread', 'spread', 'spread', 'กระจาย', 'irregular', 1, 'en', 1, 'Spread the butter.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'split', 'split', 'split', 'แยก', 'irregular', 1, 'en', 1, 'Split the bill.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'shed', 'shed', 'shed', 'หลั่ง, ผลัด', 'irregular', 1, 'en', 1, 'Shed tears.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'bend', 'bent', 'bent', 'งอ', 'irregular', 1, 'en', 1, 'Bend your knees.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY));

-- Difficulty 2 (Medium - 35 verbs เพิ่ม)
INSERT INTO verbs (user_id, base_form, past_simple, past_participle, translation, category, language_id, language_code, difficulty, example_sentence, last_reviewed, next_review) VALUES
(1, 'stand', 'stood', 'stood', 'ยืน', 'irregular', 1, 'en', 2, 'Stand up, please.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'pay', 'paid', 'paid', 'จ่าย', 'irregular', 1, 'en', 2, 'I paid the bill.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'mean', 'meant', 'meant', 'หมายถึง', 'irregular', 1, 'en', 2, 'What does it mean?', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'keep', 'kept', 'kept', 'เก็บ, รักษา', 'irregular', 1, 'en', 2, 'Keep it safe.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'hold', 'held', 'held', 'ถือ, จับ', 'irregular', 1, 'en', 2, 'Hold my hand.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'sell', 'sold', 'sold', 'ขาย', 'irregular', 1, 'en', 2, 'I sold my car.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'bring', 'brought', 'brought', 'นำมา', 'irregular', 1, 'en', 2, 'Bring your book.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'fight', 'fought', 'fought', 'ต่อสู้', 'irregular', 1, 'en', 2, 'Fight for freedom.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'think', 'thought', 'thought', 'คิด', 'irregular', 1, 'en', 2, 'I think so.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'seek', 'sought', 'sought', 'แสวงหา', 'irregular', 1, 'en', 2, 'Seek the truth.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'catch', 'caught', 'caught', 'จับ', 'irregular', 1, 'en', 2, 'Catch the ball.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'hang', 'hung', 'hung', 'แขวน', 'irregular', 1, 'en', 2, 'Hang the picture.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'stick', 'stuck', 'stuck', 'ติด', 'irregular', 1, 'en', 2, 'The door is stuck.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'strike', 'struck', 'struck', 'ตี, โจมตี', 'irregular', 1, 'en', 2, 'Lightning struck.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'dig', 'dug', 'dug', 'ขุด', 'irregular', 1, 'en', 2, 'Dig a hole.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'spin', 'spun', 'spun', 'หมุน', 'irregular', 1, 'en', 2, 'Spin the wheel.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'wake', 'woke', 'woken', 'ตื่น', 'irregular', 1, 'en', 2, 'I woke up early.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'shake', 'shook', 'shaken', 'เขย่า', 'irregular', 1, 'en', 2, 'Shake the bottle.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'steal', 'stole', 'stolen', 'ขโมย', 'irregular', 1, 'en', 2, 'Someone stole my bike.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'tear', 'tore', 'torn', 'ฉีก', 'irregular', 1, 'en', 2, 'Tear the paper.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'blow', 'blew', 'blown', 'เป่า', 'irregular', 1, 'en', 2, 'Blow out the candles.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'know', 'knew', 'known', 'รู้', 'irregular', 1, 'en', 2, 'I know the answer.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'show', 'showed', 'shown', 'แสดง', 'irregular', 1, 'en', 2, 'Show me your work.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'hide', 'hid', 'hidden', 'ซ่อน', 'irregular', 1, 'en', 2, 'Hide and seek.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'bite', 'bit', 'bitten', 'กัด', 'irregular', 1, 'en', 2, 'The dog bit me.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'ride', 'rode', 'ridden', 'ขี่', 'irregular', 1, 'en', 2, 'Ride a bicycle.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'shine', 'shone', 'shone', 'ส่องแสง', 'irregular', 1, 'en', 2, 'The sun shines.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'rise', 'rose', 'risen', 'ขึ้น', 'irregular', 1, 'en', 2, 'The sun rises.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'freeze', 'froze', 'frozen', 'แข็ง, เยือกแข็ง', 'irregular', 1, 'en', 2, 'Water freezes at 0°C.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'ring', 'rang', 'rung', 'ดัง (กริ่ง)', 'irregular', 1, 'en', 2, 'The bell rang.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'sink', 'sank', 'sunk', 'จม', 'irregular', 1, 'en', 2, 'The ship sank.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'spring', 'sprang', 'sprung', 'กระโดด', 'irregular', 1, 'en', 2, 'Spring into action.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'swear', 'swore', 'sworn', 'สาบาน', 'irregular', 1, 'en', 2, 'I swear it is true.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'weep', 'wept', 'wept', 'ร้องไห้', 'irregular', 1, 'en', 2, 'She wept with joy.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'sweep', 'swept', 'swept', 'กวาด', 'irregular', 1, 'en', 2, 'Sweep the floor.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY));

-- Difficulty 3 (Hard - 30 verbs เพิ่ม)
INSERT INTO verbs (user_id, base_form, past_simple, past_participle, translation, category, language_id, language_code, difficulty, example_sentence, last_reviewed, next_review) VALUES
(1, 'forbid', 'forbade', 'forbidden', 'ห้าม', 'irregular', 1, 'en', 3, 'Smoking is forbidden.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'forgive', 'forgave', 'forgiven', 'ให้อภัย', 'irregular', 1, 'en', 3, 'Forgive me.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'arise', 'arose', 'arisen', 'เกิดขึ้น', 'irregular', 1, 'en', 3, 'A problem arose.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'bear', 'bore', 'borne', 'แบก, ทน', 'irregular', 1, 'en', 3, 'Bear the pain.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'beat', 'beat', 'beaten', 'ตี, เอาชนะ', 'irregular', 1, 'en', 3, 'Beat the record.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'bind', 'bound', 'bound', 'ผูก', 'irregular', 1, 'en', 3, 'Bind the books.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'breed', 'bred', 'bred', 'เลี้ยง, ผสมพันธุ์', 'irregular', 1, 'en', 3, 'Breed horses.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'broadcast', 'broadcast', 'broadcast', 'กระจายเสียง', 'irregular', 1, 'en', 3, 'Broadcast news.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'burst', 'burst', 'burst', 'แตก', 'irregular', 1, 'en', 3, 'The balloon burst.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'deal', 'dealt', 'dealt', 'จัดการ, แจก', 'irregular', 1, 'en', 3, 'Deal the cards.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'feed', 'fed', 'fed', 'ให้อาหาร', 'irregular', 1, 'en', 3, 'Feed the dog.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'flee', 'fled', 'fled', 'หนี', 'irregular', 1, 'en', 3, 'Flee from danger.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'grind', 'ground', 'ground', 'บด', 'irregular', 1, 'en', 3, 'Grind coffee beans.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'lay', 'laid', 'laid', 'วาง', 'irregular', 1, 'en', 3, 'Lay the table.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'lead', 'led', 'led', 'นำ', 'irregular', 1, 'en', 3, 'Lead the team.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'lend', 'lent', 'lent', 'ให้ยืม', 'irregular', 1, 'en', 3, 'Lend me money.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'light', 'lit', 'lit', 'จุด, ส่องสว่าง', 'irregular', 1, 'en', 3, 'Light a candle.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'overcome', 'overcame', 'overcome', 'เอาชนะ', 'irregular', 1, 'en', 3, 'Overcome obstacles.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'shoot', 'shot', 'shot', 'ยิง', 'irregular', 1, 'en', 3, 'Shoot a goal.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'slide', 'slid', 'slid', 'เลื่อน', 'irregular', 1, 'en', 3, 'Slide down.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'sow', 'sowed', 'sown', 'หว่าน', 'irregular', 1, 'en', 3, 'Sow seeds.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'spend', 'spent', 'spent', 'ใช้เวลา, ใช้จ่าย', 'irregular', 1, 'en', 3, 'Spend time wisely.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'spill', 'spilt', 'spilt', 'หก', 'irregular', 1, 'en', 3, 'Spill water.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'spoil', 'spoilt', 'spoilt', 'ทำให้เสีย', 'irregular', 1, 'en', 3, 'Spoil the surprise.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'sting', 'stung', 'stung', 'ต่อย', 'irregular', 1, 'en', 3, 'A bee stung me.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'stink', 'stank', 'stunk', 'เหม็น', 'irregular', 1, 'en', 3, 'It stinks here.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'stride', 'strode', 'stridden', 'ก้าวยาว', 'irregular', 1, 'en', 3, 'Stride forward.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'swear', 'swore', 'sworn', 'สาบาน, ด่า', 'irregular', 1, 'en', 3, 'Swear an oath.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'swell', 'swelled', 'swollen', 'บวม', 'irregular', 1, 'en', 3, 'My ankle swelled.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'undertake', 'undertook', 'undertaken', 'รับผิดชอบ', 'irregular', 1, 'en', 3, 'Undertake a project.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY));

-- ============================================
-- Regular Verbs เพิ่มเติม (70 คำ)
-- ============================================

-- Difficulty 1 (Easy - 25 verbs เพิ่ม)
INSERT INTO verbs (user_id, base_form, past_simple, past_participle, translation, category, language_id, language_code, difficulty, example_sentence, last_reviewed, next_review) VALUES
(1, 'look', 'looked', 'looked', 'มอง', 'regular', 1, 'en', 1, 'Look at me.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'call', 'called', 'called', 'เรียก, โทร', 'regular', 1, 'en', 1, 'Call me later.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'ask', 'asked', 'asked', 'ถาม', 'regular', 1, 'en', 1, 'Ask a question.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'answer', 'answered', 'answered', 'ตอบ', 'regular', 1, 'en', 1, 'Answer the phone.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'start', 'started', 'started', 'เริ่ม', 'regular', 1, 'en', 1, 'Start now.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'finish', 'finished', 'finished', 'จบ', 'regular', 1, 'en', 1, 'Finish your work.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'stop', 'stopped', 'stopped', 'หยุด', 'regular', 1, 'en', 1, 'Stop talking.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'wait', 'waited', 'waited', 'รอ', 'regular', 1, 'en', 1, 'Wait for me.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'turn', 'turned', 'turned', 'หัน, หมุน', 'regular', 1, 'en', 1, 'Turn right.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'move', 'moved', 'moved', 'เคลื่อนที่', 'regular', 1, 'en', 1, 'Move forward.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'close', 'closed', 'closed', 'ปิด', 'regular', 1, 'en', 1, 'Close the window.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'wash', 'washed', 'washed', 'ล้าง', 'regular', 1, 'en', 1, 'Wash your hands.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'brush', 'brushed', 'brushed', 'แปรง', 'regular', 1, 'en', 1, 'Brush your teeth.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'touch', 'touched', 'touched', 'สัมผัส', 'regular', 1, 'en', 1, 'Touch the screen.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'jump', 'jumped', 'jumped', 'กระโดด', 'regular', 1, 'en', 1, 'Jump high.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'push', 'pushed', 'pushed', 'ผลัก', 'regular', 1, 'en', 1, 'Push the door.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'pull', 'pulled', 'pulled', 'ดึง', 'regular', 1, 'en', 1, 'Pull the rope.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'point', 'pointed', 'pointed', 'ชี้', 'regular', 1, 'en', 1, 'Point at it.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'smile', 'smiled', 'smiled', 'ยิ้ม', 'regular', 1, 'en', 1, 'Smile please.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'laugh', 'laughed', 'laughed', 'หัวเราะ', 'regular', 1, 'en', 1, 'Laugh out loud.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'cry', 'cried', 'cried', 'ร้องไห้', 'regular', 1, 'en', 1, 'Don\'t cry.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'rain', 'rained', 'rained', 'ฝนตก', 'regular', 1, 'en', 1, 'It rained yesterday.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'snow', 'snowed', 'snowed', 'หิมะตก', 'regular', 1, 'en', 1, 'It snowed last night.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'mail', 'mailed', 'mailed', 'ส่งจดหมาย', 'regular', 1, 'en', 1, 'Mail this letter.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'park', 'parked', 'parked', 'จอดรถ', 'regular', 1, 'en', 1, 'Park here.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY));

-- Difficulty 2 (Medium - 25 verbs เพิ่ม)
INSERT INTO verbs (user_id, base_form, past_simple, past_participle, translation, category, language_id, language_code, difficulty, example_sentence, last_reviewed, next_review) VALUES
(1, 'arrive', 'arrived', 'arrived', 'มาถึง', 'regular', 1, 'en', 2, 'Arrive on time.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'believe', 'believed', 'believed', 'เชื่อ', 'regular', 1, 'en', 2, 'I believe you.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'belong', 'belonged', 'belonged', 'เป็นของ', 'regular', 1, 'en', 2, 'This belongs to me.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'change', 'changed', 'changed', 'เปลี่ยน', 'regular', 1, 'en', 2, 'Change your clothes.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'collect', 'collected', 'collected', 'เก็บ, สะสม', 'regular', 1, 'en', 2, 'Collect stamps.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'compare', 'compared', 'compared', 'เปรียบเทียบ', 'regular', 1, 'en', 2, 'Compare prices.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'complete', 'completed', 'completed', 'สำเร็จ', 'regular', 1, 'en', 2, 'Complete the task.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'continue', 'continued', 'continued', 'ดำเนินต่อ', 'regular', 1, 'en', 2, 'Continue reading.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'count', 'counted', 'counted', 'นับ', 'regular', 1, 'en', 2, 'Count to ten.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'cover', 'covered', 'covered', 'ครอบคลุม', 'regular', 1, 'en', 2, 'Cover the table.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'create', 'created', 'created', 'สร้างสรรค์', 'regular', 1, 'en', 2, 'Create art.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'decide', 'decided', 'decided', 'ตัดสินใจ', 'regular', 1, 'en', 2, 'Decide now.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'deliver', 'delivered', 'delivered', 'ส่ง', 'regular', 1, 'en', 2, 'Deliver the package.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'develop', 'developed', 'developed', 'พัฒนา', 'regular', 1, 'en', 2, 'Develop skills.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'discover', 'discovered', 'discovered', 'ค้นพบ', 'regular', 1, 'en', 2, 'Discover new things.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'enjoy', 'enjoyed', 'enjoyed', 'สนุกกับ', 'regular', 1, 'en', 2, 'Enjoy your meal.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'enter', 'entered', 'entered', 'เข้า', 'regular', 1, 'en', 2, 'Enter the room.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'escape', 'escaped', 'escaped', 'หนี', 'regular', 1, 'en', 2, 'Escape danger.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'examine', 'examined', 'examined', 'ตรวจสอบ', 'regular', 1, 'en', 2, 'Examine carefully.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'explain', 'explained', 'explained', 'อธิบาย', 'regular', 1, 'en', 2, 'Explain clearly.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'follow', 'followed', 'followed', 'ตาม', 'regular', 1, 'en', 2, 'Follow me.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'happen', 'happened', 'happened', 'เกิดขึ้น', 'regular', 1, 'en', 2, 'What happened?', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'improve', 'improved', 'improved', 'พัฒนา, ปรับปรุง', 'regular', 1, 'en', 2, 'Improve yourself.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'include', 'included', 'included', 'รวม', 'regular', 1, 'en', 2, 'Include everyone.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'increase', 'increased', 'increased', 'เพิ่มขึ้น', 'regular', 1, 'en', 2, 'Increase speed.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY));

-- Difficulty 3 (Hard - 20 verbs เพิ่ม)
INSERT INTO verbs (user_id, base_form, past_simple, past_participle, translation, category, language_id, language_code, difficulty, example_sentence, last_reviewed, next_review) VALUES
(1, 'achieve', 'achieved', 'achieved', 'บรรลุ', 'regular', 1, 'en', 3, 'Achieve your goals.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'appreciate', 'appreciated', 'appreciated', 'ชื่นชม', 'regular', 1, 'en', 3, 'I appreciate your help.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'communicate', 'communicated', 'communicated', 'สื่อสาร', 'regular', 1, 'en', 3, 'Communicate effectively.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'concentrate', 'concentrated', 'concentrated', 'มุ่งความสนใจ', 'regular', 1, 'en', 3, 'Concentrate on work.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'consider', 'considered', 'considered', 'พิจารณา', 'regular', 1, 'en', 3, 'Consider this option.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'demonstrate', 'demonstrated', 'demonstrated', 'สาธิต', 'regular', 1, 'en', 3, 'Demonstrate the method.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'determine', 'determined', 'determined', 'ตัดสินใจ', 'regular', 1, 'en', 3, 'Determine the cause.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'eliminate', 'eliminated', 'eliminated', 'กำจัด', 'regular', 1, 'en', 3, 'Eliminate errors.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'emphasize', 'emphasized', 'emphasized', 'เน้น', 'regular', 1, 'en', 3, 'Emphasize this point.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'establish', 'established', 'established', 'ก่อตั้ง', 'regular', 1, 'en', 3, 'Establish a business.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'evaluate', 'evaluated', 'evaluated', 'ประเมิน', 'regular', 1, 'en', 3, 'Evaluate performance.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'generate', 'generated', 'generated', 'สร้าง', 'regular', 1, 'en', 3, 'Generate ideas.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'identify', 'identified', 'identified', 'ระบุ', 'regular', 1, 'en', 3, 'Identify the problem.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'implement', 'implemented', 'implemented', 'ปฏิบัติ', 'regular', 1, 'en', 3, 'Implement the plan.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'investigate', 'investigated', 'investigated', 'สืบสวน', 'regular', 1, 'en', 3, 'Investigate the case.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'maintain', 'maintained', 'maintained', 'บำรุงรักษา', 'regular', 1, 'en', 3, 'Maintain equipment.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'participate', 'participated', 'participated', 'มีส่วนร่วม', 'regular', 1, 'en', 3, 'Participate actively.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'recognize', 'recognized', 'recognized', 'จำได้', 'regular', 1, 'en', 3, 'I recognize you.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'recommend', 'recommended', 'recommended', 'แนะนำ', 'regular', 1, 'en', 3, 'I recommend this.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'represent', 'represented', 'represented', 'เป็นตัวแทน', 'regular', 1, 'en', 3, 'Represent the team.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY));

-- ============================================
-- สิ้นสุดไฟล์
-- ============================================
-- หมายเหตุ: รวม 150 verbs ใหม่ + 70 verbs เดิม = 220 verbs ทั้งหมด

