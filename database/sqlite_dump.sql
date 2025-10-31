PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
ANALYZE sqlite_schema;
ANALYZE sqlite_schema;
INSERT INTO sqlite_stat1 VALUES('vocabulary',NULL,'134');
INSERT INTO sqlite_stat1 VALUES('achievements',NULL,'36');
INSERT INTO sqlite_stat1 VALUES('challenges',NULL,'4');
INSERT INTO sqlite_stat1 VALUES('missions',NULL,'10');
INSERT INTO sqlite_stat1 VALUES('badges',NULL,'10');
INSERT INTO sqlite_stat1 VALUES('user_stats',NULL,'1');
INSERT INTO sqlite_stat1 VALUES('languages',NULL,'6');
INSERT INTO sqlite_stat1 VALUES('lessons',NULL,'60');
INSERT INTO sqlite_stat1 VALUES('questions',NULL,'300');
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    total_xp INTEGER NOT NULL DEFAULT 0,
    lessons_completed INTEGER NOT NULL DEFAULT 0,
    joined_date TEXT NOT NULL,
    level INTEGER NOT NULL DEFAULT 1,
    total_points INTEGER NOT NULL DEFAULT 0,
    streak INTEGER DEFAULT 0,
    perfect_lesson_streak INTEGER DEFAULT 0,
    recommended_starting_lesson INTEGER,
    speaking_practice TEXT,
    games TEXT,
    assessment TEXT,
    practice_stats TEXT,
    study_times TEXT,
    completed_lessons TEXT,
    timed_writing TEXT
);
CREATE TABLE user_stats (
    id INTEGER PRIMARY KEY,
    total_xp INTEGER NOT NULL DEFAULT 0,
    lessons_completed INTEGER NOT NULL DEFAULT 0,
    joined_date TEXT NOT NULL,
    level INTEGER NOT NULL DEFAULT 1,
    total_points INTEGER NOT NULL DEFAULT 0
);
INSERT INTO user_stats VALUES(1,120,8,'2025-05-20',1,120);
CREATE TABLE languages (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    icon TEXT NOT NULL
);
INSERT INTO languages VALUES(1,'English','en','🇬🇧');
INSERT INTO languages VALUES(2,'Thai','th','🇹🇭');
INSERT INTO languages VALUES(3,'Chinese','zh','🇨🇳');
INSERT INTO languages VALUES(4,'Italian','it','🇮🇹');
INSERT INTO languages VALUES(5,'Japanese','ja','🇯🇵');
INSERT INTO languages VALUES(6,'Korean','ko','🇰🇷');
CREATE TABLE lessons (
    id INTEGER PRIMARY KEY,
    language_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    total_questions INTEGER NOT NULL,
    lesson_order INTEGER NOT NULL, -- Changed 'order' to 'lesson_order' to avoid SQL keyword conflict
    difficulty INTEGER NOT NULL DEFAULT 1,
    description TEXT NOT NULL
);
INSERT INTO lessons VALUES(101,1,'Basic Greetings',5,1,1,'Learn basic English greetings and introductions');
INSERT INTO lessons VALUES(102,1,'Common Phrases',5,2,1,'Essential phrases for everyday conversations');
INSERT INTO lessons VALUES(103,1,'Numbers & Counting',5,3,1,'Learn numbers and basic counting in English');
INSERT INTO lessons VALUES(104,1,'Colors & Descriptions',5,4,2,'Learn colors and descriptive adjectives');
INSERT INTO lessons VALUES(105,1,'Food & Dining',5,5,2,'Vocabulary for food, restaurants, and lessonOrdering meals');
INSERT INTO lessons VALUES(106,1,'Travel & Directions',5,6,2,'Essential vocabulary for traveling and asking for directions');
INSERT INTO lessons VALUES(107,1,'Present Tense Verbs',5,7,3,'Learn to use verbs in the present tense');
INSERT INTO lessons VALUES(108,1,'Past Tense Verbs',5,8,3,'Learn to use verbs in the past tense');
INSERT INTO lessons VALUES(109,1,'Future Tense',5,9,3,'Express future actions and plans in English');
INSERT INTO lessons VALUES(110,1,'Idioms & Expressions',5,10,4,'Common English idioms and expressions');
INSERT INTO lessons VALUES(111,1,'Family Members',5,11,2,'Learn vocabulary for family relationships');
INSERT INTO lessons VALUES(112,1,'Body Parts',5,12,2,'Vocabulary for parts of the human body');
INSERT INTO lessons VALUES(113,1,'Clothing & Fashion',5,13,2,'Learn words for different types of clothing');
INSERT INTO lessons VALUES(114,1,'Weather & Seasons',5,14,2,'Vocabulary for weather conditions and seasons');
INSERT INTO lessons VALUES(115,1,'Animals & Pets',5,15,2,'Learn names of common animals and pets');
INSERT INTO lessons VALUES(116,1,'House & Furniture',5,16,3,'Vocabulary for parts of a house and furniture');
INSERT INTO lessons VALUES(117,1,'School & Education',5,17,3,'Learn vocabulary related to school and education');
INSERT INTO lessons VALUES(118,1,'Jobs & Professions',5,18,3,'Vocabulary for different jobs and professions');
INSERT INTO lessons VALUES(119,1,'Hobbies & Activities',5,19,3,'Learn words for various hobbies and leisure activities');
INSERT INTO lessons VALUES(120,1,'Sports & Games',5,20,3,'Vocabulary for different sports and games');
INSERT INTO lessons VALUES(121,1,'Health & Medicine',5,21,4,'Learn vocabulary related to health and medicine');
INSERT INTO lessons VALUES(122,1,'Technology & Computers',5,22,4,'Vocabulary for technology and computing');
INSERT INTO lessons VALUES(123,1,'Shopping & Money',5,23,3,'Learn words related to shopping and finances');
INSERT INTO lessons VALUES(124,1,'Emotions & Feelings',5,24,3,'Vocabulary for expressing emotions and feelings');
INSERT INTO lessons VALUES(125,1,'Time & Calendar',5,25,3,'Learn to talk about time, dates, and schedules');
INSERT INTO lessons VALUES(126,1,'Modal Verbs',5,26,4,'Using can, could, should, would, must, and might');
INSERT INTO lessons VALUES(127,1,'Prepositions',5,27,4,'Learn to use prepositions correctly');
INSERT INTO lessons VALUES(128,1,'Conjunctions',5,28,4,'Using and, but, or, because, although, etc.');
INSERT INTO lessons VALUES(129,1,'Adjectives & Adverbs',5,29,4,'Learn to use descriptive words correctly');
INSERT INTO lessons VALUES(130,1,'Comparative & Superlative',5,30,4,'Using -er, -est, more, most, etc.');
INSERT INTO lessons VALUES(131,1,'Conditionals',5,31,5,'If clauses and conditional sentences');
INSERT INTO lessons VALUES(132,1,'Passive Voice',5,32,5,'Learn to form and use passive voice sentences');
INSERT INTO lessons VALUES(133,1,'Reported Speech',5,33,5,'Converting direct speech to reported speech');
INSERT INTO lessons VALUES(134,1,'Phrasal Verbs',5,34,5,'Common phrasal verbs in English');
INSERT INTO lessons VALUES(135,1,'Collocations',5,35,5,'Words that naturally go together in English');
INSERT INTO lessons VALUES(136,1,'Academic Vocabulary',5,36,5,'Vocabulary for academic writing and speaking');
INSERT INTO lessons VALUES(137,1,'Business English',5,37,5,'Vocabulary and phrases for business contexts');
INSERT INTO lessons VALUES(138,1,'Slang & Informal English',5,38,5,'Common slang terms and informal expressions');
INSERT INTO lessons VALUES(139,1,'British vs American English',5,39,4,'Differences between British and American English');
INSERT INTO lessons VALUES(140,1,'Advanced Idioms',5,40,5,'Complex and less common English idioms');
INSERT INTO lessons VALUES(141,1,'Perfect Tenses',5,41,6,'Master present perfect, past perfect, and future perfect tenses');
INSERT INTO lessons VALUES(142,1,'Continuous Tenses',5,42,6,'Master present continuous, past continuous, and future continuous tenses');
INSERT INTO lessons VALUES(143,1,'Perfect Continuous Tenses',5,43,7,'Master present perfect continuous, past perfect continuous, and future perfect continuous tenses');
INSERT INTO lessons VALUES(144,1,'Gerunds & Infinitives',5,44,7,'Learn when to use gerunds (-ing) and infinitives (to + verb)');
INSERT INTO lessons VALUES(145,1,'Participles',5,45,7,'Using present and past participles correctly');
INSERT INTO lessons VALUES(146,1,'Relative Clauses',5,46,6,'Using who, which, that, whose, and where in relative clauses');
INSERT INTO lessons VALUES(147,1,'Cleft Sentences',5,47,8,'Using it-clefts and what-clefts for emphasis');
INSERT INTO lessons VALUES(148,1,'Inversion',5,48,8,'Inverting subject and verb for emphasis or after negative adverbials');
INSERT INTO lessons VALUES(149,1,'Subjunctive Mood',5,49,9,'Using the subjunctive mood in formal and hypothetical situations');
INSERT INTO lessons VALUES(150,1,'Mixed Conditionals',5,50,8,'Combining different types of conditionals');
INSERT INTO lessons VALUES(151,1,'Ellipsis & Substitution',5,51,7,'Omitting words and using substitutes like ''one'', ''do'', etc.');
INSERT INTO lessons VALUES(152,1,'Nominalization',5,52,8,'Converting verbs and adjectives into nouns');
INSERT INTO lessons VALUES(153,1,'Hedging Language',5,53,7,'Using cautious language to express uncertainty or politeness');
INSERT INTO lessons VALUES(154,1,'Cohesive Devices',5,54,7,'Using linking words and phrases to connect ideas');
INSERT INTO lessons VALUES(155,1,'Rhetorical Devices',5,55,9,'Using metaphor, simile, hyperbole, and other rhetorical devices');
INSERT INTO lessons VALUES(156,1,'Academic Writing Style',5,56,8,'Formal language, objectivity, and precision in academic writing');
INSERT INTO lessons VALUES(157,1,'Technical Vocabulary',5,57,9,'Specialized vocabulary for science, technology, and other fields');
INSERT INTO lessons VALUES(158,1,'Idiomatic Expressions',5,58,8,'Advanced idiomatic expressions and their meanings');
INSERT INTO lessons VALUES(159,1,'Cultural References',5,59,9,'Understanding cultural references in English-speaking countries');
INSERT INTO lessons VALUES(160,1,'Literary Analysis',5,60,10,'Analyzing literary texts and understanding literary devices');
CREATE TABLE questions (
    id INTEGER PRIMARY KEY,
    lesson_id INTEGER NOT NULL,
    type TEXT NOT NULL,
    prompt TEXT NOT NULL,
    options TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    audio_url TEXT,
    image_url TEXT
);
INSERT INTO questions VALUES(1001,101,'multiple-choice','Which phrase is used to greet someone in the morning?','["Good morning","Good evening","Good night","Goodbye"]','Good morning',NULL,NULL);
INSERT INTO questions VALUES(1002,101,'matching','Match the greetings with the appropriate time','[{"id":1,"text":"Good morning","matchId":4,"side":"left"},{"id":2,"text":"Good afternoon","matchId":5,"side":"left"},{"id":3,"text":"Good evening","matchId":6,"side":"left"},{"id":4,"text":"5-12 AM","matchId":1,"side":"right"},{"id":5,"text":"12-5 PM","matchId":2,"side":"right"},{"id":6,"text":"5-9 PM","matchId":3,"side":"right"}]','matching',NULL,NULL);
INSERT INTO questions VALUES(1003,101,'fill-blank','_____ to meet you! My name is John.','["Nice","Happy","Glad","Pleased"]','Nice',NULL,NULL);
INSERT INTO questions VALUES(1004,101,'multiple-choice','Which is a formal way to greet someone?','["Hey!","Hello, how do you do?","What''s up?","Hi there!"]','Hello, how do you do?',NULL,NULL);
INSERT INTO questions VALUES(1005,101,'multiple-choice','What do you say when leaving a place in the evening?','["Good morning","Hello","Good evening","Good night"]','Good night',NULL,NULL);
INSERT INTO questions VALUES(1006,102,'multiple-choice','Which of these is a fruit?','["Carrot","Potato","Apple","Onion"]','Apple',NULL,NULL);
INSERT INTO questions VALUES(1007,102,'matching','Match the foods with their categories','[{"id":1,"text":"Apple","matchId":4,"side":"left"},{"id":2,"text":"Chicken","matchId":5,"side":"left"},{"id":3,"text":"Bread","matchId":6,"side":"left"},{"id":4,"text":"Fruit","matchId":1,"side":"right"},{"id":5,"text":"Meat","matchId":2,"side":"right"},{"id":6,"text":"Grain","matchId":3,"side":"right"}]','matching',NULL,NULL);
INSERT INTO questions VALUES(1008,102,'fill-blank','I would like a glass of _____.','["water","chair","book","pen"]','water',NULL,NULL);
INSERT INTO questions VALUES(1009,102,'multiple-choice','Which meal is typically eaten in the morning?','["Breakfast","Lunch","Dinner","Supper"]','Breakfast',NULL,NULL);
INSERT INTO questions VALUES(1010,102,'multiple-choice','Which of these is a vegetable?','["Orange","Banana","Broccoli","Milk"]','Broccoli',NULL,NULL);
INSERT INTO questions VALUES(1011,103,'multiple-choice','What comes after ''nineteen''?','["Eighteen","Twenty","Twelve","Ninety"]','Twenty',NULL,NULL);
INSERT INTO questions VALUES(1012,103,'matching','Match the numbers with their written forms','[{"id":1,"text":"1","matchId":4,"side":"left"},{"id":2,"text":"5","matchId":5,"side":"left"},{"id":3,"text":"10","matchId":6,"side":"left"},{"id":4,"text":"One","matchId":1,"side":"right"},{"id":5,"text":"Five","matchId":2,"side":"right"},{"id":6,"text":"Ten","matchId":3,"side":"right"}]','matching',NULL,NULL);
INSERT INTO questions VALUES(1013,103,'fill-blank','There are _____ days in a week.','["seven","five","ten","thirty"]','seven',NULL,NULL);
INSERT INTO questions VALUES(1014,103,'multiple-choice','Which is the correct spelling of 25?','["Twenty-five","Twentyfive","Twoty-five","Twenty five"]','Twenty-five',NULL,NULL);
INSERT INTO questions VALUES(1015,103,'multiple-choice','How many months are in a year?','["10","11","12","13"]','12',NULL,NULL);
INSERT INTO questions VALUES(1016,104,'multiple-choice','Which color is made by mixing blue and yellow?','["Red","Purple","Green","Orange"]','Green',NULL,NULL);
INSERT INTO questions VALUES(1017,104,'matching','Match the colors with common objects of that color','[{"id":1,"text":"Red","matchId":4,"side":"left"},{"id":2,"text":"Blue","matchId":5,"side":"left"},{"id":3,"text":"Green","matchId":6,"side":"left"},{"id":4,"text":"Apple","matchId":1,"side":"right"},{"id":5,"text":"Sky","matchId":2,"side":"right"},{"id":6,"text":"Grass","matchId":3,"side":"right"}]','matching',NULL,NULL);
INSERT INTO questions VALUES(1018,104,'fill-blank','The sun is _____.','["yellow","blue","green","purple"]','yellow',NULL,NULL);
INSERT INTO questions VALUES(1019,104,'multiple-choice','Which is NOT a primary color?','["Red","Blue","Green","Yellow"]','Green',NULL,NULL);
INSERT INTO questions VALUES(1020,104,'multiple-choice','What color is often associated with sadness?','["Red","Blue","Yellow","Green"]','Blue',NULL,NULL);
INSERT INTO questions VALUES(1021,105,'multiple-choice','Which of these is a main course?','["Ice cream","Salad","Steak","Bread"]','Steak',NULL,NULL);
INSERT INTO questions VALUES(1022,105,'matching','Match the foods with their categories','[{"id":1,"text":"Pizza","matchId":4,"side":"left"},{"id":2,"text":"Orange juice","matchId":5,"side":"left"},{"id":3,"text":"Cake","matchId":6,"side":"left"},{"id":4,"text":"Main dish","matchId":1,"side":"right"},{"id":5,"text":"Beverage","matchId":2,"side":"right"},{"id":6,"text":"Dessert","matchId":3,"side":"right"}]','matching',NULL,NULL);
INSERT INTO questions VALUES(1023,105,'fill-blank','I would like to _____ a table for two.','["reserve","buy","cook","eat"]','reserve',NULL,NULL);
INSERT INTO questions VALUES(1024,105,'multiple-choice','What do you say when you want the bill?','["I''m hungry","Check, please","I''m thirsty","Goodbye"]','Check, please',NULL,NULL);
INSERT INTO questions VALUES(1025,105,'multiple-choice','Which of these is a dessert?','["Soup","Salad","Ice cream","Bread"]','Ice cream',NULL,NULL);
INSERT INTO questions VALUES(1026,106,'multiple-choice','Where would you go to borrow books?','["Hospital","Library","Restaurant","Park"]','Library',NULL,NULL);
INSERT INTO questions VALUES(1027,106,'matching','Match the places with their functions','[{"id":1,"text":"School","matchId":4,"side":"left"},{"id":2,"text":"Hospital","matchId":5,"side":"left"},{"id":3,"text":"Restaurant","matchId":6,"side":"left"},{"id":4,"text":"Learning","matchId":1,"side":"right"},{"id":5,"text":"Healthcare","matchId":2,"side":"right"},{"id":6,"text":"Dining","matchId":3,"side":"right"}]','matching',NULL,NULL);
INSERT INTO questions VALUES(1028,106,'fill-blank','Turn _____ at the traffic light to reach the museum.','["right","left","around","back"]','right',NULL,NULL);
INSERT INTO questions VALUES(1029,106,'multiple-choice','Which is the opposite of ''north''?','["East","West","South","Up"]','South',NULL,NULL);
INSERT INTO questions VALUES(1030,106,'multiple-choice','Where would you go to see animals?','["Library","Zoo","Bank","Post Office"]','Zoo',NULL,NULL);
INSERT INTO questions VALUES(1031,107,'multiple-choice','Which word describes the action of moving on foot?','["Run","Walk","Jump","Sit"]','Walk',NULL,NULL);
INSERT INTO questions VALUES(1032,107,'matching','Match the verbs with their meanings','[{"id":1,"text":"Eat","matchId":4,"side":"left"},{"id":2,"text":"Sleep","matchId":5,"side":"left"},{"id":3,"text":"Read","matchId":6,"side":"left"},{"id":4,"text":"Consume food","matchId":1,"side":"right"},{"id":5,"text":"Rest with eyes closed","matchId":2,"side":"right"},{"id":6,"text":"Look at and comprehend text","matchId":3,"side":"right"}]','matching',NULL,NULL);
INSERT INTO questions VALUES(1033,107,'fill-blank','I _____ to school every day.','["go","goes","going","went"]','go',NULL,NULL);
INSERT INTO questions VALUES(1034,107,'multiple-choice','Which verb is in the present tense?','["Walked","Walking","Walks","Will walk"]','Walks',NULL,NULL);
INSERT INTO questions VALUES(1035,107,'multiple-choice','What is the opposite of ''buy''?','["Sell","Give","Take","Borrow"]','Sell',NULL,NULL);
INSERT INTO questions VALUES(1036,108,'multiple-choice','Which is the past tense of ''go''?','["Goes","Going","Went","Gone"]','Went',NULL,NULL);
INSERT INTO questions VALUES(1037,108,'matching','Match the verbs with their past tense forms','[{"id":1,"text":"Eat","matchId":4,"side":"left"},{"id":2,"text":"Write","matchId":5,"side":"left"},{"id":3,"text":"Run","matchId":6,"side":"left"},{"id":4,"text":"Ate","matchId":1,"side":"right"},{"id":5,"text":"Wrote","matchId":2,"side":"right"},{"id":6,"text":"Ran","matchId":3,"side":"right"}]','matching',NULL,NULL);
INSERT INTO questions VALUES(1038,108,'fill-blank','Yesterday, I _____ to the store.','["go","goes","went","going"]','went',NULL,NULL);
INSERT INTO questions VALUES(1039,108,'multiple-choice','Which sentence uses the past tense correctly?','["I am going to school yesterday.","I went to school yesterday.","I go to school yesterday.","I will go to school yesterday."]','I went to school yesterday.',NULL,NULL);
INSERT INTO questions VALUES(1040,108,'multiple-choice','What is the past tense of ''see''?','["Sees","Seeing","Saw","Seen"]','Saw',NULL,NULL);
INSERT INTO questions VALUES(1041,109,'multiple-choice','Which is the future tense of ''go''?','["Goes","Going","Went","Will go"]','Will go',NULL,NULL);
INSERT INTO questions VALUES(1042,109,'matching','Match the verbs with their future tense forms','[{"id":1,"text":"Eat","matchId":4,"side":"left"},{"id":2,"text":"Write","matchId":5,"side":"left"},{"id":3,"text":"Run","matchId":6,"side":"left"},{"id":4,"text":"Will eat","matchId":1,"side":"right"},{"id":5,"text":"Will write","matchId":2,"side":"right"},{"id":6,"text":"Will run","matchId":3,"side":"right"}]','matching',NULL,NULL);
INSERT INTO questions VALUES(1043,109,'fill-blank','Tomorrow, I _____ to the store.','["go","goes","went","will go"]','will go',NULL,NULL);
INSERT INTO questions VALUES(1044,109,'multiple-choice','Which sentence uses the future tense correctly?','["I am going to school tomorrow.","I went to school tomorrow.","I will go to school tomorrow.","I go to school tomorrow."]','I will go to school tomorrow.',NULL,NULL);
INSERT INTO questions VALUES(1045,109,'multiple-choice','What is the future tense of ''see''?','["Sees","Seeing","Saw","Will see"]','Will see',NULL,NULL);
INSERT INTO questions VALUES(1046,110,'multiple-choice','What does ''It''s raining cats and dogs'' mean?','["Animals are falling from the sky","It''s raining heavily","There are many pets outside","The weather is nice"]','It''s raining heavily',NULL,NULL);
INSERT INTO questions VALUES(1047,110,'matching','Match the idioms with their meanings','[{"id":1,"text":"Break a leg","matchId":4,"side":"left"},{"id":2,"text":"Piece of cake","matchId":5,"side":"left"},{"id":3,"text":"Hit the hay","matchId":6,"side":"left"},{"id":4,"text":"Good luck","matchId":1,"side":"right"},{"id":5,"text":"Very easy","matchId":2,"side":"right"},{"id":6,"text":"Go to sleep","matchId":3,"side":"right"}]','matching',NULL,NULL);
INSERT INTO questions VALUES(1048,110,'fill-blank','When something is very easy, we say it''s a _____.','["piece of cake","hard nut","tough cookie","sweet pie"]','piece of cake',NULL,NULL);
INSERT INTO questions VALUES(1049,110,'multiple-choice','What does ''Hit the hay'' mean?','["Go to sleep","Play sports","Eat food","Work hard"]','Go to sleep',NULL,NULL);
INSERT INTO questions VALUES(1050,110,'multiple-choice','What does ''Break a leg'' mean?','["Get injured","Good luck","Run fast","Work hard"]','Good luck',NULL,NULL);
INSERT INTO questions VALUES(1051,111,'multiple-choice','What is the English word for ''father''?','["Mother","Father","Brother","Sister"]','Father',NULL,NULL);
INSERT INTO questions VALUES(1052,111,'matching','Match the family members with their meanings','[{"id":1,"text":"Mother","matchId":4,"side":"left"},{"id":2,"text":"Brother","matchId":5,"side":"left"},{"id":3,"text":"Grandmother","matchId":6,"side":"left"},{"id":4,"text":"แม่","matchId":1,"side":"right"},{"id":5,"text":"พี่ชาย/น้องชาย","matchId":2,"side":"right"},{"id":6,"text":"ยาย/ย่า","matchId":3,"side":"right"}]','matching',NULL,NULL);
INSERT INTO questions VALUES(1053,111,'fill-blank','My father''s sister is my _____.','["aunt","uncle","cousin","niece"]','aunt',NULL,NULL);
INSERT INTO questions VALUES(1054,111,'multiple-choice','What do you call your mother''s brother in English?','["Aunt","Uncle","Cousin","Nephew"]','Uncle',NULL,NULL);
INSERT INTO questions VALUES(1055,111,'multiple-choice','What do you call your mother''s sister in English?','["Aunt","Uncle","Cousin","Sister-in-law"]','Aunt',NULL,NULL);
INSERT INTO questions VALUES(1056,112,'multiple-choice','Which of these is a part of the face?','["Knee","Elbow","Nose","Shoulder"]','Nose',NULL,NULL);
INSERT INTO questions VALUES(1057,112,'matching','Match the body parts with their locations','[{"id":1,"text":"Hand","matchId":4,"side":"left"},{"id":2,"text":"Foot","matchId":5,"side":"left"},{"id":3,"text":"Eye","matchId":6,"side":"left"},{"id":4,"text":"End of arm","matchId":1,"side":"right"},{"id":5,"text":"End of leg","matchId":2,"side":"right"},{"id":6,"text":"On face","matchId":3,"side":"right"}]','matching',NULL,NULL);
INSERT INTO questions VALUES(1058,112,'fill-blank','We use our _____ to hear sounds.','["ears","eyes","nose","mouth"]','ears',NULL,NULL);
INSERT INTO questions VALUES(1059,112,'multiple-choice','Which body part do we use to taste food?','["Nose","Ears","Tongue","Eyes"]','Tongue',NULL,NULL);
INSERT INTO questions VALUES(1060,112,'multiple-choice','Which part of the body do you use to smell?','["Nose","Ears","Eyes","Mouth"]','Nose',NULL,NULL);
INSERT INTO questions VALUES(1061,113,'multiple-choice','Which of these do you wear on your feet?','["Hat","Gloves","Shoes","Scarf"]','Shoes',NULL,NULL);
INSERT INTO questions VALUES(1062,113,'matching','Match the clothing items with their categories','[{"id":1,"text":"T-shirt","matchId":4,"side":"left"},{"id":2,"text":"Jeans","matchId":5,"side":"left"},{"id":3,"text":"Sneakers","matchId":6,"side":"left"},{"id":4,"text":"Top","matchId":1,"side":"right"},{"id":5,"text":"Bottom","matchId":2,"side":"right"},{"id":6,"text":"Footwear","matchId":3,"side":"right"}]','matching',NULL,NULL);
INSERT INTO questions VALUES(1063,113,'fill-blank','In winter, people often wear a warm _____.','["coat","swimsuit","shorts","sandals"]','coat',NULL,NULL);
INSERT INTO questions VALUES(1064,113,'multiple-choice','What do you wear to protect your eyes from the sun?','["Hat","Sunglasses","Scarf","Gloves"]','Sunglasses',NULL,NULL);
INSERT INTO questions VALUES(1065,113,'multiple-choice','What do you call the formal clothing worn for special occasions like weddings?','["Suit","Pajamas","Sportswear","Uniform"]','Suit',NULL,NULL);
INSERT INTO questions VALUES(1066,114,'multiple-choice','Which season comes after summer?','["Winter","Spring","Fall/Autumn","None of these"]','Fall/Autumn',NULL,NULL);
INSERT INTO questions VALUES(1067,114,'matching','Match the weather conditions with their descriptions','[{"id":1,"text":"Sunny","matchId":4,"side":"left"},{"id":2,"text":"Rainy","matchId":5,"side":"left"},{"id":3,"text":"Snowy","matchId":6,"side":"left"},{"id":4,"text":"Clear sky with bright sun","matchId":1,"side":"right"},{"id":5,"text":"Water falling from clouds","matchId":2,"side":"right"},{"id":6,"text":"White flakes falling from sky","matchId":3,"side":"right"}]','matching',NULL,NULL);
INSERT INTO questions VALUES(1068,114,'fill-blank','It''s very hot in the _____.','["summer","winter","spring","fall"]','summer',NULL,NULL);
INSERT INTO questions VALUES(1069,114,'multiple-choice','What do we call it when water falls from clouds in small drops?','["Snow","Rain","Fog","Wind"]','Rain',NULL,NULL);
INSERT INTO questions VALUES(1070,114,'multiple-choice','What season comes after winter in the Northern Hemisphere?','["Spring","Summer","Fall/Autumn","Monsoon"]','Spring',NULL,NULL);
INSERT INTO questions VALUES(1071,115,'multiple-choice','Which animal says ''meow''?','["Dog","Cat","Bird","Fish"]','Cat',NULL,NULL);
INSERT INTO questions VALUES(1072,115,'matching','Match the animals with their habitats','[{"id":1,"text":"Fish","matchId":4,"side":"left"},{"id":2,"text":"Bird","matchId":5,"side":"left"},{"id":3,"text":"Lion","matchId":6,"side":"left"},{"id":4,"text":"Water","matchId":1,"side":"right"},{"id":5,"text":"Sky","matchId":2,"side":"right"},{"id":6,"text":"Savanna","matchId":3,"side":"right"}]','matching',NULL,NULL);
INSERT INTO questions VALUES(1073,115,'fill-blank','A baby cat is called a _____.','["kitten","puppy","cub","calf"]','kitten',NULL,NULL);
INSERT INTO questions VALUES(1074,115,'multiple-choice','Which animal has a trunk?','["Lion","Elephant","Giraffe","Zebra"]','Elephant',NULL,NULL);
INSERT INTO questions VALUES(1075,115,'multiple-choice','What is a group of lions called in English?','["Pride","Herd","Flock","School"]','Pride',NULL,NULL);
INSERT INTO questions VALUES(1076,116,'multiple-choice','Which room is typically used for relaxing and watching television?','["Kitchen","Bathroom","Bedroom","Living room"]','Living room',NULL,NULL);
INSERT INTO questions VALUES(1077,116,'matching','Match the furniture with the rooms they are usually found in','[{"id":1,"text":"Bed","matchId":4,"side":"left"},{"id":2,"text":"Sofa","matchId":5,"side":"left"},{"id":3,"text":"Stove","matchId":6,"side":"left"},{"id":4,"text":"Bedroom","matchId":1,"side":"right"},{"id":5,"text":"Living room","matchId":2,"side":"right"},{"id":6,"text":"Kitchen","matchId":3,"side":"right"}]','matching',NULL,NULL);
INSERT INTO questions VALUES(1078,116,'fill-blank','We usually eat dinner at the _____ table.','["kitchen","bathroom","bedroom","dining"]','dining',NULL,NULL);
INSERT INTO questions VALUES(1079,116,'multiple-choice','What do you call the room where you cook food?','["Bedroom","Bathroom","Kitchen","Living room"]','Kitchen',NULL,NULL);
INSERT INTO questions VALUES(1080,116,'multiple-choice','Which furniture item do you use for storing clothes?','["Wardrobe","Bookshelf","Coffee table","Dining table"]','Wardrobe',NULL,NULL);
INSERT INTO questions VALUES(1081,117,'multiple-choice','Who is in charge of a school?','["Teacher","Principal","Janitor","Student"]','Principal',NULL,NULL);
INSERT INTO questions VALUES(1082,117,'matching','Match the school subjects with their descriptions','[{"id":1,"text":"Mathematics","matchId":4,"side":"left"},{"id":2,"text":"History","matchId":5,"side":"left"},{"id":3,"text":"Science","matchId":6,"side":"left"},{"id":4,"text":"Study of numbers","matchId":1,"side":"right"},{"id":5,"text":"Study of the past","matchId":2,"side":"right"},{"id":6,"text":"Study of natural world","matchId":3,"side":"right"}]','matching',NULL,NULL);
INSERT INTO questions VALUES(1083,117,'fill-blank','Students use a _____ to write with.','["pen","textbook","dictionary","calendar"]','pen',NULL,NULL);
INSERT INTO questions VALUES(1084,117,'multiple-choice','What do you call a book that contains information about words and their meanings?','["Textbook","Dictionary","Novel","Magazine"]','Dictionary',NULL,NULL);
INSERT INTO questions VALUES(1085,117,'multiple-choice','What do you call the person in charge of a university?','["Dean","Principal","Chancellor","Professor"]','Chancellor',NULL,NULL);
INSERT INTO questions VALUES(1086,118,'multiple-choice','Who flies an airplane?','["Teacher","Doctor","Engineer","Pilot"]','Pilot',NULL,NULL);
INSERT INTO questions VALUES(1087,118,'matching','Match the jobs with their workplaces','[{"id":1,"text":"Chef","matchId":4,"side":"left"},{"id":2,"text":"Librarian","matchId":5,"side":"left"},{"id":3,"text":"Pilot","matchId":6,"side":"left"},{"id":4,"text":"Restaurant","matchId":1,"side":"right"},{"id":5,"text":"Library","matchId":2,"side":"right"},{"id":6,"text":"Airplane","matchId":3,"side":"right"}]','matching',NULL,NULL);
INSERT INTO questions VALUES(1088,118,'fill-blank','A person who writes code for computers is called a _____.','["architect","programmer","artist","designer"]','programmer',NULL,NULL);
INSERT INTO questions VALUES(1089,118,'multiple-choice','Who treats sick animals?','["Doctor","Nurse","Veterinarian","Pharmacist"]','Veterinarian',NULL,NULL);
INSERT INTO questions VALUES(1090,118,'multiple-choice','Which professional helps people with legal problems?','["Veterinarian","Pharmacist","Dentist","Lawyer"]','Lawyer',NULL,NULL);
INSERT INTO questions VALUES(1091,119,'multiple-choice','Which activity is considered a hobby?','["Working","Sleeping","Reading","Eating"]','Reading',NULL,NULL);
INSERT INTO questions VALUES(1092,119,'matching','Match the hobbies with their descriptions','[{"id":1,"text":"Photography","matchId":4,"side":"left"},{"id":2,"text":"Gardening","matchId":5,"side":"left"},{"id":3,"text":"Painting","matchId":6,"side":"left"},{"id":4,"text":"Taking pictures","matchId":1,"side":"right"},{"id":5,"text":"Growing plants","matchId":2,"side":"right"},{"id":6,"text":"Creating art","matchId":3,"side":"right"}]','matching',NULL,NULL);
INSERT INTO questions VALUES(1093,119,'fill-blank','I enjoy _____ in my free time.','["cooking","work","sleep","eat"]','cooking',NULL,NULL);
INSERT INTO questions VALUES(1094,119,'multiple-choice','Which is NOT typically considered a hobby?','["Collecting stamps","Watching TV","Working","Playing chess"]','Working',NULL,NULL);
INSERT INTO questions VALUES(1095,119,'multiple-choice','What do you call someone who enjoys taking photographs?','["Photographer","Artist","Writer","Musician"]','Photographer',NULL,NULL);
INSERT INTO questions VALUES(1096,120,'multiple-choice','Which sport is played with a racket?','["Football","Tennis","Basketball","Swimming"]','Tennis',NULL,NULL);
INSERT INTO questions VALUES(1097,120,'matching','Match the sports with their equipment','[{"id":1,"text":"Football","matchId":4,"side":"left"},{"id":2,"text":"Tennis","matchId":5,"side":"left"},{"id":3,"text":"Basketball","matchId":6,"side":"left"},{"id":4,"text":"Ball","matchId":1,"side":"right"},{"id":5,"text":"Racket","matchId":2,"side":"right"},{"id":6,"text":"Hoop","matchId":3,"side":"right"}]','matching',NULL,NULL);
INSERT INTO questions VALUES(1098,120,'fill-blank','The Olympic Games are held every _____ years.','["two","three","four","five"]','four',NULL,NULL);
INSERT INTO questions VALUES(1099,120,'multiple-choice','Which sport is played on ice?','["Football","Basketball","Hockey","Tennis"]','Hockey',NULL,NULL);
INSERT INTO questions VALUES(1100,120,'multiple-choice','What do you call someone who plays sports professionally?','["Athlete","Student","Teacher","Doctor"]','Athlete',NULL,NULL);
INSERT INTO questions VALUES(1101,121,'multiple-choice','Who treats sick people?','["Teacher","Doctor","Engineer","Artist"]','Doctor',NULL,NULL);
INSERT INTO questions VALUES(1102,121,'matching','Match the medical terms with their meanings','[{"id":1,"text":"Fever","matchId":4,"side":"left"},{"id":2,"text":"Headache","matchId":5,"side":"left"},{"id":3,"text":"Cough","matchId":6,"side":"left"},{"id":4,"text":"High body temperature","matchId":1,"side":"right"},{"id":5,"text":"Pain in head","matchId":2,"side":"right"},{"id":6,"text":"Expelling air from lungs","matchId":3,"side":"right"}]','matching',NULL,NULL);
INSERT INTO questions VALUES(1103,121,'fill-blank','You should _____ your hands before eating.','["wash","eat","sleep","run"]','wash',NULL,NULL);
INSERT INTO questions VALUES(1104,121,'multiple-choice','Which is NOT a healthy habit?','["Exercising","Smoking","Eating vegetables","Getting enough sleep"]','Smoking',NULL,NULL);
INSERT INTO questions VALUES(1105,121,'multiple-choice','What do you call a place where medicines are prepared and sold?','["Hospital","Pharmacy","School","Office"]','Pharmacy',NULL,NULL);
INSERT INTO questions VALUES(1106,122,'multiple-choice','What do you use to type on a computer?','["Mouse","Keyboard","Screen","Printer"]','Keyboard',NULL,NULL);
INSERT INTO questions VALUES(1107,122,'matching','Match the devices with their functions','[{"id":1,"text":"Printer","matchId":4,"side":"left"},{"id":2,"text":"Scanner","matchId":5,"side":"left"},{"id":3,"text":"Router","matchId":6,"side":"left"},{"id":4,"text":"Makes paper copies","matchId":1,"side":"right"},{"id":5,"text":"Copies documents","matchId":2,"side":"right"},{"id":6,"text":"Connects to internet","matchId":3,"side":"right"}]','matching',NULL,NULL);
INSERT INTO questions VALUES(1108,122,'fill-blank','The internet allows us to _____ information quickly.','["share","eat","sleep","run"]','share',NULL,NULL);
INSERT INTO questions VALUES(1109,122,'multiple-choice','Which is NOT a computer part?','["CPU","RAM","Spoon","Hard Drive"]','Spoon',NULL,NULL);
INSERT INTO questions VALUES(1110,122,'multiple-choice','What do you call a program that protects your computer from viruses?','["Antivirus","Browser","Word processor","Calculator"]','Antivirus',NULL,NULL);
INSERT INTO questions VALUES(1111,123,'multiple-choice','Where do you go to buy groceries?','["School","Hospital","Supermarket","Office"]','Supermarket',NULL,NULL);
INSERT INTO questions VALUES(1112,123,'matching','Match the payment methods with their descriptions','[{"id":1,"text":"Cash","matchId":4,"side":"left"},{"id":2,"text":"Credit Card","matchId":5,"side":"left"},{"id":3,"text":"Debit Card","matchId":6,"side":"left"},{"id":4,"text":"Physical money","matchId":1,"side":"right"},{"id":5,"text":"Borrowed money","matchId":2,"side":"right"},{"id":6,"text":"Direct bank account","matchId":3,"side":"right"}]','matching',NULL,NULL);
INSERT INTO questions VALUES(1113,123,'fill-blank','The price of the item was _____ dollars.','["twenty","run","eat","sleep"]','twenty',NULL,NULL);
INSERT INTO questions VALUES(1114,123,'multiple-choice','What do you call a reduction in price?','["Discount","Increase","Payment","Receipt"]','Discount',NULL,NULL);
INSERT INTO questions VALUES(1115,123,'multiple-choice','Where do people keep their money?','["Bank","School","Hospital","Office"]','Bank',NULL,NULL);
INSERT INTO questions VALUES(1116,124,'multiple-choice','Which word describes a happy feeling?','["Sad","Angry","Joyful","Scared"]','Joyful',NULL,NULL);
INSERT INTO questions VALUES(1117,124,'matching','Match the emotions with their expressions','[{"id":1,"text":"Happy","matchId":4,"side":"left"},{"id":2,"text":"Sad","matchId":5,"side":"left"},{"id":3,"text":"Angry","matchId":6,"side":"left"},{"id":4,"text":"Smiling","matchId":1,"side":"right"},{"id":5,"text":"Crying","matchId":2,"side":"right"},{"id":6,"text":"Frowning","matchId":3,"side":"right"}]','matching',NULL,NULL);
INSERT INTO questions VALUES(1118,124,'fill-blank','She felt _____ after hearing the good news.','["excited","sad","angry","scared"]','excited',NULL,NULL);
INSERT INTO questions VALUES(1119,124,'multiple-choice','Which emotion is the opposite of ''happy''?','["Sad","Angry","Excited","Scared"]','Sad',NULL,NULL);
INSERT INTO questions VALUES(1120,124,'multiple-choice','What do you call a strong feeling of fear?','["Joy","Anger","Terror","Happiness"]','Terror',NULL,NULL);
INSERT INTO questions VALUES(1121,125,'multiple-choice','How many months are in a year?','["10","11","12","13"]','12',NULL,NULL);
INSERT INTO questions VALUES(1122,125,'matching','Match the time expressions with their meanings','[{"id":1,"text":"AM","matchId":4,"side":"left"},{"id":2,"text":"PM","matchId":5,"side":"left"},{"id":3,"text":"Noon","matchId":6,"side":"left"},{"id":4,"text":"Morning","matchId":1,"side":"right"},{"id":5,"text":"Afternoon/Evening","matchId":2,"side":"right"},{"id":6,"text":"12:00","matchId":3,"side":"right"}]','matching',NULL,NULL);
INSERT INTO questions VALUES(1123,125,'fill-blank','The meeting is scheduled for _____ o''clock.','["three","run","eat","sleep"]','three',NULL,NULL);
INSERT INTO questions VALUES(1124,125,'multiple-choice','Which day comes after Monday?','["Sunday","Tuesday","Wednesday","Thursday"]','Tuesday',NULL,NULL);
INSERT INTO questions VALUES(1125,125,'multiple-choice','What do you call the first day of the week in many countries?','["Monday","Sunday","Saturday","Friday"]','Monday',NULL,NULL);
INSERT INTO questions VALUES(1126,126,'multiple-choice','Which is a modal verb?','["Run","Can","Jump","Walk"]','Can',NULL,NULL);
INSERT INTO questions VALUES(1127,126,'matching','Match the modal verbs with their meanings','[{"id":1,"text":"Can","matchId":4,"side":"left"},{"id":2,"text":"Must","matchId":5,"side":"left"},{"id":3,"text":"Should","matchId":6,"side":"left"},{"id":4,"text":"Ability/Permission","matchId":1,"side":"right"},{"id":5,"text":"Obligation","matchId":2,"side":"right"},{"id":6,"text":"Advice","matchId":3,"side":"right"}]','matching',NULL,NULL);
INSERT INTO questions VALUES(1128,126,'fill-blank','You _____ wear a seatbelt when driving.','["can","must","should","may"]','must',NULL,NULL);
INSERT INTO questions VALUES(1129,126,'multiple-choice','Which modal verb expresses possibility?','["Can","Must","Should","May"]','May',NULL,NULL);
INSERT INTO questions VALUES(1130,126,'multiple-choice','What is the past form of ''can''?','["Can","Could","Caned","Canned"]','Could',NULL,NULL);
INSERT INTO questions VALUES(1131,127,'multiple-choice','Which is a preposition?','["Run","In","Jump","Walk"]','In',NULL,NULL);
INSERT INTO questions VALUES(1132,127,'matching','Match the prepositions with their uses','[{"id":1,"text":"In","matchId":4,"side":"left"},{"id":2,"text":"On","matchId":5,"side":"left"},{"id":3,"text":"At","matchId":6,"side":"left"},{"id":4,"text":"Inside something","matchId":1,"side":"right"},{"id":5,"text":"On top of","matchId":2,"side":"right"},{"id":6,"text":"Specific location","matchId":3,"side":"right"}]','matching',NULL,NULL);
INSERT INTO questions VALUES(1133,127,'fill-blank','The book is _____ the table.','["in","on","at","by"]','on',NULL,NULL);
INSERT INTO questions VALUES(1134,127,'multiple-choice','Which preposition is used for time?','["In","On","At","By"]','At',NULL,NULL);
INSERT INTO questions VALUES(1135,127,'multiple-choice','Which preposition is used for movement?','["In","On","At","To"]','To',NULL,NULL);
INSERT INTO questions VALUES(1136,128,'multiple-choice','Which is a conjunction?','["Run","And","Jump","Walk"]','And',NULL,NULL);
INSERT INTO questions VALUES(1137,128,'matching','Match the conjunctions with their functions','[{"id":1,"text":"And","matchId":4,"side":"left"},{"id":2,"text":"But","matchId":5,"side":"left"},{"id":3,"text":"Because","matchId":6,"side":"left"},{"id":4,"text":"Addition","matchId":1,"side":"right"},{"id":5,"text":"Contrast","matchId":2,"side":"right"},{"id":6,"text":"Reason","matchId":3,"side":"right"}]','matching',NULL,NULL);
INSERT INTO questions VALUES(1138,128,'fill-blank','I like tea _____ I don''t like coffee.','["and","but","because","or"]','but',NULL,NULL);
INSERT INTO questions VALUES(1139,128,'multiple-choice','Which conjunction shows cause and effect?','["And","But","Because","Or"]','Because',NULL,NULL);
INSERT INTO questions VALUES(1140,128,'multiple-choice','Which conjunction is used for alternatives?','["And","But","Because","Or"]','Or',NULL,NULL);
INSERT INTO questions VALUES(1141,129,'multiple-choice','Which is an adjective?','["Run","Beautiful","Jump","Walk"]','Beautiful',NULL,NULL);
INSERT INTO questions VALUES(1142,129,'matching','Match the words with their types','[{"id":1,"text":"Happy","matchId":4,"side":"left"},{"id":2,"text":"Quickly","matchId":5,"side":"left"},{"id":3,"text":"Carefully","matchId":6,"side":"left"},{"id":4,"text":"Adjective","matchId":1,"side":"right"},{"id":5,"text":"Adverb","matchId":2,"side":"right"},{"id":6,"text":"Adverb","matchId":3,"side":"right"}]','matching',NULL,NULL);
INSERT INTO questions VALUES(1143,129,'fill-blank','She sings _____.','["beautiful","beautifully","beauty","beautify"]','beautifully',NULL,NULL);
INSERT INTO questions VALUES(1144,129,'multiple-choice','Which word is an adverb?','["Happy","Sad","Quickly","Angry"]','Quickly',NULL,NULL);
INSERT INTO questions VALUES(1145,129,'multiple-choice','What do adverbs usually end with?','["-ful","-ly","-ing","-ed"]','-ly',NULL,NULL);
INSERT INTO questions VALUES(1146,130,'multiple-choice','Which is the comparative form of ''big''?','["Big","Bigger","Biggest","Bigly"]','Bigger',NULL,NULL);
INSERT INTO questions VALUES(1147,130,'matching','Match the adjectives with their comparative forms','[{"id":1,"text":"Tall","matchId":4,"side":"left"},{"id":2,"text":"Beautiful","matchId":5,"side":"left"},{"id":3,"text":"Good","matchId":6,"side":"left"},{"id":4,"text":"Taller","matchId":1,"side":"right"},{"id":5,"text":"More beautiful","matchId":2,"side":"right"},{"id":6,"text":"Better","matchId":3,"side":"right"}]','matching',NULL,NULL);
INSERT INTO questions VALUES(1148,130,'fill-blank','This is the _____ book I''ve ever read.','["good","better","best","goodest"]','best',NULL,NULL);
INSERT INTO questions VALUES(1149,130,'multiple-choice','Which is the superlative form of ''far''?','["Far","Farrer","Farest","Furthest"]','Furthest',NULL,NULL);
INSERT INTO questions VALUES(1150,130,'multiple-choice','What do we use for comparative adjectives with more than two syllables?','["More","Most","-er","-est"]','More',NULL,NULL);
INSERT INTO questions VALUES(1151,131,'multiple-choice','Which is a first conditional sentence?','["If I had money, I would buy a car.","If I have money, I will buy a car.","If I had had money, I would have bought a car.","If I have had money, I will have bought a car."]','If I have money, I will buy a car.',NULL,NULL);
INSERT INTO questions VALUES(1152,131,'matching','Match the conditionals with their structures','[{"id":1,"text":"First","matchId":4,"side":"left"},{"id":2,"text":"Second","matchId":5,"side":"left"},{"id":3,"text":"Third","matchId":6,"side":"left"},{"id":4,"text":"If + present, will + base","matchId":1,"side":"right"},{"id":5,"text":"If + past, would + base","matchId":2,"side":"right"},{"id":6,"text":"If + past perfect, would have + past participle","matchId":3,"side":"right"}]','matching',NULL,NULL);
INSERT INTO questions VALUES(1153,131,'fill-blank','If it rains tomorrow, I _____ at home.','["stay","will stay","stayed","would stay"]','will stay',NULL,NULL);
INSERT INTO questions VALUES(1154,131,'multiple-choice','Which conditional is used for hypothetical situations?','["First","Second","Third","Zero"]','Second',NULL,NULL);
INSERT INTO questions VALUES(1155,131,'multiple-choice','Which conditional is used for past situations that didn''t happen?','["First","Second","Third","Zero"]','Third',NULL,NULL);
INSERT INTO questions VALUES(1156,132,'multiple-choice','Which sentence is in passive voice?','["The cat chased the mouse.","The mouse was chased by the cat.","The cat is chasing the mouse.","The cat will chase the mouse."]','The mouse was chased by the cat.',NULL,NULL);
INSERT INTO questions VALUES(1157,132,'matching','Match the active sentences with their passive forms','[{"id":1,"text":"She writes a letter","matchId":4,"side":"left"},{"id":2,"text":"They built a house","matchId":5,"side":"left"},{"id":3,"text":"He will fix the car","matchId":6,"side":"left"},{"id":4,"text":"A letter is written by her","matchId":1,"side":"right"},{"id":5,"text":"A house was built by them","matchId":2,"side":"right"},{"id":6,"text":"The car will be fixed by him","matchId":3,"side":"right"}]','matching',NULL,NULL);
INSERT INTO questions VALUES(1158,132,'fill-blank','The book _____ by many students.','["read","is read","reads","reading"]','is read',NULL,NULL);
INSERT INTO questions VALUES(1159,132,'multiple-choice','What is the passive form of ''They are building a bridge''?','["A bridge is being built by them","A bridge is built by them","A bridge was built by them","A bridge will be built by them"]','A bridge is being built by them',NULL,NULL);
INSERT INTO questions VALUES(1160,132,'multiple-choice','Which auxiliary verb is used in passive voice?','["Do","Have","Be","Will"]','Be',NULL,NULL);
INSERT INTO questions VALUES(1161,133,'multiple-choice','Which is the correct reported speech for ''I am happy''?','["He said he is happy","He said he was happy","He said he has been happy","He said he will be happy"]','He said he was happy',NULL,NULL);
INSERT INTO questions VALUES(1162,133,'matching','Match the direct speech with reported speech','[{"id":1,"text":"I will help you","matchId":4,"side":"left"},{"id":2,"text":"I have finished","matchId":5,"side":"left"},{"id":3,"text":"I can swim","matchId":6,"side":"left"},{"id":4,"text":"He said he would help me","matchId":1,"side":"right"},{"id":5,"text":"He said he had finished","matchId":2,"side":"right"},{"id":6,"text":"He said he could swim","matchId":3,"side":"right"}]','matching',NULL,NULL);
INSERT INTO questions VALUES(1163,133,'fill-blank','She said she _____ to the party.','["go","goes","went","going"]','went',NULL,NULL);
INSERT INTO questions VALUES(1164,133,'multiple-choice','What happens to time expressions in reported speech?','["They stay the same","They change to past forms","They are removed","They are replaced with ''then''"]','They change to past forms',NULL,NULL);
INSERT INTO questions VALUES(1165,133,'multiple-choice','Which pronoun changes in reported speech?','["I","You","He","They"]','I',NULL,NULL);
INSERT INTO questions VALUES(1166,134,'multiple-choice','Which sentence uses a gerund?','["I want to swim","I enjoy swimming","I can swim","I will swim"]','I enjoy swimming',NULL,NULL);
INSERT INTO questions VALUES(1167,134,'matching','Match the verbs with their correct form','[{"id":1,"text":"Enjoy","matchId":4,"side":"left"},{"id":2,"text":"Want","matchId":5,"side":"left"},{"id":3,"text":"Finish","matchId":6,"side":"left"},{"id":4,"text":"Gerund","matchId":1,"side":"right"},{"id":5,"text":"Infinitive","matchId":2,"side":"right"},{"id":6,"text":"Gerund","matchId":3,"side":"right"}]','matching',NULL,NULL);
INSERT INTO questions VALUES(1168,134,'fill-blank','I decided _____ a new car.','["buy","to buy","buying","bought"]','to buy',NULL,NULL);
INSERT INTO questions VALUES(1169,134,'multiple-choice','Which verb is followed by a gerund?','["Want","Decide","Enjoy","Plan"]','Enjoy',NULL,NULL);
INSERT INTO questions VALUES(1170,134,'multiple-choice','What is the infinitive form of ''go''?','["Go","To go","Going","Gone"]','To go',NULL,NULL);
INSERT INTO questions VALUES(1171,135,'multiple-choice','What does ''give up'' mean?','["To give something to someone","To stop doing something","To increase something","To start something"]','To stop doing something',NULL,NULL);
INSERT INTO questions VALUES(1172,135,'matching','Match the phrasal verbs with their meanings','[{"id":1,"text":"Look up","matchId":4,"side":"left"},{"id":2,"text":"Put off","matchId":5,"side":"left"},{"id":3,"text":"Take off","matchId":6,"side":"left"},{"id":4,"text":"Search for information","matchId":1,"side":"right"},{"id":5,"text":"Postpone","matchId":2,"side":"right"},{"id":6,"text":"Remove","matchId":3,"side":"right"}]','matching',NULL,NULL);
INSERT INTO questions VALUES(1173,135,'fill-blank','I need to _____ this meeting until next week.','["put off","put on","put up","put down"]','put off',NULL,NULL);
INSERT INTO questions VALUES(1174,135,'multiple-choice','Which phrasal verb means ''to start a journey''?','["Set up","Set off","Set down","Set in"]','Set off',NULL,NULL);
INSERT INTO questions VALUES(1175,135,'multiple-choice','What is the opposite of ''turn on''?','["Turn off","Turn up","Turn down","Turn in"]','Turn off',NULL,NULL);
INSERT INTO questions VALUES(1176,136,'multiple-choice','Which is a correct collocation?','["Make a mistake","Do a mistake","Have a mistake","Take a mistake"]','Make a mistake',NULL,NULL);
INSERT INTO questions VALUES(1177,136,'matching','Match the verbs with their collocations','[{"id":1,"text":"Make","matchId":4,"side":"left"},{"id":2,"text":"Do","matchId":5,"side":"left"},{"id":3,"text":"Take","matchId":6,"side":"left"},{"id":4,"text":"A decision","matchId":1,"side":"right"},{"id":5,"text":"Homework","matchId":2,"side":"right"},{"id":6,"text":"A break","matchId":3,"side":"right"}]','matching',NULL,NULL);
INSERT INTO questions VALUES(1178,136,'fill-blank','I need to _____ a decision soon.','["make","do","take","have"]','make',NULL,NULL);
INSERT INTO questions VALUES(1179,136,'multiple-choice','Which verb goes with ''a shower''?','["Make","Do","Take","Have"]','Take',NULL,NULL);
INSERT INTO questions VALUES(1180,136,'multiple-choice','What is the correct collocation for ''a photo''?','["Make a photo","Do a photo","Take a photo","Have a photo"]','Take a photo',NULL,NULL);
INSERT INTO questions VALUES(1181,137,'multiple-choice','What does ''break a leg'' mean?','["To actually break your leg","Good luck","To be careful","To be unlucky"]','Good luck',NULL,NULL);
INSERT INTO questions VALUES(1182,137,'matching','Match the idioms with their meanings','[{"id":1,"text":"Piece of cake","matchId":4,"side":"left"},{"id":2,"text":"Cost an arm and a leg","matchId":5,"side":"left"},{"id":3,"text":"Hit the books","matchId":6,"side":"left"},{"id":4,"text":"Very easy","matchId":1,"side":"right"},{"id":5,"text":"Very expensive","matchId":2,"side":"right"},{"id":6,"text":"Study hard","matchId":3,"side":"right"}]','matching',NULL,NULL);
INSERT INTO questions VALUES(1183,137,'fill-blank','This test was a _____ of cake.','["piece","part","bit","slice"]','piece',NULL,NULL);
INSERT INTO questions VALUES(1184,137,'multiple-choice','What does ''raining cats and dogs'' mean?','["Animals are falling from the sky","It''s raining heavily","It''s a nice day","It''s snowing"]','It''s raining heavily',NULL,NULL);
INSERT INTO questions VALUES(1185,137,'multiple-choice','Which idiom means ''to be very busy''?','["Break a leg","Piece of cake","Up to your ears","Cost an arm and a leg"]','Up to your ears',NULL,NULL);
INSERT INTO questions VALUES(1186,138,'multiple-choice','What is the noun form of ''happy''?','["Happy","Happily","Happiness","Happen"]','Happiness',NULL,NULL);
INSERT INTO questions VALUES(1187,138,'matching','Match the words with their correct forms','[{"id":1,"text":"Success","matchId":4,"side":"left"},{"id":2,"text":"Beautiful","matchId":5,"side":"left"},{"id":3,"text":"Quick","matchId":6,"side":"left"},{"id":4,"text":"Successful","matchId":1,"side":"right"},{"id":5,"text":"Beauty","matchId":2,"side":"right"},{"id":6,"text":"Quickly","matchId":3,"side":"right"}]','matching',NULL,NULL);
INSERT INTO questions VALUES(1188,138,'fill-blank','She spoke very _____.','["clear","clearly","clearness","clarify"]','clearly',NULL,NULL);
INSERT INTO questions VALUES(1189,138,'multiple-choice','Which suffix is used to form adverbs?','["-ness","-ly","-ful","-ment"]','-ly',NULL,NULL);
INSERT INTO questions VALUES(1190,138,'multiple-choice','What is the verb form of ''decision''?','["Decide","Decisive","Decided","Deciding"]','Decide',NULL,NULL);
INSERT INTO questions VALUES(1191,139,'multiple-choice','Which is a good topic sentence?','["I like dogs.","Dogs are popular pets.","Dogs are animals.","I have a dog."]','Dogs are popular pets.',NULL,NULL);
INSERT INTO questions VALUES(1192,139,'matching','Match the writing elements with their purposes','[{"id":1,"text":"Introduction","matchId":4,"side":"left"},{"id":2,"text":"Body","matchId":5,"side":"left"},{"id":3,"text":"Conclusion","matchId":6,"side":"left"},{"id":4,"text":"Present the topic","matchId":1,"side":"right"},{"id":5,"text":"Develop arguments","matchId":2,"side":"right"},{"id":6,"text":"Summarize main points","matchId":3,"side":"right"}]','matching',NULL,NULL);
INSERT INTO questions VALUES(1193,139,'fill-blank','The essay _____ with a strong conclusion.','["end","ends","ended","ending"]','ends',NULL,NULL);
INSERT INTO questions VALUES(1194,139,'multiple-choice','Which is a good transition word?','["And","But","However","So"]','However',NULL,NULL);
INSERT INTO questions VALUES(1195,139,'multiple-choice','What should a thesis statement do?','["List all arguments","State the main argument","Give examples","Ask questions"]','State the main argument',NULL,NULL);
INSERT INTO questions VALUES(1196,140,'multiple-choice','Which is a business email greeting?','["Hey!","Dear Sir/Madam","Hi there!","Hello friend"]','Dear Sir/Madam',NULL,NULL);
INSERT INTO questions VALUES(1197,140,'matching','Match the business terms with their meanings','[{"id":1,"text":"Deadline","matchId":4,"side":"left"},{"id":2,"text":"Agenda","matchId":5,"side":"left"},{"id":3,"text":"Budget","matchId":6,"side":"left"},{"id":4,"text":"Final date","matchId":1,"side":"right"},{"id":5,"text":"Meeting plan","matchId":2,"side":"right"},{"id":6,"text":"Financial plan","matchId":3,"side":"right"}]','matching',NULL,NULL);
INSERT INTO questions VALUES(1198,140,'fill-blank','Please _____ the attached document.','["see","look","review","watch"]','review',NULL,NULL);
INSERT INTO questions VALUES(1199,140,'multiple-choice','Which is a professional closing?','["Bye!","See you later!","Best regards","Take care!"]','Best regards',NULL,NULL);
INSERT INTO questions VALUES(1200,140,'multiple-choice','What is a ''follow-up''?','["A new meeting","A reminder","A cancellation","A complaint"]','A reminder',NULL,NULL);
INSERT INTO questions VALUES(2001,141,'multiple-choice','Which tense is used to describe an action that was completed before another past action?','["Present Perfect","Past Perfect","Future Perfect","Present Perfect Continuous"]','Past Perfect',NULL,NULL);
INSERT INTO questions VALUES(2002,141,'matching','Match the perfect tenses with their correct usage','[{"id":1,"text":"Present Perfect","matchId":4,"side":"left"},{"id":2,"text":"Past Perfect","matchId":5,"side":"left"},{"id":3,"text":"Future Perfect","matchId":6,"side":"left"},{"id":4,"text":"Action completed with relevance to present","matchId":1,"side":"right"},{"id":5,"text":"Action completed before another past action","matchId":2,"side":"right"},{"id":6,"text":"Action that will be completed before a future time","matchId":3,"side":"right"}]','matching',NULL,NULL);
INSERT INTO questions VALUES(2003,141,'fill-blank','By the time we arrived, the movie _____ (already start).','["has already started","had already started","will have already started","is already starting"]','had already started',NULL,NULL);
INSERT INTO questions VALUES(2004,141,'multiple-choice','Which sentence uses the present perfect tense correctly?','["I am living in Bangkok for five years.","I lived in Bangkok for five years.","I have lived in Bangkok for five years.","I had lived in Bangkok for five years."]','I have lived in Bangkok for five years.',NULL,NULL);
INSERT INTO questions VALUES(2005,141,'multiple-choice','By 2030, scientists _____ a cure for many types of cancer.','["will discover","will have discovered","have discovered","had discovered"]','will have discovered',NULL,NULL);
INSERT INTO questions VALUES(2006,142,'multiple-choice','Which tense is used to describe an action that was in progress at a specific time in the past?','["Present Continuous","Past Continuous","Future Continuous","Present Perfect Continuous"]','Past Continuous',NULL,NULL);
INSERT INTO questions VALUES(2007,142,'matching','Match the continuous tenses with their correct usage','[{"id":1,"text":"Present Continuous","matchId":4,"side":"left"},{"id":2,"text":"Past Continuous","matchId":5,"side":"left"},{"id":3,"text":"Future Continuous","matchId":6,"side":"left"},{"id":4,"text":"Action happening now","matchId":1,"side":"right"},{"id":5,"text":"Action in progress in the past","matchId":2,"side":"right"},{"id":6,"text":"Action that will be in progress in the future","matchId":3,"side":"right"}]','matching',NULL,NULL);
INSERT INTO questions VALUES(2008,142,'fill-blank','When the earthquake struck, people _____ (sleep).','["are sleeping","were sleeping","will be sleeping","have been sleeping"]','were sleeping',NULL,NULL);
INSERT INTO questions VALUES(2009,142,'multiple-choice','Which sentence uses the future continuous tense correctly?','["I will study when you arrive.","I will be studying when you arrive.","I have been studying when you arrive.","I am studying when you arrive."]','I will be studying when you arrive.',NULL,NULL);
INSERT INTO questions VALUES(2010,142,'multiple-choice','Look at those dark clouds. It _____ soon.','["is raining","was raining","will be raining","is going to rain"]','is going to rain',NULL,NULL);
INSERT INTO questions VALUES(2011,143,'multiple-choice','Which tense emphasizes the duration of an action that started in the past and continues to the present?','["Present Perfect","Past Perfect","Present Perfect Continuous","Past Perfect Continuous"]','Present Perfect Continuous',NULL,NULL);
INSERT INTO questions VALUES(2012,143,'matching','Match the perfect continuous tenses with their correct usage','[{"id":1,"text":"Present Perfect Continuous","matchId":4,"side":"left"},{"id":2,"text":"Past Perfect Continuous","matchId":5,"side":"left"},{"id":3,"text":"Future Perfect Continuous","matchId":6,"side":"left"},{"id":4,"text":"Action ongoing from past until now","matchId":1,"side":"right"},{"id":5,"text":"Action ongoing until a point in the past","matchId":2,"side":"right"},{"id":6,"text":"Action that will be ongoing until a future time","matchId":3,"side":"right"}]','matching',NULL,NULL);
INSERT INTO questions VALUES(2013,143,'fill-blank','By the time I retire, I _____ (work) for this company for 30 years.','["will have been working","have been working","had been working","will be working"]','will have been working',NULL,NULL);
INSERT INTO questions VALUES(2014,143,'multiple-choice','Which sentence uses the past perfect continuous tense correctly?','["I have been waiting for three hours.","I had been waiting for three hours when the bus finally arrived.","I will have been waiting for three hours by then.","I am waiting for three hours."]','I had been waiting for three hours when the bus finally arrived.',NULL,NULL);
INSERT INTO questions VALUES(2015,143,'multiple-choice','She looks tired because she _____.','["has been running","had been running","will have been running","is running"]','has been running',NULL,NULL);
INSERT INTO questions VALUES(2016,144,'multiple-choice','Which form of the verb is used after ''enjoy''?','["Infinitive (to + verb)","Gerund (-ing form)","Base form","Past participle"]','Gerund (-ing form)',NULL,NULL);
INSERT INTO questions VALUES(2017,144,'matching','Match the verbs with the form that follows them','[{"id":1,"text":"decide","matchId":4,"side":"left"},{"id":2,"text":"avoid","matchId":5,"side":"left"},{"id":3,"text":"make","matchId":6,"side":"left"},{"id":4,"text":"to + verb","matchId":1,"side":"right"},{"id":5,"text":"-ing form","matchId":2,"side":"right"},{"id":6,"text":"base form","matchId":3,"side":"right"}]','matching',NULL,NULL);
INSERT INTO questions VALUES(2018,144,'fill-blank','I can''t stand _____ in long lines.','["wait","to wait","waiting","waited"]','waiting',NULL,NULL);
INSERT INTO questions VALUES(2019,144,'multiple-choice','Which sentence uses the correct verb form?','["She promised returning early.","She promised to return early.","She promised return early.","She promised returned early."]','She promised to return early.',NULL,NULL);
INSERT INTO questions VALUES(2020,144,'multiple-choice','After ''suggest'', we use:','["to + verb","-ing form","base form","past participle"]','-ing form',NULL,NULL);
INSERT INTO questions VALUES(2021,145,'multiple-choice','Which is a present participle?','["Written","Write","Wrote","Writing"]','Writing',NULL,NULL);
INSERT INTO questions VALUES(2022,145,'matching','Match the participles with their usage','[{"id":1,"text":"Present Participle","matchId":4,"side":"left"},{"id":2,"text":"Past Participle","matchId":5,"side":"left"},{"id":3,"text":"Perfect Participle","matchId":6,"side":"left"},{"id":4,"text":"Describes ongoing action","matchId":1,"side":"right"},{"id":5,"text":"Describes completed action","matchId":2,"side":"right"},{"id":6,"text":"Describes action completed before another","matchId":3,"side":"right"}]','matching',NULL,NULL);
INSERT INTO questions VALUES(2023,145,'fill-blank','_____ by the news, she couldn''t speak.','["Shocking","Shocked","Having shocked","To shock"]','Shocked',NULL,NULL);
INSERT INTO questions VALUES(2024,145,'multiple-choice','Which sentence uses a participle correctly?','["Having finished his work, he went home.","Having finished his work, the home was where he went.","Having finished his work, the day was over.","Having finished his work, home went he."]','Having finished his work, he went home.',NULL,NULL);
INSERT INTO questions VALUES(2025,145,'multiple-choice','Identify the participle in: ''The broken window needs to be fixed.''','["The","Broken","Window","Fixed"]','Broken',NULL,NULL);
INSERT INTO questions VALUES(2026,146,'multiple-choice','Which relative pronoun is used for people?','["which","who","where","whose"]','who',NULL,NULL);
INSERT INTO questions VALUES(2027,146,'matching','Match the relative pronouns with their correct usage','[{"id":1,"text":"who","matchId":4,"side":"left"},{"id":2,"text":"which","matchId":5,"side":"left"},{"id":3,"text":"where","matchId":6,"side":"left"},{"id":4,"text":"for people","matchId":1,"side":"right"},{"id":5,"text":"for things","matchId":2,"side":"right"},{"id":6,"text":"for places","matchId":3,"side":"right"}]','matching',NULL,NULL);
INSERT INTO questions VALUES(2028,146,'fill-blank','The book _____ I bought yesterday is very interesting.','["who","which","where","whose"]','which',NULL,NULL);
INSERT INTO questions VALUES(2029,146,'multiple-choice','Which sentence uses a relative clause correctly?','["The man who lives next door is a doctor.","The man which lives next door is a doctor.","The man where lives next door is a doctor.","The man whose lives next door is a doctor."]','The man who lives next door is a doctor.',NULL,NULL);
INSERT INTO questions VALUES(2030,146,'multiple-choice','What is the function of ''whose'' in a relative clause?','["To show possession","To indicate time","To describe location","To express manner"]','To show possession',NULL,NULL);
INSERT INTO questions VALUES(2031,147,'multiple-choice','What is the purpose of a cleft sentence?','["To make a sentence longer","To emphasize a particular part","To make a sentence shorter","To change the tense"]','To emphasize a particular part',NULL,NULL);
INSERT INTO questions VALUES(2032,147,'matching','Match the cleft sentence types with their structures','[{"id":1,"text":"It-cleft","matchId":4,"side":"left"},{"id":2,"text":"What-cleft","matchId":5,"side":"left"},{"id":3,"text":"All-cleft","matchId":6,"side":"left"},{"id":4,"text":"It + be + emphasized part + that/who + rest","matchId":1,"side":"right"},{"id":5,"text":"What + subject + verb + be + emphasized part","matchId":2,"side":"right"},{"id":6,"text":"All + subject + verb + be + emphasized part","matchId":3,"side":"right"}]','matching',NULL,NULL);
INSERT INTO questions VALUES(2033,147,'fill-blank','_____ I need is a good night''s sleep.','["It","What","All","That"]','What',NULL,NULL);
INSERT INTO questions VALUES(2034,147,'multiple-choice','Which is a correct it-cleft sentence?','["It was John who won the race.","It is John that won the race.","It was John which won the race.","It is John where won the race."]','It was John who won the race.',NULL,NULL);
INSERT INTO questions VALUES(2035,147,'multiple-choice','What is the emphasized part in: ''What I want is a new car''?','["I","want","a new car","What"]','a new car',NULL,NULL);
INSERT INTO questions VALUES(2036,148,'multiple-choice','When do we use inversion in English?','["Only in questions","For emphasis or after negative adverbials","Only in formal writing","Only in spoken English"]','For emphasis or after negative adverbials',NULL,NULL);
INSERT INTO questions VALUES(2037,148,'matching','Match the negative adverbials with their inverted forms','[{"id":1,"text":"Never","matchId":4,"side":"left"},{"id":2,"text":"Rarely","matchId":5,"side":"left"},{"id":3,"text":"Not only","matchId":6,"side":"left"},{"id":4,"text":"Never have I seen","matchId":1,"side":"right"},{"id":5,"text":"Rarely do we see","matchId":2,"side":"right"},{"id":6,"text":"Not only did she win","matchId":3,"side":"right"}]','matching',NULL,NULL);
INSERT INTO questions VALUES(2038,148,'fill-blank','_____ had I arrived home when it started to rain.','["Hardly","Never","Rarely","Seldom"]','Hardly',NULL,NULL);
INSERT INTO questions VALUES(2039,148,'multiple-choice','Which sentence uses inversion correctly?','["Never I have seen such beauty.","Never have I seen such beauty.","Never I saw such beauty.","Never did I saw such beauty."]','Never have I seen such beauty.',NULL,NULL);
INSERT INTO questions VALUES(2040,148,'multiple-choice','What is the correct inverted form of: ''She not only won the race but also broke the record''?','["Not only she won the race but also broke the record.","Not only did she win the race but also broke the record.","Not only won she the race but also broke the record.","Not only she did win the race but also broke the record."]','Not only did she win the race but also broke the record.',NULL,NULL);
INSERT INTO questions VALUES(2041,149,'multiple-choice','What is the subjunctive mood used for?','["Only in questions","Expressing hypothetical or non-factual situations","Only in past tense","Only in formal writing"]','Expressing hypothetical or non-factual situations',NULL,NULL);
INSERT INTO questions VALUES(2042,149,'matching','Match the subjunctive triggers with their correct forms','[{"id":1,"text":"suggest","matchId":4,"side":"left"},{"id":2,"text":"wish","matchId":5,"side":"left"},{"id":3,"text":"if only","matchId":6,"side":"left"},{"id":4,"text":"that + base form","matchId":1,"side":"right"},{"id":5,"text":"past tense/were","matchId":2,"side":"right"},{"id":6,"text":"past tense/were","matchId":3,"side":"right"}]','matching',NULL,NULL);
INSERT INTO questions VALUES(2043,149,'fill-blank','I suggest that he _____ the meeting.','["attends","attend","attended","attending"]','attend',NULL,NULL);
INSERT INTO questions VALUES(2044,149,'multiple-choice','Which sentence uses the subjunctive mood correctly?','["I wish I was taller.","I wish I were taller.","I wish I am taller.","I wish I be taller."]','I wish I were taller.',NULL,NULL);
INSERT INTO questions VALUES(2045,149,'multiple-choice','What is the correct subjunctive form in: ''It''s important that she _____ on time''?','["arrives","arrive","arrived","arriving"]','arrive',NULL,NULL);
INSERT INTO questions VALUES(2046,150,'multiple-choice','What is a mixed conditional?','["A combination of two different conditional types","A conditional with mixed tenses","A conditional with mixed subjects","A conditional with mixed verbs"]','A combination of two different conditional types',NULL,NULL);
INSERT INTO questions VALUES(2047,150,'matching','Match the mixed conditional types with their structures','[{"id":1,"text":"Past-Present","matchId":4,"side":"left"},{"id":2,"text":"Present-Past","matchId":5,"side":"left"},{"id":3,"text":"Past-Future","matchId":6,"side":"left"},{"id":4,"text":"If + past perfect, would + base form","matchId":1,"side":"right"},{"id":5,"text":"If + present simple, would have + past participle","matchId":2,"side":"right"},{"id":6,"text":"If + past perfect, would + be + -ing","matchId":3,"side":"right"}]','matching',NULL,NULL);
INSERT INTO questions VALUES(2048,150,'fill-blank','If I _____ harder, I would have passed the exam.','["study","studied","had studied","would study"]','had studied',NULL,NULL);
INSERT INTO questions VALUES(2049,150,'multiple-choice','Which is a correct mixed conditional sentence?','["If I had studied medicine, I would be a doctor now.","If I studied medicine, I would have been a doctor now.","If I would study medicine, I would be a doctor now.","If I had studied medicine, I would have been a doctor now."]','If I had studied medicine, I would be a doctor now.',NULL,NULL);
INSERT INTO questions VALUES(2050,150,'multiple-choice','What is the correct mixed conditional form for: ''If I (be) rich, I (buy) that house last year''?','["If I were rich, I would have bought that house last year.","If I had been rich, I would buy that house last year.","If I was rich, I would have bought that house last year.","If I would be rich, I would have bought that house last year."]','If I were rich, I would have bought that house last year.',NULL,NULL);
INSERT INTO questions VALUES(2051,151,'multiple-choice','What is ellipsis in English grammar?','["Using three dots (...)","Omitting words that are understood from context","Replacing words with synonyms","Adding extra words for emphasis"]','Omitting words that are understood from context',NULL,NULL);
INSERT INTO questions VALUES(2052,151,'matching','Match the substitution words with their uses','[{"id":1,"text":"one/ones","matchId":4,"side":"left"},{"id":2,"text":"do/does/did","matchId":5,"side":"left"},{"id":3,"text":"so/not","matchId":6,"side":"left"},{"id":4,"text":"replace nouns","matchId":1,"side":"right"},{"id":5,"text":"replace verbs","matchId":2,"side":"right"},{"id":6,"text":"replace clauses","matchId":3,"side":"right"}]','matching',NULL,NULL);
INSERT INTO questions VALUES(2053,151,'fill-blank','I like the red car better than the blue _____.','["one","ones","it","them"]','one',NULL,NULL);
INSERT INTO questions VALUES(2054,151,'multiple-choice','Which sentence uses ellipsis correctly?','["I can swim and she can too.","I can swim and she can swim too.","I can swim and she too.","I can swim and she can."]','I can swim and she can too.',NULL,NULL);
INSERT INTO questions VALUES(2055,151,'multiple-choice','What is the correct substitution in: ''Do you like coffee? Yes, I _____''?','["do","like","do like","like it"]','do',NULL,NULL);
INSERT INTO questions VALUES(2056,152,'multiple-choice','What is nominalization?','["Converting verbs into nouns","Converting nouns into verbs","Converting adjectives into adverbs","Converting adverbs into adjectives"]','Converting verbs into nouns',NULL,NULL);
INSERT INTO questions VALUES(2057,152,'matching','Match the verbs with their nominalized forms','[{"id":1,"text":"decide","matchId":4,"side":"left"},{"id":2,"text":"develop","matchId":5,"side":"left"},{"id":3,"text":"analyze","matchId":6,"side":"left"},{"id":4,"text":"decision","matchId":1,"side":"right"},{"id":5,"text":"development","matchId":2,"side":"right"},{"id":6,"text":"analysis","matchId":3,"side":"right"}]','matching',NULL,NULL);
INSERT INTO questions VALUES(2058,152,'fill-blank','The _____ of the project took longer than expected.','["complete","completing","completion","completed"]','completion',NULL,NULL);
INSERT INTO questions VALUES(2059,152,'multiple-choice','Which sentence uses nominalization correctly?','["The company''s growth was impressive.","The company grew impressively.","The company was growing impressively.","The company had grown impressively."]','The company''s growth was impressive.',NULL,NULL);
INSERT INTO questions VALUES(2060,152,'multiple-choice','What is the nominalized form of ''to improve''?','["improving","improvement","improved","improves"]','improvement',NULL,NULL);
INSERT INTO questions VALUES(2061,153,'multiple-choice','What is hedging language used for?','["Making statements more direct","Expressing uncertainty or politeness","Making commands stronger","Expressing absolute certainty"]','Expressing uncertainty or politeness',NULL,NULL);
INSERT INTO questions VALUES(2062,153,'matching','Match the hedging expressions with their functions','[{"id":1,"text":"It seems that","matchId":4,"side":"left"},{"id":2,"text":"To some extent","matchId":5,"side":"left"},{"id":3,"text":"In my opinion","matchId":6,"side":"left"},{"id":4,"text":"Expresses probability","matchId":1,"side":"right"},{"id":5,"text":"Limits scope","matchId":2,"side":"right"},{"id":6,"text":"Personal viewpoint","matchId":3,"side":"right"}]','matching',NULL,NULL);
INSERT INTO questions VALUES(2063,153,'fill-blank','_____ the results suggest a positive correlation.','["Apparently","Certainly","Definitely","Absolutely"]','Apparently',NULL,NULL);
INSERT INTO questions VALUES(2064,153,'multiple-choice','Which sentence uses hedging language correctly?','["This is definitely the best solution.","This might be the best solution.","This is absolutely the best solution.","This is certainly the best solution."]','This might be the best solution.',NULL,NULL);
INSERT INTO questions VALUES(2065,153,'multiple-choice','What is the most appropriate hedging expression for: ''The data shows a clear trend''?','["The data definitely shows a clear trend.","The data appears to show a clear trend.","The data certainly shows a clear trend.","The data absolutely shows a clear trend."]','The data appears to show a clear trend.',NULL,NULL);
INSERT INTO questions VALUES(2066,154,'multiple-choice','What are cohesive devices used for?','["Making sentences longer","Connecting ideas and creating flow","Making sentences shorter","Adding emphasis to words"]','Connecting ideas and creating flow',NULL,NULL);
INSERT INTO questions VALUES(2067,154,'matching','Match the cohesive devices with their functions','[{"id":1,"text":"Furthermore","matchId":4,"side":"left"},{"id":2,"text":"However","matchId":5,"side":"left"},{"id":3,"text":"In conclusion","matchId":6,"side":"left"},{"id":4,"text":"Adds information","matchId":1,"side":"right"},{"id":5,"text":"Shows contrast","matchId":2,"side":"right"},{"id":6,"text":"Summarizes","matchId":3,"side":"right"}]','matching',NULL,NULL);
INSERT INTO questions VALUES(2068,154,'fill-blank','The weather was bad. _____, we decided to stay home.','["Therefore","However","Moreover","Furthermore"]','Therefore',NULL,NULL);
INSERT INTO questions VALUES(2069,154,'multiple-choice','Which sentence uses a cohesive device correctly?','["I like coffee. However, I prefer tea.","I like coffee. And, I prefer tea.","I like coffee. But, I prefer tea.","I like coffee. So, I prefer tea."]','I like coffee. However, I prefer tea.',NULL,NULL);
INSERT INTO questions VALUES(2070,154,'multiple-choice','What is the most appropriate cohesive device for: ''The study was well-designed. _____ the results were inconclusive''?','["Furthermore","However","Moreover","Additionally"]','However',NULL,NULL);
INSERT INTO questions VALUES(2071,155,'multiple-choice','What is a rhetorical device?','["A way to make writing more formal","A technique used to make language more effective","A way to make sentences shorter","A method to make writing more technical"]','A technique used to make language more effective',NULL,NULL);
INSERT INTO questions VALUES(2072,155,'matching','Match the rhetorical devices with their definitions','[{"id":1,"text":"Metaphor","matchId":4,"side":"left"},{"id":2,"text":"Simile","matchId":5,"side":"left"},{"id":3,"text":"Hyperbole","matchId":6,"side":"left"},{"id":4,"text":"Direct comparison without ''like'' or ''as''","matchId":1,"side":"right"},{"id":5,"text":"Comparison using ''like'' or ''as''","matchId":2,"side":"right"},{"id":6,"text":"Exaggeration for effect","matchId":3,"side":"right"}]','matching',NULL,NULL);
INSERT INTO questions VALUES(2073,155,'fill-blank','Her smile was as bright as the _____.','["sun","moon","stars","sky"]','sun',NULL,NULL);
INSERT INTO questions VALUES(2074,155,'multiple-choice','Which sentence contains a metaphor?','["Life is a journey.","Life is like a journey.","Life is as a journey.","Life is similar to a journey."]','Life is a journey.',NULL,NULL);
INSERT INTO questions VALUES(2075,155,'multiple-choice','What rhetorical device is used in: ''I''ve told you a million times''?','["Metaphor","Simile","Hyperbole","Personification"]','Hyperbole',NULL,NULL);
INSERT INTO questions VALUES(2076,156,'multiple-choice','What is the main characteristic of academic writing?','["Using informal language","Using formal, objective language","Using emotional language","Using conversational style"]','Using formal, objective language',NULL,NULL);
INSERT INTO questions VALUES(2077,156,'matching','Match the academic writing features with their purposes','[{"id":1,"text":"Passive voice","matchId":4,"side":"left"},{"id":2,"text":"Nominalization","matchId":5,"side":"left"},{"id":3,"text":"Hedging","matchId":6,"side":"left"},{"id":4,"text":"Emphasizes process over agent","matchId":1,"side":"right"},{"id":5,"text":"Creates more formal tone","matchId":2,"side":"right"},{"id":6,"text":"Shows caution in claims","matchId":3,"side":"right"}]','matching',NULL,NULL);
INSERT INTO questions VALUES(2078,156,'fill-blank','The research _____ conducted over a period of three years.','["was","is","were","are"]','was',NULL,NULL);
INSERT INTO questions VALUES(2079,156,'multiple-choice','Which sentence is most appropriate for academic writing?','["I think the results are pretty good.","The results appear to be significant.","The results are really good.","I believe the results are good."]','The results appear to be significant.',NULL,NULL);
INSERT INTO questions VALUES(2080,156,'multiple-choice','What should be avoided in academic writing?','["Formal language","Contractions (e.g., don''t, can''t)","Passive voice","Technical terms"]','Contractions (e.g., don''t, can''t)',NULL,NULL);
INSERT INTO questions VALUES(2081,157,'multiple-choice','What is technical vocabulary?','["Everyday words","Specialized terms used in specific fields","Slang words","Basic vocabulary"]','Specialized terms used in specific fields',NULL,NULL);
INSERT INTO questions VALUES(2082,157,'matching','Match the technical terms with their fields','[{"id":1,"text":"Algorithm","matchId":4,"side":"left"},{"id":2,"text":"Molecule","matchId":5,"side":"left"},{"id":3,"text":"Syntax","matchId":6,"side":"left"},{"id":4,"text":"Computer Science","matchId":1,"side":"right"},{"id":5,"text":"Chemistry","matchId":2,"side":"right"},{"id":6,"text":"Linguistics","matchId":3,"side":"right"}]','matching',NULL,NULL);
INSERT INTO questions VALUES(2083,157,'fill-blank','The _____ of the experiment was carefully controlled.','["variables","things","stuff","items"]','variables',NULL,NULL);
INSERT INTO questions VALUES(2084,157,'multiple-choice','Which term is most appropriate in a scientific context?','["The thing that makes it work","The mechanism","The stuff that does it","The way it works"]','The mechanism',NULL,NULL);
INSERT INTO questions VALUES(2085,157,'multiple-choice','What is the technical term for ''the study of how living things interact with their environment''?','["Biology","Ecology","Zoology","Botany"]','Ecology',NULL,NULL);
INSERT INTO questions VALUES(2086,158,'multiple-choice','What is an idiomatic expression?','["A literal phrase","A phrase with a meaning different from its literal meaning","A formal expression","A technical term"]','A phrase with a meaning different from its literal meaning',NULL,NULL);
INSERT INTO questions VALUES(2087,158,'matching','Match the idioms with their meanings','[{"id":1,"text":"Hit the nail on the head","matchId":4,"side":"left"},{"id":2,"text":"Pull someone''s leg","matchId":5,"side":"left"},{"id":3,"text":"Break a leg","matchId":6,"side":"left"},{"id":4,"text":"Be exactly right","matchId":1,"side":"right"},{"id":5,"text":"Joke with someone","matchId":2,"side":"right"},{"id":6,"text":"Good luck","matchId":3,"side":"right"}]','matching',NULL,NULL);
INSERT INTO questions VALUES(2088,158,'fill-blank','When someone is very busy, we say they''re up to their _____ in work.','["eyes","ears","nose","mouth"]','eyes',NULL,NULL);
INSERT INTO questions VALUES(2089,158,'multiple-choice','What does ''It''s raining cats and dogs'' mean?','["Animals are falling from the sky","It''s raining heavily","There are many pets outside","The weather is nice"]','It''s raining heavily',NULL,NULL);
INSERT INTO questions VALUES(2090,158,'multiple-choice','Which idiom means ''to be very expensive''?','["Cost an arm and a leg","Break a leg","Pull someone''s leg","Hit the nail on the head"]','Cost an arm and a leg',NULL,NULL);
INSERT INTO questions VALUES(2091,159,'multiple-choice','What are cultural references?','["Only historical events","References to cultural elements that are widely understood","Only modern events","Only religious events"]','References to cultural elements that are widely understood',NULL,NULL);
INSERT INTO questions VALUES(2092,159,'matching','Match the cultural references with their origins','[{"id":1,"text":"Cinderella","matchId":4,"side":"left"},{"id":2,"text":"Sherlock Holmes","matchId":5,"side":"left"},{"id":3,"text":"Romeo and Juliet","matchId":6,"side":"left"},{"id":4,"text":"Fairy tale","matchId":1,"side":"right"},{"id":5,"text":"British literature","matchId":2,"side":"right"},{"id":6,"text":"Shakespeare","matchId":3,"side":"right"}]','matching',NULL,NULL);
INSERT INTO questions VALUES(2093,159,'fill-blank','When someone is very strong, we might say they''re as strong as _____.','["Hercules","Zeus","Atlas","Apollo"]','Hercules',NULL,NULL);
INSERT INTO questions VALUES(2094,159,'multiple-choice','What does ''Pandora''s box'' refer to?','["A gift box","A source of many problems","A treasure chest","A jewelry box"]','A source of many problems',NULL,NULL);
INSERT INTO questions VALUES(2095,159,'multiple-choice','Which cultural reference is associated with wisdom?','["King Midas","The Oracle of Delphi","The Trojan Horse","The Golden Fleece"]','The Oracle of Delphi',NULL,NULL);
INSERT INTO questions VALUES(2096,160,'multiple-choice','What is literary analysis?','["Only reading books","Examining and interpreting literary works","Only writing stories","Only memorizing poems"]','Examining and interpreting literary works',NULL,NULL);
INSERT INTO questions VALUES(2097,160,'matching','Match the literary devices with their definitions','[{"id":1,"text":"Metaphor","matchId":4,"side":"left"},{"id":2,"text":"Alliteration","matchId":5,"side":"left"},{"id":3,"text":"Irony","matchId":6,"side":"left"},{"id":4,"text":"Direct comparison","matchId":1,"side":"right"},{"id":5,"text":"Repetition of sounds","matchId":2,"side":"right"},{"id":6,"text":"Opposite of expected","matchId":3,"side":"right"}]','matching',NULL,NULL);
INSERT INTO questions VALUES(2098,160,'fill-blank','The author''s use of _____ helps create a dark and mysterious atmosphere.','["imagery","words","sentences","phrases"]','imagery',NULL,NULL);
INSERT INTO questions VALUES(2099,160,'multiple-choice','Which is an example of personification?','["The wind howled through the trees","The trees were tall","The wind was strong","The trees moved in the wind"]','The wind howled through the trees',NULL,NULL);
INSERT INTO questions VALUES(2100,160,'multiple-choice','What is the main purpose of a literary analysis?','["To summarize the plot","To understand and interpret the deeper meaning","To memorize the text","To rewrite the story"]','To understand and interpret the deeper meaning',NULL,NULL);
CREATE TABLE user_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    lesson_id INTEGER NOT NULL,
    question_id INTEGER NOT NULL,
    completed INTEGER NOT NULL,
    correct INTEGER NOT NULL,
    timestamp TEXT NOT NULL
);
CREATE TABLE achievements (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    requirement TEXT NOT NULL,
    xp_reward INTEGER DEFAULT 0,
    points_reward INTEGER DEFAULT 0,
    category TEXT,
    rarity TEXT
);
INSERT INTO achievements VALUES(1,'First Steps','Complete your first lesson','Footprints','lessons_completed >= 1',10,20,'progress','common');
INSERT INTO achievements VALUES(2,'Dedicated Learner','Complete 10 lessons','GraduationCap','lessons_completed >= 10',50,100,'progress','uncommon');
INSERT INTO achievements VALUES(3,'Learning Enthusiast','Complete 50 lessons','BookOpen','lessons_completed >= 50',200,400,'progress','rare');
INSERT INTO achievements VALUES(4,'Language Scholar','Complete 100 lessons','Scroll','lessons_completed >= 100',500,1000,'progress','epic');
INSERT INTO achievements VALUES(5,'Getting Started','Maintain a 3-day streak','Flame','current_streak >= 3',15,30,'streak','common');
INSERT INTO achievements VALUES(6,'Consistency','Maintain a 7-day streak','CalendarCheck','current_streak >= 7',30,60,'streak','uncommon');
INSERT INTO achievements VALUES(7,'Dedication','Maintain a 30-day streak','CalendarDays','current_streak >= 30',150,300,'streak','rare');
INSERT INTO achievements VALUES(8,'Unstoppable','Maintain a 100-day streak','Zap','current_streak >= 100',1000,2000,'streak','legendary');
INSERT INTO achievements VALUES(9,'Perfect Score','Get 100% on a lesson','Target','perfect_lesson = true',20,40,'mastery','uncommon');
INSERT INTO achievements VALUES(10,'Mastery Streak','Get 100% on 5 lessons in a row','Award','perfect_streak >= 5',100,200,'mastery','rare');
INSERT INTO achievements VALUES(11,'Language Master','Complete all lessons in a language','Trophy','language_complete = true',500,1000,'mastery','epic');
INSERT INTO achievements VALUES(12,'Word Collector','Learn 10 vocabulary words','BookMarked','vocabulary_learned >= 10',15,30,'vocabulary','common');
INSERT INTO achievements VALUES(13,'Vocabulary Builder','Learn 50 vocabulary words','Library','vocabulary_learned >= 50',50,100,'vocabulary','uncommon');
INSERT INTO achievements VALUES(14,'Word Expert','Learn 200 vocabulary words','BookText','vocabulary_learned >= 200',200,400,'vocabulary','rare');
INSERT INTO achievements VALUES(15,'Vocabulary Master','Learn 500 vocabulary words','BookOpenCheck','vocabulary_learned >= 500',500,1000,'vocabulary','epic');
INSERT INTO achievements VALUES(16,'Game Beginner','Play 5 language games','Gamepad2','games_played >= 5',15,30,'games','common');
INSERT INTO achievements VALUES(17,'Game Enthusiast','Play 20 language games','Puzzle','games_played >= 20',40,80,'games','uncommon');
INSERT INTO achievements VALUES(18,'Word Scramble Master','Score 1000+ points in Word Scramble','ScanText','word_scramble_score >= 1000',100,200,'games','rare');
INSERT INTO achievements VALUES(19,'Memory Match Expert','Complete Memory Match with no mistakes','Brain','memory_match_perfect = true',100,200,'games','rare');
INSERT INTO achievements VALUES(20,'Listening Beginner','Complete 5 listening exercises','Ear','listening_exercises >= 5',15,30,'practice','common');
INSERT INTO achievements VALUES(21,'Speaking Beginner','Complete 5 speaking exercises','Mic','speaking_exercises >= 5',15,30,'practice','common');
INSERT INTO achievements VALUES(22,'Reading Beginner','Complete 5 reading exercises','BookOpen','reading_exercises >= 5',15,30,'practice','common');
INSERT INTO achievements VALUES(23,'Practice Master','Complete 50 practice exercises of any type','Dumbbell','total_practice >= 50',150,300,'practice','rare');
INSERT INTO achievements VALUES(24,'Night Owl','Study after midnight','Moon','study_after_midnight = true',25,50,'special','uncommon');
INSERT INTO achievements VALUES(25,'Early Bird','Study before 6 AM','Sunrise','study_before_6am = true',25,50,'special','uncommon');
INSERT INTO achievements VALUES(26,'Weekend Warrior','Study on both Saturday and Sunday','Calendar','weekend_study = true',30,60,'special','uncommon');
INSERT INTO achievements VALUES(27,'Polyglot','Reach level 5 in 3 different languages','Globe','languages_level5 >= 3',1000,2000,'special','legendary');
INSERT INTO achievements VALUES(28,'Budding Writer','Complete your first writing exercise','PenLine','writing_practice >= 1',20,20,'writing','common');
INSERT INTO achievements VALUES(29,'Wordsmith','Complete 10 writing exercises','PenLine','writing_practice >= 10',50,50,'writing','uncommon');
INSERT INTO achievements VALUES(30,'Essay Expert','Complete 25 writing exercises','PenLine','writing_practice >= 25',100,100,'writing','rare');
INSERT INTO achievements VALUES(31,'Perfect Prose','Get 5 perfect scores on writing exercises','PenLine','writing_perfect >= 5',150,150,'writing','epic');
INSERT INTO achievements VALUES(32,'Beat the Clock','Complete your first timed writing challenge','Clock','timed_writing >= 1',25,25,'timed_challenges','common');
INSERT INTO achievements VALUES(33,'Speed Writer','Complete 5 timed writing challenges','Clock','timed_writing >= 5',50,50,'timed_challenges','uncommon');
INSERT INTO achievements VALUES(34,'Writing Machine','Complete 15 timed writing challenges','Clock','timed_writing >= 15',100,100,'timed_challenges','rare');
INSERT INTO achievements VALUES(35,'Lightning Fingers','Complete an advanced timed writing challenge with more than 30 seconds remaining','Zap','timed_writing_fast = true',200,200,'timed_challenges','epic');
INSERT INTO achievements VALUES(36,'Writing Marathon','Complete 5 timed writing challenges in a single day','Timer','timed_writing_marathon = true',150,150,'timed_challenges','rare');
CREATE TABLE user_achievements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    achievement_id INTEGER NOT NULL,
    unlocked INTEGER NOT NULL DEFAULT 0,
    unlocked_at TEXT,
    claimed INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE vocabulary (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    word TEXT NOT NULL,
    translation TEXT NOT NULL,
    language_id INTEGER NOT NULL,
    language_code TEXT NOT NULL,
    difficulty REAL NOT NULL,
    last_reviewed TEXT NOT NULL,
    next_review TEXT NOT NULL,
    correct_count INTEGER NOT NULL DEFAULT 0,
    incorrect_count INTEGER NOT NULL DEFAULT 0
);
INSERT INTO vocabulary VALUES(1,1,'hello','สวัสดี',1,'en',1.0,'2025-05-20T17:09:10.544Z','2025-05-20T17:09:10.544Z',0,0);
INSERT INTO vocabulary VALUES(2,1,'goodbye','ลาก่อน',1,'en',1.0,'2025-05-20T17:09:10.544Z','2025-05-20T17:09:10.544Z',0,0);
INSERT INTO vocabulary VALUES(3,1,'thank you','ขอบคุณ',1,'en',1.0,'2025-05-20T17:09:10.544Z','2025-05-20T17:09:10.544Z',0,0);
INSERT INTO vocabulary VALUES(4,1,'please','กรุณา',1,'en',1.0,'2025-05-20T17:09:10.544Z','2025-05-20T17:09:10.544Z',0,0);
INSERT INTO vocabulary VALUES(5,1,'sorry','ขอโทษ',1,'en',1.0,'2025-05-20T17:09:10.544Z','2025-05-20T17:09:10.544Z',0,0);
INSERT INTO vocabulary VALUES(6,1,'excuse me','ขอโทษ',1,'en',1.0,'2025-05-20T17:09:10.544Z','2025-05-20T17:09:10.544Z',0,0);
INSERT INTO vocabulary VALUES(7,1,'good morning','สวัสดีตอนเช้า',1,'en',1.0,'2025-05-20T17:09:10.544Z','2025-05-20T17:09:10.544Z',0,0);
INSERT INTO vocabulary VALUES(8,1,'good evening','สวัสดีตอนเย็น',1,'en',1.0,'2025-05-20T17:09:10.544Z','2025-05-20T17:09:10.544Z',0,0);
INSERT INTO vocabulary VALUES(9,1,'mother','แม่',1,'en',1.0,'2025-05-20T17:09:10.544Z','2025-05-20T17:09:10.544Z',0,0);
INSERT INTO vocabulary VALUES(10,1,'father','พ่อ',1,'en',1.0,'2025-05-20T17:09:10.544Z','2025-05-20T17:09:10.544Z',0,0);
INSERT INTO vocabulary VALUES(11,1,'sister','พี่สาว/น้องสาว',1,'en',1.0,'2025-05-20T17:09:10.544Z','2025-05-20T17:09:10.544Z',0,0);
INSERT INTO vocabulary VALUES(12,1,'brother','พี่ชาย/น้องชาย',1,'en',1.0,'2025-05-20T17:09:10.544Z','2025-05-20T17:09:10.544Z',0,0);
INSERT INTO vocabulary VALUES(13,1,'son','ลูกชาย',1,'en',1.0,'2025-05-20T17:09:10.544Z','2025-05-20T17:09:10.544Z',0,0);
INSERT INTO vocabulary VALUES(14,1,'daughter','ลูกสาว',1,'en',1.0,'2025-05-20T17:09:10.544Z','2025-05-20T17:09:10.544Z',0,0);
INSERT INTO vocabulary VALUES(15,1,'grandfather','ปู่/ตา',1,'en',1.0,'2025-05-20T17:09:10.544Z','2025-05-20T17:09:10.544Z',0,0);
INSERT INTO vocabulary VALUES(16,1,'grandmother','ย่า/ยาย',1,'en',1.0,'2025-05-20T17:09:10.544Z','2025-05-20T17:09:10.544Z',0,0);
INSERT INTO vocabulary VALUES(17,1,'dog','สุนัข',1,'en',1.0,'2025-05-20T17:09:10.544Z','2025-05-20T17:09:10.544Z',0,0);
INSERT INTO vocabulary VALUES(18,1,'cat','แมว',1,'en',1.0,'2025-05-20T17:09:10.544Z','2025-05-20T17:09:10.544Z',0,0);
INSERT INTO vocabulary VALUES(19,1,'bird','นก',1,'en',1.0,'2025-05-20T17:09:10.544Z','2025-05-20T17:09:10.544Z',0,0);
INSERT INTO vocabulary VALUES(20,1,'fish','ปลา',1,'en',1.0,'2025-05-20T17:09:10.544Z','2025-05-20T17:09:10.544Z',0,0);
INSERT INTO vocabulary VALUES(21,1,'elephant','ช้าง',1,'en',1.0,'2025-05-20T17:09:10.544Z','2025-05-20T17:09:10.544Z',0,0);
INSERT INTO vocabulary VALUES(22,1,'tiger','เสือ',1,'en',1.0,'2025-05-20T17:09:10.544Z','2025-05-20T17:09:10.544Z',0,0);
INSERT INTO vocabulary VALUES(23,1,'monkey','ลิง',1,'en',1.0,'2025-05-20T17:09:10.544Z','2025-05-20T17:09:10.544Z',0,0);
INSERT INTO vocabulary VALUES(24,1,'snake','งู',1,'en',1.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(25,1,'rice','ข้าว',1,'en',1.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(26,1,'water','น้ำ',1,'en',1.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(27,1,'milk','นม',1,'en',1.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(28,1,'bread','ขนมปัง',1,'en',1.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(29,1,'apple','แอปเปิ้ล',1,'en',1.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(30,1,'banana','กล้วย',1,'en',1.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(31,1,'orange','ส้ม',1,'en',1.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(32,1,'egg','ไข่',1,'en',1.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(33,1,'red','สีแดง',1,'en',1.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(34,1,'blue','สีน้ำเงิน',1,'en',1.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(35,1,'green','สีเขียว',1,'en',1.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(36,1,'yellow','สีเหลือง',1,'en',1.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(37,1,'black','สีดำ',1,'en',1.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(38,1,'white','สีขาว',1,'en',1.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(39,1,'purple','สีม่วง',1,'en',1.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(40,1,'pink','สีชมพู',1,'en',1.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(41,1,'one','หนึ่ง',1,'en',1.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(42,1,'two','สอง',1,'en',1.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(43,1,'three','สาม',1,'en',1.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(44,1,'four','สี่',1,'en',1.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(1001,1,'analyze','วิเคราะห์',1,'en',2.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(1002,1,'balance','สมดุล, ความสมดุล',1,'en',2.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(1003,1,'calculate','คำนวณ',1,'en',2.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(1004,1,'demonstrate','สาธิต, แสดงให้เห็น',1,'en',2.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(1005,1,'evaluate','ประเมิน',1,'en',2.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(1006,1,'facilitate','อำนวยความสะดวก, ทำให้ง่ายขึ้น',1,'en',2.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(1007,1,'generate','สร้าง, ก่อให้เกิด',1,'en',2.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(1008,1,'hypothesize','ตั้งสมมติฐาน',1,'en',2.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(1009,1,'implement','นำไปปฏิบัติ, ดำเนินการ',1,'en',2.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(1010,1,'justify','ให้เหตุผล, อธิบาย',1,'en',2.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(1011,1,'knowledge','ความรู้',1,'en',2.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(1012,1,'leverage','ใช้ประโยชน์, คานงัด',1,'en',2.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(1013,1,'maintain','รักษา, คงไว้',1,'en',2.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(1014,1,'navigate','นำทาง, เดินเรือ',1,'en',2.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(1015,1,'observe','สังเกต',1,'en',2.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(1016,1,'perceive','รับรู้, เข้าใจ',1,'en',2.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(1017,1,'quantify','วัดปริมาณ, กำหนดจำนวน',1,'en',2.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(1018,1,'research','วิจัย, ค้นคว้า',1,'en',2.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(1019,1,'synthesize','สังเคราะห์',1,'en',2.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(1020,1,'transform','เปลี่ยนแปลง, แปรรูป',1,'en',2.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(1021,1,'understand','เข้าใจ',1,'en',2.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(1022,1,'validate','ตรวจสอบความถูกต้อง, ยืนยัน',1,'en',2.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(1023,1,'wonder','สงสัย, ประหลาดใจ',1,'en',2.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(1024,1,'xeriscape','การจัดสวนที่ใช้น้ำน้อย',1,'en',2.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(1025,1,'yield','ผลผลิต, ยอมแพ้',1,'en',2.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(1026,1,'zeal','ความกระตือรือร้น, ความมุ่งมั่น',1,'en',2.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(1027,1,'adapt','ปรับตัว',1,'en',2.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(1028,1,'benefit','ประโยชน์, ผลประโยชน์',1,'en',2.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(1029,1,'collaborate','ร่วมมือ',1,'en',2.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(1030,1,'develop','พัฒนา',1,'en',2.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(1031,1,'enhance','เพิ่ม, ปรับปรุง',1,'en',2.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(1032,1,'focus','จุดโฟกัส, มุ่งเน้น',1,'en',2.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(1033,1,'guide','แนะนำ, นำทาง',1,'en',2.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(1034,1,'highlight','เน้น, ทำให้เด่น',1,'en',2.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(1035,1,'inspire','สร้างแรงบันดาลใจ',1,'en',2.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(1036,1,'journey','การเดินทาง',1,'en',2.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(1037,1,'key','กุญแจ, สำคัญ',1,'en',2.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(1038,1,'learn','เรียนรู้',1,'en',2.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(1039,1,'manage','จัดการ, บริหาร',1,'en',2.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(1040,1,'nurture','เลี้ยงดู, บ่มเพาะ',1,'en',2.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(1041,1,'organize','จัดระเบียบ, จัดการ',1,'en',2.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(1042,1,'prepare','เตรียม, เตรียมพร้อม',1,'en',2.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(1043,1,'quality','คุณภาพ',1,'en',2.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(1044,1,'reflect','สะท้อน, ไตร่ตรอง',1,'en',2.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(1045,1,'strategy','กลยุทธ์',1,'en',2.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(1046,1,'technique','เทคนิค',1,'en',2.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(1047,1,'utilize','ใช้ประโยชน์',1,'en',2.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(1048,1,'value','คุณค่า, มูลค่า',1,'en',2.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(1049,1,'work','งาน, ทำงาน',1,'en',2.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(1050,1,'xerox','ถ่ายเอกสาร',1,'en',2.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(2001,1,'ambiguous','คลุมเครือ, กำกวม',1,'en',3.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(2002,1,'benevolent','เมตตากรุณา, ใจดี',1,'en',3.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(2003,1,'cacophony','เสียงแหลมที่ไม่ไพเราะ',1,'en',3.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(2004,1,'diligent','ขยันขันแข็ง, มานะ',1,'en',3.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(2005,1,'eloquent','พูดจาคล่องแคล่ว, มีวาทศิลป์',1,'en',3.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(2006,1,'fastidious','พิถีพิถัน, เรื่องมาก',1,'en',3.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(2007,1,'gregarious','ชอบเข้าสังคม, ชอบอยู่เป็นกลุ่ม',1,'en',3.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(2008,1,'haphazard','ไม่เป็นระเบียบ, สะเปะสะปะ',1,'en',3.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(2009,1,'impetuous','หุนหันพลันแล่น, วู่วาม',1,'en',3.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(2010,1,'juxtapose','วางเคียงข้างกัน, เปรียบเทียบ',1,'en',3.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(2011,1,'kinetic','เกี่ยวกับการเคลื่อนไหว',1,'en',3.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(2012,1,'lethargic','เฉื่อยชา, เกียจคร้าน',1,'en',3.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(2013,1,'meticulous','พิถีพิถัน, ละเอียดรอบคอบ',1,'en',3.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(2014,1,'nefarious','ชั่วร้าย, เลวทราม',1,'en',3.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(2015,1,'oblivious','ไม่รู้ตัว, ไม่ใส่ใจ',1,'en',3.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(2016,1,'pernicious','เป็นอันตราย, ทำลายล้าง',1,'en',3.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(2017,1,'quintessential','เป็นแก่นแท้, เป็นตัวอย่างที่ดีที่สุด',1,'en',3.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(2018,1,'resilient','ยืดหยุ่น, ฟื้นตัวเร็ว',1,'en',3.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(2019,1,'surreptitious','ลับๆ, แอบๆ',1,'en',3.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(2020,1,'tenacious','ดื้อรั้น, ไม่ยอมแพ้',1,'en',3.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(2021,1,'ubiquitous','มีอยู่ทั่วไป, แพร่หลาย',1,'en',3.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(2022,1,'verbose','พูดมาก, เยิ่นเย้อ',1,'en',3.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(2023,1,'whimsical','แปลกประหลาด, ไม่แน่นอน',1,'en',3.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(2024,1,'xenophobia','ความกลัวหรือเกลียดชังคนต่างชาติ',1,'en',3.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(2025,1,'yielding','ยอมแพ้, อ่อนโยน',1,'en',3.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(2026,1,'zealous','กระตือรือร้น, มุ่งมั่น',1,'en',3.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(2027,1,'aberration','ความผิดปกติ, การเบี่ยงเบน',1,'en',3.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(2028,1,'brevity','ความสั้นกระชับ, ความรวบรัด',1,'en',3.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(2029,1,'cognizant','รู้, ตระหนัก',1,'en',3.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(2030,1,'deleterious','เป็นอันตราย, ทำลาย',1,'en',3.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(2031,1,'ephemeral','ชั่วคราว, ไม่ยั่งยืน',1,'en',3.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(2032,1,'facetious','ตลกขบขัน, ล้อเล่น',1,'en',3.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(2033,1,'garrulous','พูดมาก, ช่างคุย',1,'en',3.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(2034,1,'hedonistic','รักความสุข, หมกมุ่นในความสุข',1,'en',3.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(2035,1,'idiosyncrasy','ลักษณะเฉพาะตัว, ความแปลก',1,'en',3.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(2036,1,'judicious','มีวิจารณญาณ, รอบคอบ',1,'en',3.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(2037,1,'kaleidoscope','กล้องตาแมลงวัน, ความหลากหลาย',1,'en',3.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(2038,1,'labyrinthine','ซับซ้อน, วกวน',1,'en',3.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(2039,1,'mellifluous','ไพเราะ, นุ่มนวล',1,'en',3.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
INSERT INTO vocabulary VALUES(2040,1,'nuance','ความแตกต่างเล็กน้อย, ความละเอียดอ่อน',1,'en',3.0,'2025-05-20T17:09:10.545Z','2025-05-20T17:09:10.545Z',0,0);
CREATE TABLE challenges (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL,
    xp_reward INTEGER NOT NULL,
    requirement_count INTEGER NOT NULL,
    expires_at TEXT NOT NULL
);
INSERT INTO challenges VALUES(1,'Complete 3 Lessons','Complete 3 lessons today to earn bonus XP','lesson',30,3,'2025-05-21T17:00:00.000Z');
INSERT INTO challenges VALUES(2,'Perfect Score','Complete a lesson with no mistakes','perfect',20,1,'2025-05-21T17:00:00.000Z');
INSERT INTO challenges VALUES(3,'Vocabulary Master','Review 10 vocabulary words','vocabulary',25,10,'2025-05-21T17:00:00.000Z');
INSERT INTO challenges VALUES(4,'Earn 50 XP','Earn a total of 50 XP today','xp',15,50,'2025-05-21T17:00:00.000Z');
CREATE TABLE user_challenges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    challenge_id INTEGER NOT NULL,
    progress INTEGER NOT NULL DEFAULT 0,
    completed INTEGER NOT NULL DEFAULT 0,
    completed_at TEXT
);
CREATE TABLE lesson_completions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    lesson_id INTEGER NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0,
    completed_at TEXT NOT NULL,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    correct_answers INTEGER NOT NULL
);
CREATE TABLE missions (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL,
    requirements TEXT NOT NULL,
    xp_reward INTEGER NOT NULL,
    points_reward INTEGER NOT NULL,
    badge_id INTEGER,
    expires_at TEXT,
    mission_order INTEGER NOT NULL,
    category TEXT NOT NULL
);
INSERT INTO missions VALUES(1,'Daily Lesson','Complete 1 lesson today','daily','{"type":"lesson","count":1}',20,30,NULL,NULL,1,'daily');
INSERT INTO missions VALUES(2,'Vocabulary Builder','Learn 5 new vocabulary words','daily','{"type":"vocabulary","count":5}',15,25,NULL,NULL,2,'daily');
INSERT INTO missions VALUES(3,'Perfect Practice','Get 10 answers correct','daily','{"type":"correct_answers","count":10}',25,35,NULL,NULL,3,'daily');
INSERT INTO missions VALUES(4,'Weekly Warrior','Complete 5 lessons this week','weekly','{"type":"lesson","count":5}',50,75,NULL,NULL,1,'weekly');
INSERT INTO missions VALUES(5,'Vocabulary Expert','Learn 20 new vocabulary words this week','weekly','{"type":"vocabulary","count":20}',60,90,NULL,NULL,2,'weekly');
INSERT INTO missions VALUES(6,'Perfect Week','Maintain your streak for 7 days','weekly','{"type":"streak","count":7}',70,100,4,NULL,3,'weekly');
INSERT INTO missions VALUES(7,'Beginner''s Journey','Complete all beginner lessons','achievement','{"type":"beginner_lessons","count":3}',100,150,1,NULL,1,'achievement');
INSERT INTO missions VALUES(8,'Grammar Master','Complete all grammar lessons','achievement','{"type":"grammar_lessons","count":3}',150,200,6,NULL,2,'achievement');
INSERT INTO missions VALUES(9,'Vocabulary Champion','Learn 100 vocabulary words','achievement','{"type":"vocabulary_total","count":100}',200,300,7,NULL,3,'achievement');
INSERT INTO missions VALUES(10,'Language Mastery','Complete all lessons in a language','achievement','{"type":"language_complete","count":1}',500,1000,10,NULL,4,'achievement');
CREATE TABLE user_missions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    mission_id INTEGER NOT NULL,
    progress INTEGER NOT NULL DEFAULT 0,
    requirement_count INTEGER NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0,
    completed_at TEXT,
    claimed INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE badges (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    category TEXT NOT NULL,
    rarity TEXT NOT NULL
);
INSERT INTO badges VALUES(1,'First Steps','Complete your first lesson','Footprints','progress','common');
INSERT INTO badges VALUES(2,'Word Collector','Learn 10 vocabulary words','BookOpen','vocabulary','common');
INSERT INTO badges VALUES(3,'Perfect Score','Complete a lesson with 100% accuracy','Target','achievement','uncommon');
INSERT INTO badges VALUES(4,'Streak Master','Maintain a 7-day streak','Flame','streak','uncommon');
INSERT INTO badges VALUES(5,'Language Explorer','Try lessons in 3 different languages','Globe','exploration','rare');
INSERT INTO badges VALUES(6,'Grammar Guru','Master all grammar lessons','BookMarked','mastery','rare');
INSERT INTO badges VALUES(7,'Vocabulary Master','Learn 100 vocabulary words','Library','vocabulary','epic');
INSERT INTO badges VALUES(8,'Dedicated Learner','Complete 30 lessons','GraduationCap','progress','epic');
INSERT INTO badges VALUES(9,'Polyglot','Reach level 5 in 3 different languages','Languages','mastery','legendary');
INSERT INTO badges VALUES(10,'Language Champion','Complete all lessons in a language','Trophy','mastery','legendary');
CREATE TABLE user_badges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    badge_id INTEGER NOT NULL,
    earned_at TEXT NOT NULL,
    displayed INTEGER NOT NULL DEFAULT 1
);
INSERT INTO sqlite_sequence VALUES('vocabulary',2040);
COMMIT;
