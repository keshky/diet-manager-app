/* =============== DATA & TRANSLATIONS MODULE =============== */
'use strict';

export const DEF = {
 'بروتين':{'بياض بيض':300,'جبن قريش':200,'سمك سالمون':120,'سمك مكرونة':120,'سمك بلطي':120,'سمك سردين':120,'سمك بوري':120,'سمك فيليه':120,'جمبري':100,'كبدة':130,'تونة':100,'لحم صدور':120,'كبدة دجاج':120,'لحم أرانب':100,'لحم أحمر':120,'بيض كامل':250,'لحم وراك':100,'فيتا لايت':150,'فصوص رومي':120,'روست بيف':120},
 'كربوهيدرات':{'كورن فلكس':55,'مكرونة/شعيرية':65,'رز':60,'برغل':60,'فريك':60,'فينو':90,'خبز شامي':85,'خبز بلدي':100,'كيزر':90,'توست أبيض':90,'توست أسمر':90,'كوز ذرة مشوي':90,'بطاطس':260,'قلقاس':180,'بطاطا':260,'كينوا':60,'شوفان':60,'بقسماط':60,'بليلة':60,'ذرة (فشار)':65,'تورتيلا':80},
 'دهون صحية':{'لوز':20,'كاجو':20,'بندق':20,'فول سوداني':20,'بيكان':20,'فستق':20,'زيت زيتون (جم)':15,'زيتون أسود':15,'أفوكادو':60,'عين جمل':20,'زيت نباتي (جم)':15,'بذور كتان':20,'بذور شيا':20,'زبد طبيعي':15,'زبد صناعي':15,'زيت جوز هند (جم)':15},
 'فواكه':{'بطيخ':200,'تفاح':100,'كمثرى':100,'حرنكش':85,'يوسفي':100,'تين شوكي':100,'توت':85,'كاكا':65,'تين برشومي':85,'برتقال':100,'فراولة':200,'مانجا':100,'كيوي':100,'أناناس':100,'عنب':80,'برقوق':85,'جوافة':100,'شمام':200,'كانتلوب':200,'خوخ':100,'رمان':85,'مشمش':100,'بلح':20,'موز':60,'زبيب (مجفف)':20,'قراصيا (مجففة)':20,'تين (مجفف)':25,'مشمش (مجفف)':20},
 'خضروات':{'فلفل ألوان':50,'خس':100,'خيار':100,'كوسة':50,'بامية':50,'جرجير':100,'باذنجان':150,'فاصوليا خضراء':50,'جزر':50,'قرنبيط':100,'بنجر':50,'طماطم':100,'مشروم':100,'خرشوف':50,'بروكلي':50,'ملوخية':50,'سبانخ':100},
 'ألبان':{'لبن بودر':30,'لبن كامل الدسم':240,'زبادي كامل الدسم':240,'لبن خالي الدسم':240},
 'بقوليات':{'حمص':25,'عدس':30,'فاصوليا حمراء':30,'فاصوليا بيضاء':30,'لوبيا':30,'فول':30,'ترمس':50,'بسلة':30}
};

export const GN = {'بروتين':'Protein','كربوهيدرات':'Carbs','دهون صحية':'Healthy fats','فواكه':'Fruits','خضروات':'Vegetables','ألبان':'Dairy','بقوليات':'Legumes'};

export const FN = {'بياض بيض':'Egg whites','جبن قريش':'Cottage cheese','سمك سالمون':'Salmon','سمك مكرونة':'Makarona fish','سمك بلطي':'Tilapia','سمك سردين':'Sardines','سمك بوري':'Mullet','سمك فيليه':'Fish fillet','جمبري':'Shrimp','كبدة':'Beef liver','تونة':'Tuna','لحم صدور':'Chicken breast','كبدة دجاج':'Chicken liver','لحم أرانب':'Rabbit meat','لحم أحمر':'Red meat','بيض كامل':'Whole eggs','لحم وراك':'Chicken thighs','فيتا لايت':'Light feta','فصوص رومي':'Turkey cuts','روست بيف':'Roast beef',
'كورن فلكس':'Corn flakes','مكرونة/شعيرية':'Pasta/vermicelli','رز':'Rice','برغل':'Bulgur','فريك':'Freekeh','فينو':'Fino bread','خبز شامي':'Shami bread','خبز بلدي':'Baladi bread','كيزر':'Kaiser roll','توست أبيض':'White toast','توست أسمر':'Brown toast','كوز ذرة مشوي':'Grilled corn cob','بطاطس':'Potato','قلقاس':'Taro','بطاطا':'Sweet potato','كينوا':'Quinoa','شوفان':'Oats','بقسماط':'Rusks','بليلة':'Baleela (wheat)','ذرة (فشار)':'Popcorn kernels','تورتيلا':'Tortilla',
'لوز':'Almonds','كاجو':'Cashews','بندق':'Hazelnuts','فول سوداني':'Peanuts','بيكان':'Pecans','فستق':'Pistachios','زيت زيتون (جم)':'Olive oil (g)','زيتون أسود':'Black olives','أفوكادو':'Avocado','عين جمل':'Walnuts','زيت نباتي (جم)':'Vegetable oil (g)','بذور كتان':'Flaxseed','بذور شيا':'Chia seeds','زبد طبيعي':'Butter','زبد صناعي':'Margarine','زيت جوز هند (جم)':'Coconut oil (g)',
'بطيخ':'Watermelon','تفاح':'Apple','كمثرى':'Pear','حرنكش':'Harankash','يوسفي':'Mandarin','تين شوكي':'Prickly pear','توت':'Berries','كاكا':'Persimmon','تين برشومي':'Fresh figs','برتقال':'Orange','فراولة':'Strawberry','مانجا':'Mango','كيوي':'Kiwi','أناناس':'Pineapple','عنب':'Grapes','برقوق':'Plum','جوافة':'Guava','شمام':'Honeydew','كانتلوب':'Cantaloupe','خوخ':'Peach','رمان':'Pomegranate','مشمش':'Apricot','بلح':'Dates','موز':'Banana','زبيب (مجفف)':'Raisins','قراصيا (مجففة)':'Prunes','تين (مجفف)':'Dried figs','مشمش (مجفف)':'Dried apricot',
'فلفل ألوان':'Bell pepper','خس':'Lettuce','خيار':'Cucumber','كوسة':'Zucchini','بامية':'Okra','جرجير':'Arugula','باذنجان':'Eggplant','فاصوليا خضراء':'Green beans','جزر':'Carrot','قرنبيط':'Cauliflower','بنجر':'Beetroot','طماطم':'Tomato','مشروم':'Mushroom','خرشوف':'Artichoke','بروكلي':'Broccoli','ملوخية':'Molokhia','سبانخ':'Spinach',
'لبن بودر':'Milk powder','لبن كامل الدسم':'Whole milk','زبادي كامل الدسم':'Full-fat yogurt','لبن خالي الدسم':'Skim milk','حمص':'Chickpeas','عدس':'Lentils','فاصوليا حمراء':'Red beans','فاصوليا بيضاء':'White beans','لوبيا':'Black-eyed peas','فول':'Fava beans','ترمس':'Lupini','بسلة':'Peas'};

export const NS = `بياض بيض:52,11,0.7,0.2;جبن قريش:98,11,3.4,4.3;سمك سالمون:206,22,0,12;سمك مكرونة:105,23,0,1;سمك بلطي:128,26,0,2.7;سمك سردين:208,25,0,11;سمك بوري:150,24,0,5;سمك فيليه:95,20,0,1.5;جمبري:99,24,0.2,0.3;كبدة:175,27,4,5;تونة:116,26,0,1;لحم صدور:165,31,0,3.6;كبدة دجاج:167,24,0.9,6.5;لحم أرانب:173,33,0,3.5;لحم أحمر:217,26,0,12;بيض كامل:155,13,1.1,11;لحم وراك:209,26,0,11;فيتا لايت:150,14,3,9;فصوص رومي:135,29,0,1.5;روست بيف:130,22,1,4;`+
`كورن فلكس:357,7,84,0.4;مكرونة/شعيرية:357,12,73,1.5;رز:360,7,79,0.6;برغل:342,12,76,1.3;فريك:340,12,70,2;فينو:270,9,50,3;خبز شامي:275,9,56,1.2;خبز بلدي:250,8,50,1.5;كيزر:280,9,52,3;توست أبيض:265,9,49,3.2;توست أسمر:250,10,43,3.5;كوز ذرة مشوي:96,3.4,21,1.5;بطاطس:77,2,17,0.1;قلقاس:112,1.5,26,0.2;بطاطا:86,1.6,20,0.1;كينوا:368,14,64,6;شوفان:389,17,66,7;بقسماط:395,13,72,5;بليلة:340,13,71,2.5;ذرة (فشار):375,12,74,4;تورتيلا:310,8,52,8;`+
`لوز:579,21,22,50;كاجو:553,18,30,44;بندق:628,15,17,61;فول سوداني:567,26,16,49;بيكان:691,9,14,72;فستق:560,20,28,45;زيت زيتون (جم):884,0,0,100;زيتون أسود:115,0.8,6,11;أفوكادو:160,2,9,15;عين جمل:654,15,14,65;زيت نباتي (جم):884,0,0,100;بذور كتان:534,18,29,42;بذور شيا:486,17,42,31;زبد طبيعي:717,0.9,0.1,81;زبد صناعي:717,0.2,0.9,80;زيت جوز هند (جم):862,0,0,100;`+
`بطيخ:30,0.6,7.6,0.2;تفاح:52,0.3,14,0.2;كمثرى:57,0.4,15,0.1;حرنكش:50,1,12,0.3;يوسفي:53,0.8,13,0.3;تين شوكي:41,0.7,10,0.5;توت:43,1.4,10,0.4;كاكا:70,0.6,19,0.2;تين برشومي:74,0.8,19,0.3;برتقال:47,0.9,12,0.1;فراولة:200,0.7,7.7,0.3;مانجا:60,0.8,15,0.4;كيوي:61,1.1,15,0.5;أناناس:50,0.5,13,0.1;عنب:69,0.7,18,0.2;برقوق:46,0.7,11,0.3;جوافة:68,2.6,14,1;شمام:34,0.8,8,0.2;كانتلوب:34,0.8,8,0.2;خوخ:39,0.9,10,0.3;رمان:83,1.7,19,1.2;مشمش:48,1.4,11,0.4;بلح:282,2.5,75,0.4;موز:89,1.1,23,0.3;زبيب (مجفف):299,3,79,0.5;قراصيا (مجففة):240,2.2,64,0.4;تين (مجفف):249,3.3,64,0.9;مشمش (مجفف):241,3.4,63,0.5;`+
`فلفل ألوان:31,1,6,0.3;خس:15,1.4,2.9,0.2;خيار:15,0.7,3.6,0.1;كوسة:17,1.2,3.1,0.3;بامية:33,1.9,7.5,0.2;جرجير:25,2.6,3.7,0.7;باذنجان:25,1,6,0.2;فاصوليا خضراء:31,1.8,7,0.2;جزر:41,0.9,10,0.2;قرنبيط:25,1.9,5,0.3;بنجر:43,1.6,10,0.2;طماطم:18,0.9,3.9,0.2;مشروم:22,3.1,3.3,0.3;خرشوف:47,3.3,11,0.2;بروكلي:34,2.8,7,0.4;ملوخية:34,4.6,5.8,0.4;سبانخ:23,2.9,3.6,0.4;`+
`لبن بودر:496,26,38,27;لبن كامل الدسم:61,3.2,4.8,3.3;زبادي كامل الدسم:61,3.5,4.7,3.3;لبن خالي الدسم:34,3.4,5,0.1;حمص:364,19,61,6;عدس:353,26,60,1.1;فاصوليا حمراء:337,23,61,0.8;فاصوليا بيضاء:333,23,60,0.9;لوبيا:336,24,60,1.3;فول:341,26,58,1.5;ترمس:119,16,10,3;بسلة:341,25,60,1.2`;

export const NUT = {};
NS.split(';').forEach(s => {
  const i = s.lastIndexOf(':');
  if (i !== -1) {
    const a = s.slice(i + 1).split(',').map(Number);
    NUT[s.slice(0, i)] = { k: a[0], p: a[1], c: a[2], f: a[3] };
  }
});

export const THEMES = {
  dc: 'Diet & Cheat Max',
  cyber: 'Dark Cyberpunk',
  gold: 'Fitness Gold',
  light: 'Modern Light',
  emerald: 'Emerald Health',
  ocean: 'Ocean Blue',
  crimson: 'Crimson Power',
  slate: 'Minimal Slate'
};

export const TR = { en: {}, ar: {} };
`app|Diet Planner & Exchange|مخطط الدايت والبدائل
user|Username|اسم المستخدم
pass|Password|كلمة المرور
logout|Log out|تسجيل الخروج
login|Sign in|تسجيل الدخول
create|Create account|إنشاء حساب جديد
enter|Sign in|دخول
mk|Create account|إنشاء الحساب
localnote|Data is stored on this device only, inside the browser.|البيانات محفوظة على هذا الجهاز فقط داخل المتصفح.
badcred|Wrong username or password.|اسم المستخدم أو كلمة المرور غير صحيحة.
minc|Enter a username and a password of at least 4 characters.|أدخل اسم مستخدم وكلمة مرور من 4 أحرف على الأقل.
n_ex|Exchange|البدائل
n_tdee|Needs|الاحتياجات
n_plan|Plans|الخطط
n_log|Daily|اليومي
n_prog|Progress|التقدم
n_shop|Grocery|المشتريات
n_set|Settings|الإعدادات
ex_h|Food exchange calculator|حاسبة البدائل
group|Group|المجموعة
orig|Original food|الصنف الأصلي
qplan|Quantity in plan (g)|الكمية في النظام (جم)
exnote|Required = plan quantity × substitute standard weight ÷ original standard weight. Carbs, fruit and legumes are weighed raw; protein is weighed cooked.|الكمية المطلوبة = الكمية في النظام × وزن البديل القياسي ÷ وزن الصنف الأصلي القياسي. الكربوهيدرات والفواكه والبقوليات تُوزن قبل الطهي، والبروتين بعد الطهي.
subst|Substitute|البديل
amt|Amount (g)|الكمية (جم)
tdee_h|Energy needs calculator|حاسبة الاحتياجات
age|Age|العمر
weight|Weight (kg)|الوزن (كجم)
height|Height (cm)|الطول (سم)
sex|Sex|الجنس
male|Male|ذكر
female|Female|أنثى
bfp|Body fat % (optional)|نسبة الدهون % (اختياري)
bfp0|Body fat %|نسبة الدهون %
act|Activity|النشاط
a1|Sedentary|قليل الحركة
a2|Light (1-3 days)|خفيف (1-3 أيام)
a3|Moderate (3-5 days)|متوسط (3-5 أيام)
a4|High (6-7 days)|عالٍ (6-7 أيام)
goal|Goal|الهدف
cut|Cut (-500)|تنشيف (-500)
keep|Maintain|ثبات
bulk|Bulk (+300)|تضخيم (+300)
calc|Calculate|احسب
tnote|With body fat %, BMR uses Katch-McArdle (lean mass); otherwise Mifflin-St Jeor.|عند إدخال نسبة الدهون يُحسب BMR بمعادلة Katch-McArdle (على الكتلة الخالية)، وإلا بمعادلة Mifflin-St Jeor.
tcal|Target calories|سعرات الهدف
prot|Protein|بروتين
carb|Carbs|كربوهيدرات
fat|Fat|دهون
kcal|Calories|السعرات
fm|Fat mass|كتلة الدهون
lm|Lean mass|الكتلة الخالية
formula|Formula|المعادلة
prof_h|My saved profile|ملفي المحفوظ
profnote|Enter ready results (from a report or coach), or calculate above, then adjust and save. Saved to the current account only.|أدخل نتائجك الجاهزة (من تقرير أو مدرب)، أو احسبها بالأعلى ثم عدّلها واحفظها. تُحفظ على حسابك الحالي فقط.
pf_save|Save to my profile|حفظ في ملفي
pf_del|Delete profile|حذف الملف
pf_err|Enter at least height, weight and target calories.|أدخل على الأقل الطول والوزن وسعرات الهدف.
pf_none|No saved profile yet.|لا يوجد ملف محفوظ بعد.
pf_conf|Delete your saved profile?|حذف ملفك المحفوظ؟
pf_sum|My saved summary|ملخصي المحفوظ
yrs|Age (years)|العمر (سنة)
healthy|Healthy weight (kg)|الوزن الصحي (كجم)
gap|Gap between target and maintenance|الفرق بين الهدف والصيانة
bmi_u|Underweight|نحافة
bmi_n|Normal|وزن طبيعي
bmi_o|Overweight|زيادة وزن
bmi_b|Obese|سمنة
bfl|Body fat|نسبة الدهون
plan|Plan|الخطة
firstplan|My first plan|خطتي الأولى
newplan|New plan|خطة جديدة
delplan|Delete plan|حذف الخطة
print|Print / PDF|طباعة / PDF
pname|Plan name|اسم الخطة
addmeal|+ Add meal|+ إضافة وجبة
meal|Meal|وجبة
mname|Meal name|اسم الوجبة
delmeal|Delete meal|حذف الوجبة
swap|Swap|بدّل
add|+ Add|+ إضافة
food|Food|الصنف
grams|Grams|جرام
g|g|جم
nomeals|No meals yet. Press “Add meal” to start.|لا توجد وجبات بعد. اضغط «إضافة وجبة» للبدء.
manual|Enter macros manually|إدخال الماكروز يدويًا
nodata|No nutrition data for this food. Add it under Settings → Custom foods.|لا توجد بيانات غذائية لهذا الصنف. أضفه من الإعدادات ← أصناف مخصصة.
onlyplan|You can't delete the only plan.|لا يمكن حذف الخطة الوحيدة.
confdelplan|Delete this plan permanently?|حذف هذه الخطة نهائياً؟
cfg|Custom foods|أصناف مخصصة
log_h|Daily log|السجل اليومي
today|Today|اليوم
assign|Assigned plan|الخطة المخصصة
noplan|No plan assigned to this day.|لا توجد خطة مخصصة لهذا اليوم.
thisdate|This date|هذا التاريخ
every|Every %s|كل %s
clear|Clear|إزالة
water|Water|الماء
glasses|glasses|أكواب
consumed|Consumed vs target|المستهلك مقابل الهدف
notarget|Save a profile under “Needs” to compare with your target.|احفظ ملفك في «الاحتياجات» للمقارنة بالهدف.
checkall|Check all|تحديد الكل
planned|Planned|المخطط
prog_h|Progress tracker|متابعة التقدم
date|Date|التاريخ
waist|Waist (cm)|الخصر (سم)
bfshort|Body fat %|الدهون %
addentry|Add entry|إضافة قياس
metric|Chart|الرسم البياني
need1|Enter at least one measurement.|أدخل قياسًا واحدًا على الأقل.
nochart|Add at least two entries to see a trend.|أضف قياسين على الأقل لعرض الاتجاه.
start|Start|البداية
latest|Latest|الأحدث
change|Change|التغير
history|History|السجل
shop_h|Grocery list|قائمة المشتريات
scope|Source|المصدر
wk|This week (calendar)|هذا الأسبوع (التقويم)
days|Days|عدد الأيام
produce|Produce|خضار وفواكه
proteins|Proteins|بروتينات
dairy|Dairy|ألبان
pantry|Pantry|المخزن
clearchk|Uncheck all|إلغاء التحديد
emptyshop|Nothing to list. Add foods to a plan first.|لا شيء لعرضه. أضف أصنافًا إلى خطة أولًا.
lang|Language|اللغة
theme|Theme|الثيم
account|Account|الحساب
newuser|New username|اسم مستخدم جديد
newpass|New password|كلمة مرور جديدة
save|Save|حفظ
saved|Saved.|تم الحفظ.
wgoal|Daily water goal (glasses)|هدف الماء اليومي (أكواب)
wml|Glass size (ml)|حجم الكوب (مل)
cf_h|Custom foods (per 100 g)|أصناف مخصصة (لكل 100 جم)
cat|Category|الفئة
fname|Food name|اسم الصنف
wts_h|Standard exchange weights (g)|أوزان البدائل القياسية (جم)
resetw|Reset weights|استرجاع الأوزان
confresetw|Reset all weights to defaults?|استرجاع كل الأوزان للقيم الأصلية؟
bk_h|Backup & data|النسخ الاحتياطي والبيانات
export|Download backup|تنزيل نسخة احتياطية
share|Share / Save to Files|مشاركة / حفظ في الملفات
import|Restore from backup file|استعادة من ملف نسخة احتياطية
bk_note|Includes plans, profile, weights, custom foods, daily logs, water and progress history.|تشمل الخطط والملف والأوزان والأصناف المخصصة والسجلات اليومية والماء وسجل التقدم.
imp_ok|Backup restored.|تمت استعادة النسخة الاحتياطية.
imp_bad|Invalid backup file.|ملف النسخة الاحتياطية غير صالح.
imp_conf|Replace current data with this backup?|استبدال البيانات الحالية بهذه النسخة؟
bk_ok|Backup file created.|تم إنشاء ملف النسخة الاحتياطية.`
.split('\n').forEach(l => {
  const [k, e, a] = l.split('|');
  if (k) { TR.en[k] = e; TR.ar[k] = a; }
});