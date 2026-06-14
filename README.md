# TripsApp
מערכת ניהול והזמנת טיולים - Trips App 🌍

מערכת מתקדמת לניהול, סינון והזמנת טיולים שנבנתה באמצעות פלטפורמת Angular (בארכיטקטורת Standalone Components המודרנית) ומנוהלת מול שרת נתונים מקומי מסוג JSON-Server.

הפרויקט מציע חוויית משתמש עשירה הכוללת שני ממשקים מרכזיים: ממשק לקוח (חיפוש, סינון והזמנת טיולים) וממשק ניהול (Admin) מלא המאפשר הוספה, עריכה ומחיקה של טיולים בזמן אמת.

📂 מבנה התיקיות והקבצים בפרויקט

האפליקציה מאורגנת בצורה מודולרית המפרידה בין תצוגה (Pages/Components), לוגיקה עסקית וסטייט (Services) וכלי עזר (Shared):

src/app/
├── app.routes.ts               # ניהול מערך הניווט והראוטינג של האפליקציה
├── app.config.ts               # הגדרות קונפיגורציה גלובליות ו-Providers
├── app.component.ts            # קומפוננטת השורש (Root Component)
├── app.component.html          # המבנה הכללי ותשתית ה-Router Outlet
├── app.component.css           # עיצובים וסגנונות ברמת האפליקציה
│
├── components/                 # רכיבי UI רב-פעמיים (Dumb/Presentational Components)
│   ├── header/                 # סרגל הניווט העליון המציג את סטטוס המשתמש
│   │   ├── header.ts | header.html | header.css
│   ├── filter-bar/             # רכיב חיפוש וסינון מתקדם לטיולים
│   │   ├── filter-bar.ts | filter-bar.html | filter-bar.css
│   ├── trip-card/              # כרטיס תצוגה ייעודי לטיול בודד
│   │   ├── trip-card.ts | trip-card.html | trip-card.css
│   ├── trip-form/              # טופס דינמי המשמש הן להוספה והן לעריכת טיול
│   │   ├── trip-form.ts | trip-form.html | trip-form.css
│   └── confirm-dialog/         # מודאל (דיאלוג) אישור גנרי לפני ביצוע פעולות הרסניות
│       └── confirm-dialog.ts | confirm-dialog.html | confirm-dialog.css
│
├── pages/                      # דפי האפליקציה המלאים (Smart Components / Views)
│   ├── auth/                   # מסכי אימות וזיהוי משתמשים
│   │   ├── login/              # מסך התחברות למערכת
│   │   │   ├── login.ts | login.html | login.css
│   │   └── register/           # מסך הרשמת משתמש חדש
│   │       ├── register.ts | register.html | register.css
│   ├── home/                   # דף הבית המרכזי של האפליקציה
│   │   └── home.ts | home.html | home.css
│   ├── trips/                  # מרכז ניהול ותצוגת הטיולים
│   │   ├── trips-all/          # דף הטיולים הראשי הכולל סינונים וממשק מנהל
│   │   │   ├── trips-all.ts | trips-all.html | trips-all.css
│   │   ├── my-trips/           # אזור אישי המציג את הטיולים שהוזמנו ע"י המשתמש
│   │   │   ├── my-trips.ts | my-trips.html | my-trips.css
│   │   └── trip-details/       # דף מידע מורחב עבור טיול ספציפי
│   │       └── trip-details.ts | trip-details.html | trip-details.css
│   └── not-found/              # דף שגיאה 404 מותאם אישית עבור נתיבים שאינם קיימים
│       └── not-found.ts | not-found.html | not-found.css
│
├── services/                   # שכבת הלוגיקה והתקשורת מול ה-API (JSON Server)
│   ├── auth.ts         # ניהול משתמשים, התחברות, הרשמה ובדיקת הרשאות
│   ├── trips.ts                # ניהול נתוני הטיולים (קריאה, הוספה, עריכה ומחיקה)
│   ├── bookings.ts     # ניהול מערך הזמנות הטיולים של המשתמשים
│   └── users.ts        # שירות עזר לניהול משתמשים ורשומות בבסיס הנתונים
│
├── models/                     # ממשקים (Interfaces) המגדירים את טיפוסי הנתונים
│   ├── trip.model.ts           # מודל הנתונים של טיול (Trip)
│   ├── booking.model.ts        # מודל הנתונים של הזמנה (Booking)
│   └── user.model.ts           # מודל הנתונים של משתמש ומנהל (User)
│
└


⚙️ Services ותפקידם במערכת

האפליקציה נשענת על שכבת סרוויסים חזקה שמזריקה שירותים בעזרת מנגנון ה-Dependency Injection של אנגולר, ומבודדת את קומפוננטות ה-UI מחשיפה ישירה לפרוטוקול ה-HTTP:

AuthService (src/app/services/auth.service.ts)

תפקיד: אחראי על ניהול מחזור החיים של המשתמש המחובר באפליקציה. הוא מבצע קריאות אימות מול הקצה /users, שומר ומעדכן את המשתמש הנוכחי בתוך סיגנל ייעודי, ומספק פונקציונליות של התנתקות מהמערכת.

TripService (src/app/services/trips.ts)

תפקיד: מנהל את כל רשומות הטיולים הזמינים במערכת. הוא אחראי על משיכת הנתונים בטעינת האפליקציה מנתיב ה-API /trips, וכן על שליחת בקשות POST, PUT ו-DELETE בהתאמה כאשר מנהל המערכת מבצע שינויים.

BookingsService (src/app/services/bookings.service.ts)

תפקיד: אחראי על ביצוע ומעקב אחר הזמנות טיולים. הוא מקשר בין מזהה המשתמש (userId) למזהה הטיול (tripId) ומנהל את המידע מול נקודת הקצה /bookings.

UsersService (src/app/services/users.service.ts)

תפקיד: מספק פונקציות עזר לשאילתות משתמשים, בדיקת קיום משתמשים קיימים במערכת ותמיכה בתהליך ה-Registration.

🔐 זרימת תהליך ההתחברות (Login Flow)

תהליך האימות וההתחברות מתבצע בצורה מאובטחת ומסונכרנת בין ממשק המשתמש לשכבת השירות:

[LoginComponent (UI)] ──(onSubmit)──> [AuthService] ──(HTTP GET /users)──> [JSON-Server]
                                           │
   💡 עדכון currentUser הסיגנלי <──────────┘ (אימות הצליח)


הזנת נתונים: המשתמש מזין את פרטי הגישה שלו (דוא"ל וסיסמה) בטופס האימות הממוקם בקומפוננטה LoginComponent בנתיב src/app/pages/auth/login/login.ts.

שליחת הטופס: בעת לחיצה על כפתור השליחה, מופעלת המתודה onSubmit() בתוך קובץ ה-TypeScript של הקומפוננטה, המבצעת בדיקת תקינות ראשונית לערכי הטופס.

קריאה לשירות: פונקציית onSubmit() קוראת למתודה login(email, password) השייכת ל-AuthService (src/app/services/auth.service.ts).

אימות מול השרת: ה-AuthService מבצע קריאת HttpClient.get אל השרת בכתובת http://localhost:3000/users?email=... ובודק האם נמצא משתמש תואם והאם הסיסמה נכונה.

עדכון הסטייט והניווט: אם הפרטים נכונים, ה-AuthService מעדכן את ה-Signal הפנימי currentUser עם נתוני המשתמש (כולל דגל isAdmin), וה-Router מנווט באופן אוטומטי את המשתמש לדף הטיולים הראשי (/trips/all).

🧳 זרימת תהליך הזמנת טיול (Booking Flow)

תהליך רכישה והזמנת טיול מתבצע מתוך עמוד הפרטים ומקשר ישירות בין הסטייט של המשתמש לנתוני הטיול:

כניסה לפרטים: המשתמש בוחר טיול מתוך רשימת הטיולים ב-TripsAll ונחשף למידע המלא בקומפוננטה TripDetails (src/app/pages/trips/trip-details/trip-details.ts).

הפעלת פעולה: לחיצה על כפתור "הזמן טיול עכשיו" מפעילה את המתודה המקומית bookTrip().

בדיקת שלב מוקדם: המתודה בודקת דרך ה-AuthService האם קיים משתמש מחובר במערכת באמצעות הסיגנל authService.currentUser(). במידה ולא, היא מנווטת את המשתמש למ מסך ה-Login.

יצירת רשומת הזמנה: במידה והמשתמש מחובר, מופעלת המתודה createBooking(bookingData) מתוך BookingsService (src/app/services/bookings.service.ts), אשר בונה אובייקט הזמנה המכיל: id ייחודי, userId, tripId ואת תאריך ביצוע הפעולה.

שמירה בשרת ועדכון UI: השירות שולח בקשת POST לכתובת /bookings. עם קבלת תשובה חיובית מהשרת, מוצגת הודעת הצלחה למשתמש והוא מועבר ישירות לדף הטיולים שלי (src/app/pages/trips/my-trips/my-trips.ts) כדי לצפות בסיכום ההזמנות שלו.

📊 ניהול סטייט גלובלי (State Management) באמצעות Angular Signals

הפרויקט עושה שימוש בטכנולוגיית Angular Signals המודרנית לצורך ניהול מצב גלובלי ומקומי יעיל, ריאקטיבי וללא צורך במערכות כבדות חיצוניות כמו NgRx:

סטייט משתמש מחובר (Global Auth State): מנוהל בתוך AuthService באמצעות המשתנה:

currentUser = signal<User | null>(null);


כל קומפוננטה באפליקציה (כמו ה-Header למשל) שמזריקה את השירות, יכולה להאזין לסיגנל זה ב-HTML בצורה ריאקטיבית: auth.currentUser().

סטייט הטיולים הגלובלי (Global Trips State): מנוהל בתוך TripService באמצעות הסיגנל:

trips = signal<Trip[]>([]);


הפונקציה loadAllTrips() מעדכנת סיגנל זה פעם אחת עם קבלת הנתונים מהשרת, וכל שינוי (הוספה/מחיקה) מעדכן את הסיגנל ישירות, דבר הגורם לשינוי מיידי בכל ה-UI של האפליקציה ללא צורך בריענון דף.

סטייט מחושב בזמן אמת (Computed State): בקומפוננטה TripsAll (src/app/pages/trips/trips-all/trips-all.ts), אנו משתמשים ב-computed כדי לייצר רשימת טיולים מסוננת מבלי לשנות את הסטייט המקורי:

filteredTrips = computed(() => {
  const term = this.searchDestination().toLowerCase();
  return this.tripsService.trips().filter(t => 
    t.destination.toLowerCase().includes(term)
  );
});


🏛️ חלוקת אחריות והפרדת דאגות (Separation of Concerns)

הפרויקט מקפיד על חלוקת עבודה ברורה בין רכיבי התצוגה לרכיבי הלוגיקה והנתונים:

1. השירותים (Services) - המוח הלוגי

אחראים באופן בלעדי על ביצוע תקשורת אסינכרונית מול ה-API (HttpClient).

מנהלים את מצב האפליקציה (Global State) באמצעות Signals.

מכילים לוגיקה עסקית מורכבת שאינה קשורה ישירות לדרך שבה האלמנט מוצג על המסך.

2. הקומפוננטות (Components) - שכבת התצוגה והאינטראקציה

Smart Components (Pages): קומפוננטות כגון TripsAll מנהלות את הלוגיקה של העמוד, מזריקות שירותים, מחזיקות סיגנלים של מצבי תצוגה מקומיים (showForm, showConfirm) ומקשרות בין המידע שמגיע מהסרוויס לרכיבי המשנה.

Dumb Components (Presentational): קומפוננטות כגון TripCard ו-ConfirmDialog אינן מודעות לקיומם של סרוויסים או של שרת חיצוני. הן מקבלות נתונים באופן פסיבי דרך מנגנון ה-input() ומדווחות על אירועים והקלקות של המשתמש החוצה אל הקומפוננטה האם באמצעות מנגנון ה-output().

🔗 מפתח הפניות לקוד המערכת בפועל

להלן מיפוי מדויק של הנתיבים, הקומפוננטות והפונקציות המרכזיות המרכיבות את הלוגיקה של האפליקציה:

נתיב קובץ במערכת

שם הקומפוננטה / הסרוויס

פונקציה מרכזית

תיאור תפקידה בקוד

src/app/services/auth.service.ts

AuthService

login(email, pass)

מבצעת אימות מול /users ומעדכנת את currentUser

src/app/services/auth.service.ts

AuthService

logout()

מאפסת את סיגנל המשתמש ומנתקת אותו מהמערכת

src/app/services/trips.ts

TripService

loadTrips()

מושכת את כל רשומות הטיולים מהשרת אל תוך הסטייט

src/app/services/bookings.service.ts

BookingsService

bookTrip(data)

שולחת בקשת POST ליצירת הזמנת טיול חדשה בשרת

src/app/pages/auth/login/login.ts

LoginComponent

onSubmit()

קולטת את נתוני הטופס ומעבירה אותם לסרוויס האימות

src/app/pages/trips/trips-all/trips-all.ts

TripsAll

filteredTrips

סיגנל מחושב (computed) המבצע סינון טיולים דינמי

src/app/pages/trips/trips-all/trips-all.ts

TripsAll

openForm(trip?)

פותחת את מודאל ההוספה/עריכה ומעדכנת את הטיול הנבחר

src/app/pages/trips/trips-all/trips-all.ts

TripsAll

confirmDelete()

מבצעת אישור סופי למחיקת טיול מהמערכת מול הסרוויס

src/app/components/trip-card/trip-card.ts

TripCard

trip = input()

מקבלת נתוני טיול יחיד ומציגה אותו ככרטיס מעוצב

src/app/components/trip-form/trip-form.ts

TripForm

save = output()

משגרת את נתוני הטופס המעודכנים לקומפוננטת האם לשמירה

src/app/components/confirm-dialog/confirm-dialog.ts

ConfirmDialog

confirm = output()

מייצרת אירוע המאשר את ביצוע הפעולה לאחר לחיצה
