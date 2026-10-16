# كيف اصمم جدولين للمستخدم والمنشورات واربط بينهم بحيث اتمكن من طلب المستخدم مع منشوراته باستخدام mongodb

## لتصميم جدولين (مجموعتين Collection) للمستخدمين والمنشورات في MongoDB والربط بينهما، هناك طريقتان رئيسيتان. الطريقة الأكثر كفاءة وشيوعاً للمنشورات هي الإشارة (Referencing) عبر تخزين مُعرّف المستخدم (userId) داخل مستند المنشور.
إليك كيفية تصميم المجموعتين وكيفية كتابة الاستعلام لجلب المستخدم مع منشوراته معاً.

1. تصميم المجموعات (Schema Design)


مجموعة المستخدمين (users)

مستند المستخدم يحتوي على بياناته الأساسية فقط:
```json
{
  "_id": ObjectId("60c72b2f9b1d8b2bad765111"),
  "name": "أحمد علي",
  "email": "ahmed@example.com"
}
```
Use code with caution.

مجموعة المنشورات (posts)

كل منشور يحتوي على بياناته الخاصة، بالإضافة إلى حقل userId الذي يربطه بالمستخدم الذي كتبه:
```json
{
  "_id": ObjectId("60c72b2f9b1d8b2bad765222"),
  "title": "تعلم MongoDB بسهولة",
  "content": "هذا المنشور يشرح كيفية ربط الجداول...",
  "userId": ObjectId("60c72b2f9b1d8b2bad765111")
}
```
Use code with caution.

2. استعلام جلب المستخدم مع منشوراته (Aggregation Lookup)

لطلب بيانات مستخدم معين وجلب جميع المنشورات التابعة له في نفس الوقت، نستخدم مرحلة $lookup داخل إطار التجميع (Aggregation Framework).
إليك كود الاستعلام:
```javascript
db.users.aggregate([
  // 1. تحديد المستخدم المطلوب بناءً على الـ ID الخاص به
  {
    $match: {
      "_id": ObjectId("60c72b2f9b1d8b2bad765111")
    }
  },
  // 2. الربط مع مجموعة المنشورات
  {
    $lookup: {
      from: "posts",            // اسم مجموعة المنشورات المراد الربط معها
      localField: "_id",        // الحقل في مجموعة المستخدمين (المفتاح الأساسي)
      foreignField: "userId",   // الحقل في مجموعة المنشورات (المفتاح الأجنبي)
      as: "userPosts"           // الاسم الجديد للمصفوفة التي ستحتوي على المنشورات
    }
  }
])
```
Use code with caution.

النتيجة المتوقعة (Output)

ستحصل على كائن مستخدم يحتوي على مصفوفة بداخلها كل منشوراته:
```json
[
  {
    "_id": ObjectId("60c72b2f9b1d8b2bad765111"),
    "name": "أحمد علي",
    "email": "ahmed@example.com",
    "userPosts": [
      {
        "_id": ObjectId("60c72b2f9b1d8b2bad765222"),
        "title": "تعلم MongoDB بسهولة",
        "content": "هذا المنشور يشرح كيفية ربط الجداول...",
        "userId": ObjectId("60c72b2f9b1d8b2bad765111")
      }
    ]
  }
]
```
Use code with caution.

💡 نصيحة للأداء (Performance Tip)

لضمان سرعة الاستعلام عند نمو البيانات، تأكد من إنشاء فهرس (Index) على حقل userId في مجموعة المنشورات عبر تشغيل هذا الأمر:
```javascript
db.posts.createIndex({ userId: 1 })
```
Use code with caution.
هل تستخدم بيئة عمل معينة مثل Node.js مع Mongoose وتريد معرفة كيفية تطبيقها برمجياً، أم تفضل استكشاف طريقة تضمين البيانات (Embedding) كبديل؟

# بما أنك تستخدم Node.js، فإن الطريقة الأسهل والأكثر احترافية للتعامل مع MongoDB والربط بين المجموعات هي استخدام مكتبة Mongoose.

توفر Mongoose ميزة رائعة تُسمى populate، وهي تُغنيك عن كتابة استعلامات التجميع (Aggregation) المعقدة، وتقوم بجلب المستخدم ومنشوراته بخطوة واحدة بسيطة.
إليك التطبيق العملي خطوة بخطوة:

1. تعريف المخططات (Models & Schemas)

قم بإنشاء ملفات المخططات للمستخدم والمنشور، ولاحظ كيف نقوم بالإشارة (Reference) إلى المستخدم داخل مخطط المنشور.

مخطط المستخدم (User.js)

```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('User', userSchema);
```
Use code with caution.

مخطط المنشور (Post.js)

هنا نضع حقل userId ونربطه بمخطط الـ User:
```javascript
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  // الربط هنا: نقوم بتحديد النوع كـ ObjectId والإشارة إلى موديل User
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
});

// إضافة Index لتحسين أداء البحث عن المنشورات بواسطة ID المستخدم
postSchema.index({ userId: 1 });

module.exports = mongoose.model('Post', postSchema);
```
Use code with caution.

2. الاستعلام لجلب المستخدم مع منشوراته (الـ Controller)

هناك طريقتان لجلب البيانات بناءً على الطريقة التي تفضلها في تصميم تطبيقك:

الطريقة الأولى: جلب المنشورات ودمجها داخل كائن المستخدم (باستخدام $lookup في Mongoose)

إذا كنت تريد أن تظهر المنشورات كمصفوفة داخل كائن المستخدم تماماً كما في قواعد البيانات العادية:
```javascript
const User = require('./models/User');
const mongoose = require('mongoose');

const getUserWithPosts = async (req, res) => {
  try {
    const userId = req.params.id;

    const userData = await User.aggregate([
      { 
        $match: { _id: new mongoose.Types.ObjectId(userId) } 
      },
      {
        $lookup: {
          from: 'posts',          // اسم المجموعة في قاعدة البيانات (غالباً يكون جمع وصغير الحروف)
          localField: '_id',
          foreignField: 'userId',
          as: 'myPosts'           // اسم الحقل الجديد الذي ستوضع فيه المنشورات
        }
      }
    ]);

    if (!userData || userData.length === 0) {
      return res.status(404).json({ message: "المستخدم غير موجود" });
    }

    res.json(userData[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```
Use code with caution.

الطريقة الثانية: الاستعلام العادي والـ Populate العكسي (الأبسط والأكثر استخداماً)

إذا كنت لا تمانع جلب المنشورات بشكل منفصل أو عمل استعلام للمنشورات مباشرة مع جلب بيانات صاحبها:
```javascript
const Post = require('./models/Post');
const User = require('./models/User');

const getUserPostsSimple = async (req, res) => {
  try {
    const userId = req.params.id;

    // 1. جلب بيانات المستخدم
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "المستخدم غير موجود" });

    // 2. جلب جميع منشورات هذا المستخدم
    const posts = await Post.find({ userId: userId });

    // 3. دمجهم في استجابة واحدة
    res.json({
      user,
      posts
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```
Use code with caution.
هل تريد معرفة كيفية إضافة منشور جديد وربطه بـ الـ ID الخاص بالمستخدم الحالي تلقائياً (مثلاً من الـ Auth Middleware)، أم تحتاج مساعدة في إعداد اتصال قاعدة البيانات نفسه؟

# ممتاز! إليك الطريقة العملية لإضافة منشور جديد وربطه بالمستخدم الحالي، مع كود جاهز لإعداد اتصال قاعدة البيانات بـ MongoDB باستخدام Node.js و Mongoose.

1. إعداد اتصال قاعدة البيانات (db.js)

يفضل دائماً فصل كود الاتصال بقاعدة البيانات في ملف مستقل ليكون مشروعك منظماً.
```javascript
// db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // استبدل برابط قاعدة البيانات الخاصة بك (محلي أو على MongoDB Atlas)
    const dbURI = 'mongodb://localhost:27017/myBlogDB'; 
    
    await mongoose.connect(dbURI);
    console.log('✅ تم الاتصال بقاعدة بيانات MongoDB بنجاح');
  } catch (error) {
    console.error('❌ فشل الاتصال بقاعدة البيانات:', error.message);
    process.exit(1); // إغلاق التطبيق في حال فشل الاتصال
  }
};

module.exports = connectDB;
```
Use code with caution.

2. إضافة منشور جديد وربطه بالمستخدم (PostController.js)

عندما يقوم المستخدم بكتابة منشور، نأخذ الـ _id الخاص به (والذي نصل إليه غالباً من كود التحقق من الهوية أو الـ Auth Middleware ونخزنه في req.user) ونربطه بالمنشور الجديد كالتالي:
```javascript
// controllers/postController.js
const Post = require('../models/Post');
const User = require('../models/User');

const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    
    // فرضية: الـ ID الخاص بالمستخدم يأتي من الـ Middleware بعد تسجيل الدخول
    // إذا لم يكن لديك Middleware حالياً، يمكنك تمريره مؤقتاً في body للتجربة: const { userId } = req.body;
    const userId = req.user._id; 

    // 1. التحقق من أن المستخدم موجود بالفعل في قاعدة البيانات
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "المستخدم غير موجود، لا يمكن إضافة المنشور" });
    }

    // 2. إنشاء مستند المنشور الجديد وربطه بالـ userId
    const newPost = new Post({
      title,
      content,
      userId: userId // هنا يتم الربط
    });

    // 3. حفظ المنشور في قاعدة البيانات
    const savedPost = await newPost.save();

    res.status(201).json({
      message: "تم نشر المقال بنجاح",
      post: savedPost
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createPost };
```
Use code with caution.

3. تجميع كل شيء في الملف الرئيسي (server.js)

إليك كيف تبدو الصورة كاملة عند تشغيل خادم Express والاتصال بقاعدة البيانات:
```javascript
// server.js
const express = require('express');
const connectDB = require('./db');
const { createPost } = require('./controllers/postController');

const app = express();

// Middleware لتحليل بيانات JSON القادمة في الطلبات
app.use(express.json());

// الاتصال بقاعدة البيانات
connectDB();

// تجربة مسار إضافة منشور 
// (ملاحظة: تأكد من تمرير req.user عبر Auth Middleware، أو تعديل الكود لتجربته مؤقتاً عبر req.body)
app.post('/api/posts', createPost);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 الخادم يعمل على المنفذ http://localhost:${PORT}`);
});
```
Use code with caution.
هل قمت ببناء الـ Auth Middleware (مثل JWT) لتأمين الحسابات واستخراج بيانات المستخدم الحالي، أم ترغب في مساعدة لإنشائه حتى يكتمل نظام الربط لديك بشكل آمن؟

# حسنا لدي جدل للمنتجات واخر للحركات وكل حركة مرتبطة بمنتج كيف اجهز تابع لجلب الحركات وداخل كل حركة معلومات المنتج الخاصة به وكيف انفذ تابع لإضافة حركة ولكن مع التحقق في حالة السحب إذا كانت الكمية متاحة أو لا وإذا كانت متاحة يتم تحديث الجدولين وإذا حدث جول وحدث خطأ قبل إكمال الآخر يتم الغاء العمليتين

لتحقيق هذا النظام بدقة، سنستخدم ميزتين أساسيتين في Mongoose:
1. populate(): لجلب الحركات وداخلها بيانات المنتج الخاص بها.
2. Transactions (المعاملات): لضمان أنه إذا تم تحديث جدول الحركات وفشل تحديث جدول المنتجات (أو العكس)، يتم التراجع عن العمليتين تلقائياً (Atomicity).
إليك التطبيق العملي الكامل:

1. مخطط المنتجات والحركات (Schemas)


مخطط المنتج (Product.js)

```javascript
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true, default: 0 } // الكمية المتاحة في المخزن
});

module.exports = mongoose.model('Product', productSchema);
```
Use code with caution.

مخطط الحركة (Movement.js)

```javascript
const mongoose = require('mongoose');

const movementSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  type: { type: String, enum: ['إيداع', 'سحب'], required: true },
  quantity: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Movement', movementSchema);
```
Use code with caution.

2. تابع جلب الحركات مع معلومات المنتج (populate)

هذا التابع يقوم بجلب كل الحركات، ويستبدل الـ productId بكامل كائن المنتج المرتبط به.
```javascript
const Movement = require('./models/Movement');

const getMovementsWithProducts = async (req, res) => {
  try {
    // جلب الحركات وعمل populate لبيانات المنتج المربوط بها
    const movements = await Movement.find().populate('productId');
    
    res.status(200).json(movements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```
Use code with caution.


3. تابع إضافة حركة مع التحقق واستخدام الـ Transaction

ملاحظة مهمة: ميزة المعاملات (Transactions) في MongoDB تتطلب أن تكون قاعدة البيانات تعمل بنظام Replica Set (وهو النظام الافتراضي إذا كنت تستخدم MongoDB Atlas).
إليك التابع الذي يتحقق من الكمية، ويحدث الجدولين، ويلغي العمليات في حال حدوث أي خطأ:
```javascript
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Movement = require('./models/Movement');

const createMovement = async (req, res) => {
  const { productId, type, quantity } = req.body;

  // 1. بدء جلسة عمل (Session) للمعاملة
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 2. جلب المنتج مع تمرير الجلسة الحالية لضمان قفل المستند أثناء العملية
    const product = await Product.findById(productId).session(session);
    if (!product) {
      throw new Error("المنتج غير موجود");
    }

    // 3. التحقق في حالة "السحب" إذا كانت الكمية كافية
    if (type === 'سحب') {
      if (product.quantity < quantity) {
        throw new Error("الكمية المطلوبة غير متاحة في المخزن");
      }
      // خصم الكمية
      product.quantity -= quantity;
    } else if (type === 'إيداع') {
      // إضافة الكمية
      product.quantity += quantity;
    } else {
      throw new Error("نوع الحركة غير صحيح، يجب أن يكون 'سحب' أو 'إيداع'");
    }

    // 4. حفظ تحديث المنتج داخل الجلسة
    await product.save({ session });

    // 5. تسجيل الحركة الجديدة داخل الجلسة
    const newMovement = new Movement({
      productId,
      type,
      quantity
    });
    await newMovement.save({ session });

    // 6. إذا نجحت كل الخطوات، قم بتثبيت المعاملة (Commit) لحفظ التغييرات نهائياً
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ message: "تمت العملية وتحديث المخزن بنجاح" });

  } catch (error) {
    // 7. في حال حدوث أي خطأ (فشل حفظ، كمية غير كافية، إلخ..) يتم إلغاء العمليتين فوراً والتراجع عن التغييرات
    await session.abortTransaction();
    session.endSession();

    res.status(400).json({ error: error.message });
  }
};
```
Use code with caution.

كيف يضمن هذا الكود حماية بياناتك؟

- session.startTransaction(): تخبر قاعدة البيانات أن أي عمليات قادمة مرتبطة بهذه الجلسة هي عمليات مؤقتة.
- { session }: نمررها لكل أمر (findById, save) لتعرف قاعدة البيانات أنها تتبع لنفس المعاملة.
- session.abortTransaction(): بمجرد إطلاق خطأ (throw new Error) في أي مرحلة، يتم التراجع عن كل ما حدث منذ بدء الجلسة وكأن شيئاً لم يكن.


# هل من الأفضل استخدام تابع ال find() ثم نستخدم .limit().skip() وباقي توابع الفلترة او تمريرها داخل تابع ال find()

سؤالك جوهري وممتاز جداً ويتعلق بأداء قاعدة البيانات وجاهزيتها للإنتاج (Production).
الإجابة المباشرة: لا، لا يجب أبداً جلب البيانات كاملة ثم فلترتها أو ترتيبها عبر كود Node.js (JavaScript). يجب دائماً تطبيق الفلاتر، الترتيب، والـ Pagination داخل استعلام قاعدة البيانات (MongoDB) قبل أن تصل البيانات إلى خادم Node.js.
إذا قمت باستدعاء ()Movement.find بدون فلاتر داخلية، فإن MongoDB سيقوم بقراءة كل المستندات من القرص وتحميلها في الذاكرة (RAM) وإرسالها عبر الشبكة إلى Node.js، وهو ما سيؤدي إلى انهيار الخادم (Crash) أو بطء شديد بمجرد أن يصبح لديك آلاف الحركات.

الطريقة الصحيحة (سلسلة التوابع في Mongoose)

لحسن الحظ، في Mongoose عندما تكتب:
```javascript
Movement.find({ type: 'سحب' }).sort({ date: -1 }).limit(10)...
```
Use code with caution.

فإن Mongoose لا ينفذ الاستعلام فوراً عند كلمة ()find. هو يقوم ببناء الاستعلام برمجياً (Query Builder)، وعندما تنتهي السلسلة وتستدعي await، يقوم بإرسال أمر واحد مدمج إلى MongoDB. بناءً عليه، تعيد لك قاعدة البيانات الـ 10 الحركات المطلوبة فقط.
إليك النموذج المثالي لكتابة التابع مع دمج الفلترة، الترتيب، الـ Pagination، والـ Populate داخل قاعدة البيانات:
```javascript
const getMovementsAdvanced = async (req, res) => {
  try {
    // 1. استخراج الفلاتر والـ Pagination من الرابط (Query Params)
    // مثال: /movements?type=سحب&page=2&limit=10
    const { type, page = 1, limit = 10 } = req.query;

    // تحويل الأرقام للتأكد من صحتها
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skipNum = (pageNum - 1) * limitNum;

    // 2. بناء كائن الفلترة (Query Object)
    const queryFilter = {};
    if (type) {
      queryFilter.type = type; // الفلترة حسب النوع إذا تم تمريره
    }

    // 3. تنفيذ الاستعلام المدمج بالكامل داخل MongoDB
    const movements = await Movement.find(queryFilter)
      .populate('productId')       // الربط: جلب بيانات المنتج المحددة فقط
      .sort({ date: -1 })          // الترتيب: من الأحدث إلى الأقدم
      .skip(skipNum)               // الباجينيشن: تخطي العناصر السابقة
      .limit(limitNum);            // الباجينيشن: تحديد عدد العناصر المسترجعة

    // 4. جلب العدد الإجمالي للحركات (مفيد جداً للفرونت إند لحساب عدد الصفحات)
    const totalMovements = await Movement.countDocuments(queryFilter);

    res.status(200).json({
      metadata: {
        totalItems: totalMovements,
        totalPages: Math.ceil(totalMovements / limitNum),
        currentPage: pageNum,
        pageSize: limitNum
      },
      data: movements
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```
Use code with caution.

المقارنة السريعة لبيان الفرق في الأداء:


| الميزة | الفلترة داخل الـ Query (MongoDB) | الفلترة والترتيب في Node.js بعد الـ find |
| :--- | :--- | :--- |
| **استهلاك الذاكرة (RAM)** | منخفض جداً (يتم تحميل فقط الـ 10 عناصر المطلوبة). | مرتفع جداً (يتم تحميل مليون مستند في الذاكرة لفرزهم). |
| **سرعة الشبكة** | سريع جداً (حجم البيانات المنتقلة بضعة كيلوبايت). | بطيء جداً (يتم نقل ميجابايت أو جيجابايت من البيانات دون داعٍ). |
| **استخدام الفهارس (Indexes)** | نعم، يستفيد MongoDB من الفهارس المجهزة لتسريع الفرز. | لا، تفقد الفهارس قيمتها لأن الفرز يتم برمجياً في الـ RAM. |

هل ترغب في معرفة كيفية اختيار حقول معينة فقط من جدول المنتجات أثناء عمل الـ populate (مثل جلب اسم المنتج فقط دون السعر أو الكمية) لتقليل حجم البيانات المسترجعة بشكل أكبر؟


# عند عملية الدمج populate كيف يكون شكل المستند

عند تطبيق ميزة الـ populate، يقوم Mongoose باستبدال حقل المعرّف (productId) الذي كان يحتوي على مجرد نص (ID)، بـ كائن (Object) كامل يحتوي على كافة تفاصيل المنتج القادمة من مجموعة المنتجات (products).
بناءً على الكود الذي كتبناه في الخطوة السابقة، إليك الشكل الدقيق للمستند الذي سيرجع لك في مصفوفة البيانات (data):

شكل المستند بعد الـ populate

```json
{
  "_id": "664c1b2f9b1d8b2bad765999",
  "type": "سحب",
  "quantity": 5,
  "date": "2026-10-16T07:30:00.000Z",
  "productId": {
    "_id": "664c1b2f9b1d8b2bad765111",
    "name": "شاشة هاتف ذكي AMOLED",
    "quantity": 45,
    "__v": 0
  },
  "__v": 0
}
```
Use code with caution.

💡 تخصيش الحقول المسترجعة (تحسين إضافي للأداء)

إذا كنت لا تحتاج لكامل بيانات المنتج (مثل رغبتك في جلب الاسم فقط دون بقية التفاصيل كالكمية مثلاً لتوفير استهلاك البيانات)، يمكنك تمرير الحقول المطلوبة كمعامل ثانٍ داخل تابع الـ populate كالتالي:
```javascript
.populate('productId', 'name') // سيجلب فقط الـ id واسم المنتج
```
Use code with caution.
شكل المستند في هذه الحالة سيكون مختصراً ومثالياً:
```json
{
  "_id": "664c1b2f9b1d8b2bad765999",
  "type": "سحب",
  "quantity": 5,
  "date": "2026-10-16T07:30:00.000Z",
  "productId": {
    "_id": "664c1b2f9b1d8b2bad765111",
    "name": "شاشة هاتف ذكي AMOLED"
  },
  "__v": 0
}
```
Use code with caution.
هل تحتاج إلى مساعدة في كيفية التعامل مع هذه البيانات في الفرونت إند (Front-end) وعرض اسم المنتج داخل الجدول، أم أن كل شيء واضح بالنسبة لك الآن؟


# كيف يمكنني تعديل اسم الحقل بدل productId يرجع product


الطريقة الأولى: استخدام الماب البرمجي (map) - الأسهل والأكثر مرونة

نقوم بعمل حلقة تحويل (Loop) خفيفة على المصفوفة الناتجة من الاستعلام، لتغيير الحقل وإرجاع كائن جديد بالاسم المفضل لديك:
```javascript
const getMovementsAdvanced = async (req, res) => {
  try {
    const { type, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skipNum = (pageNum - 1) * limitNum;

    const queryFilter = {};
    if (type) queryFilter.type = type;

    // 1. جلب البيانات من الموديل كـ JavaScript Objects عادية باستخدام .lean() لتحسين الأداء
    const movements = await Movement.find(queryFilter)
      .populate('productId') // يبقى كود الـ populate كما هو متوافق مع المخزن
      .sort({ date: -1 })
      .skip(skipNum)
      .limit(limitNum)
      .lean(); // تحول مستندات Mongoose إلى كائنات JS عادية لتعديلها بحرية

    // 2. إعادة تشكيل البيانات وتغيير المفتاح للفرونت إند
    const formattedMovements = movements.map(movement => {
      const { productId, ...rest } = movement; // فصل حقل productId عن باقي المستند
      return {
        ...rest,
        product: productId // إعادة تسمية الحقل إلى product فقط في الاستجابة المرسلة
      };
    });

    const totalMovements = await Movement.countDocuments(queryFilter);

    res.status(200).json({
      metadata: {
        totalItems: totalMovements,
        totalPages: Math.ceil(totalMovements / limitNum),
        currentPage: pageNum,
        pageSize: limitNum
      },
      data: formattedMovements // إرسال البيانات المنسقة الجديدة
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```
Use code with caution.

الطريقة الثانية: استخدام إطار التجميع (Aggregation Framework) - خيار بديل

إذا كنت تفضل أن تقوم قاعدة البيانات MongoDB نفسها بتغيير الاسم وإعادة المستند بالصيغة المطلوبة مباشرة دون تدخل من خادم Node.js، يمكنك استخدام $lookup مع إخفاء المعرف القديم عبر مرحلة $project:
```javascript
const movements = await Movement.aggregate([
  { $match: queryFilter },
  {
    $lookup: {
      from: 'products',          // اسم مجموعة المنتجات في قاعدة البيانات
      localField: 'productId',
      foreignField: '_id',
      as: 'product'              // تسمية الحقل مباشرة بـ product
    }
  },
  { $unwind: '$product' },       // تحويل مصفوفة المنتج إلى كائن واحد
  { 
    $project: { 
      productId: 0 // إخفاء الحقل القديم من النتيجة النهائية تماماً
    } 
  }
]);
```
Use code with caution.

شكل الاستجابة (Output) للفرونت إند في الطريقتين:

ستصل البيانات للفرونت إند بالصيغة المثالية التي طلبتها مع الحفاظ التام على بنية قاعدة البيانات:
```json
{
  "_id": "664c1b2f9b1d8b2bad765999",
  "type": "سحب",
  "quantity": 5,
  "date": "2026-10-16T07:30:00.000Z",
  "product": {
    "_id": "664c1b2f9b1d8b2bad765111",
    "name": "شاشة هاتف ذكي AMOLED",
    "quantity": 45
  }
}
```
Use code with caution.
هل تفضل اعتماد الطريقة الأولى (lean & map) لمرونتها وسهولة قراءتها في الكود، أم تريد دمج حقول إضافية وتخصيص الاستجابة بشكل أكبر؟


# تمام الطريقة الثانية ألا تستهلك موارد أقل ؟

سؤالك ذكي جداً وفي محله. الإجابة المختصرة هي: نعم ولا، الأمر يعتمد على حجم البيانات والفهارس (Indexes).
في معظم الحالات العملية والتطبيقات الواقعية، الطريقة الأولى (lean + map) هي التي تستهلك موارد أقل وتكون أسرع، بينما الطريقة الثانية (Aggregation) قد تستهلك موارد أعلى في قاعدة البيانات إذا لم يتم التعامل معها بحذر.
إليك المقارنة العلمية الدقيقة لسبب تفوق الطريقة الأولى في الأداء والموارد:

1. لماذا الطريقة الأولى (find + populate + lean) موفرة جداً؟

• الميزة السرية لـ .lean(): عندما تطلب البيانات من Mongoose، فإنه يقوم تلقائياً بتحويل كل مستند إلى كائن ثقيل جداً (Mongoose Document) يحتوي على توابع داخلية مثل $save و isModified. إضافة .lean() تخبر Mongoose أن يعيد كائنات JavaScript خام وصغيرة الحجم (Plain JSON)، مما يقلل استهلاك الذاكرة (RAM) في Node.js بنسبة تصل إلى 70%.
• الـ map البرمجي خفيف جداً: عملية الـ map تتم في الـ RAM الخاصة بخادم Node.js على 10 عناصر فقط (بسبب الـ Pagination). تعديل اسم المفتاح لـ 10 عناصر يستغرق أجزاء ضئيلة جداً من الميكروثانية ولا يمثل أي عبء يُذكر على المعالج (CPU).

2. لماذا الطريقة الثانية (Aggregation) قد تستهلك موارد أكثر؟

• عبء الحسابات على قاعدة البيانات: مرحلة الـ $unwind والـ $project تجبر معالج قاعدة البيانات (MongoDB CPU) على إعادة تشكيل المستندات وتفكيك المصفوفات في الذاكرة المؤقتة لقاعدة البيانات قبل إرسالها.
• قاعدة عامة في تطوير البرمجيات: دائماً اجعل قاعدة البيانات تركز فقط على (البحث، الفلترة، وجلب البيانات باستخدام الفهارس)، واترك أي عمليات تجميلية وتعديل صيغ للنصوص (Formatting) لمعالج خادم التطبيق (Node.js CPU)، لأن الأخير يسهل عمل توسيع أفقياً له (Horizontal Scaling) مقارنة بقاعدة البيانات.

جدول المقارنة لتسهيل الاختيار:


| وجه المقارنة | الطريقة الأولى (find + lean + map) ✅ | الطريقة الثانية (Aggregation) |
| :--- | :--- | :--- |
| **استهلاك CPU قاعدة البيانات** | منخفض جداً (استعلام مباشر وسريع). | أعلى (بسبب معالجة المستندات داخلياً). |
| **استهلاك ذاكرة Node.js** | منخفض جداً (بفضل ميزة .lean()). | منخفض (لأن البيانات تصل جاهزة). |
| **السرعة مع الـ Pagination** | سريعة للغاية (تتعامل مع صفحات صغيرة). | سريعة (لكنها تتطلب كتابة كود معقد للـ Pagination داخل الـ Aggregate). |

الخلاصة والتوصية:

استمر في استخدام الطريقة الأولى مع .lean()، فهي تمنحك أفضل أداء ممكن (Performance) واستهلاكاً شبه معدوم للموارد، بالإضافة إلى أن كود Mongoose يظل بسيطاً ومقروءاً مقارنة بمراحل الـ Aggregation المعقدة.
هل تود أن ننتقل الآن إلى كود تحديث أو حذف الحركات ومناقشة كيف يمكن حماية المخزن من التلاعب بالكميات عند التعديل، أم أن عملية الجلب والإضافة أصبحت واضحة تماماً؟


# تمام هلا بالفرونت عم استخدم React كيف بدي صمم مكون لعرض جدول بيدعم الباجينيشن والفترة لاربطه مع تابع جلب الحركات

تصميم مكون جدول في React يدعم الـ Pagination (الصفحات) والفلاتر (مثل الفرز حسب نوع الحركة) هو الخطوة المثالية لربط الفرونت إند مع التابع الخلفي الذي قمنا ببنائه.
سنستخدم React Hooks لإدارة حالة الفلاتر والصفحات، ومكتبة Axios (أو fetch) لجلب البيانات من الخادم في كل مرة تتغير فيها الصفحة أو الفلتر.
إليك الكود الكامل والمبسط للمكون:

كود مكون الجدول في React (MovementsTable.jsx)

```jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MovementsTable = () => {
  // 1. حالات إدارة البيانات والفلاتر والصفحات
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState(''); // '' تعني الكل، أو 'سحب' أو 'إيداع'
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // عدد العناصر في كل صفحة

  // 2. تابع جلب البيانات من الـ API
  const fetchMovements = async () => {
    setLoading(true);
    try {
      // بناء الرابط مع الـ Query Params بناءً على الحالة الحالية
      const response = await axios.get(`http://localhost:3000/api/movements`, {
        params: {
          type: typeFilter || undefined, // إذا كان فارغاً لن يرسله ليعيد الكل
          page: currentPage,
          limit: limit
        }
      });

      // استقبال البيانات وتحديث الحالة
      setMovements(response.data.data);
      setTotalPages(response.data.metadata.totalPages);
    } catch (error) {
      console.error("خطأ في جلب البيانات:", error);
    } finally {
      setLoading(false);
    }
  };

  // 3. إعادة جلب البيانات تلقائياً في كل مرة تتغير فيها الصفحة أو الفلتر
  useEffect(() => {
    fetchMovements();
  }, [currentPage, typeFilter]);

  // 4. معالج تغيير الفلتر (يعيد الصفحة تلقائياً إلى 1 لمنع الأخطاء)
  const handleFilterChange = (e) => {
    setTypeFilter(e.target.value);
    setCurrentPage(1); 
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', direction: 'rtl' }}>
      <h2>سجل حركات المخزن</h2>

      {/* قسم الفلترة */}
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="type-filter" style={{ marginLeft: '10px' }}>تصفية حسب النوع:</label>
        <select 
          id="type-filter" 
          value={typeFilter} 
          onChange={handleFilterChange}
          style={{ padding: '5px 10px', borderRadius: '4px' }}
        >
          <option value="">الكل</option>
          <option value="سحب">سحب</option>
          <option value="إيداع">إيداع</option>
        </select>
      </div>

      {/* جدول البيانات */}
      {loading ? (
        <p>جاري تحميل البيانات...</p>
      ) : (
        <>
          <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th>رقم الحركة</th>
                <th>نوع الحركة</th>
                <th>الكمية</th>
                <th>اسم المنتج المربوط</th>
                <th>التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {movements.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>لا توجد حركات متطابقة مع البحث</td>
                </tr>
              ) : (
                movements.map((movement) => (
                  <tr key={movement._id}>
                    <td>{movement._id}</td>
                    <td style={{ color: movement.type === 'سحب' ? 'red' : 'green', fontWeight: 'bold' }}>
                      {movement.type}
                    </td>
                    <td>{movement.quantity}</td>
                    {/* هنا نصل للاسم المنسق المفرود مباشرة بفضل الـ map من السيرفر */}
                    <td>{movement.product ? movement.product.name : 'منتج غير معروف'}</td>
                    <td>{new Date(movement.date).toLocaleString('ar-EG')}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* أزرار الانتقال بين الصفحات (Pagination) */}
          <div style={{ marginTop: '20px', display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'center' }}>
            <button 
              disabled={currentPage === 1} 
              onClick={() => setCurrentPage(prev => prev - 1)}
              style={{ padding: '5px 15px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
            >
              السابق
            </button>
            
            <span>صفحة {currentPage} من {totalPages}</span>
            
            <button 
              disabled={currentPage === totalPages} 
              onClick={() => setCurrentPage(prev => prev + 1)}
              style={{ padding: '5px 15px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
            >
              التالي
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MovementsTable;
```
Use code with caution.

💡 نقاط قوة هذا المكون وكيف يتكامل مع الـ Backend:

1. الوصول المباشر (movement.product.name): نظراً لأننا قمنا بتغيير الحقل برمجياً في الـ API إلى product بدلاً من productId وعملنا له populate، يستطيع الفرونت إند قراءة الاسم فوراً ككائن متناسق.
2. عدم تحميل البيانات دفعة واحدة: المكون يطلب 10 عناصر فقط في كل ضغطة زر أو تغيير فلتر، مما يجعل استجابة واجهة المستخدم سريعة وخفيفة جداً.
3. التاريخ المحسن: يتم تحويل صيغة تاريخ الـ ISO القادمة من قاعدة البيانات إلى صيغة محلية مفهومة للمستخدم عبر ()toLocaleString.
هل تستخدم مكتبة تنسيق معينة في مشروع React الخاص بك (مثل Tailwind CSS أو Material UI) وتريد تحسين مظهر الجدول بها، أم تفضل معرفة كيفية إضافة نموذج (Form) لإرسال حركة جديدة من واجهة المستخدم؟


# شغلة أخيرة بدي اعمل فلترة حسب اسم المنتج كيف بدي نفذها بالفرونت والباك وعم استخدم ال fetch لجلب البيانات

لتنفيذ الفلترة حسب اسم المنتج، سنقوم بتمرير نص البحث (كـ Query Parameter) من الفرونت إند باستخدام fetch، وفي الباك إند سنقوم بالبحث في مجموعة المنتجات أولاً لجلب المعرفات (_id) للمنتجات التي تطابق هذا الاسم، ثم نستخدمها لفلترة الحركات.
إليك التعديل الكامل للباك إند والفرونت إند:

أولاً: التعديل في الباك إند (Node.js)

بما أن اسم المنتج مخزن في مجموعة products وليس في مجموعة movements مباشرة، الطريقة المثالية هي استخدام تعبير منتظم (Regex) للبحث عن المنتجات التي تحتوي على النص المطلوب، ثم تمرير مصفوفة الـ IDs الخاصة بها إلى استعلام الحركات.
قم بتحديث تابع جلب البيانات كالتالي:
```javascript
// controllers/movementController.js
const Movement = require('../models/Movement');
const Product = require('../models/Product');

const getMovementsAdvanced = async (req, res) => {
  try {
    // 1. استقبال الـ productName الجديد من الرابط بالإضافة للفلاتر السابقة
    const { type, productName, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skipNum = (pageNum - 1) * limitNum;

    const queryFilter = {};

    // فلترة حسب نوع الحركة (سحب / إيداع)
    if (type) queryFilter.type = type;

    // 2. الفلترة السحرية حسب اسم المنتج
    if (productName) {
      // البحث عن جميع المنتجات التي يطابق اسمها نص البحث (i تعني تجاهل حالة الأحرف إذا كانت بالإنجليزية)
      const matchedProducts = await Product.find({
        name: { $regex: productName, $options: 'i' }
      }).select('_id'); // جلب الـ _id فقط لتوفير الموارد

      // تحويل مصفوفة المنتجات إلى مصفوفة تحتوي على الـ IDs فقط
      const productIds = matchedProducts.map(p => p._id);

      // إضافة شرط للاستعلام: يجب أن يكون حقل productId داخل مصفوفة المنتجات المطابقة
      queryFilter.productId = { $in: productIds };
    }

    // 3. جلب البيانات باستخدام .lean()
    const movements = await Movement.find(queryFilter)
      .populate('productId')
      .sort({ date: -1 })
      .skip(skipNum)
      .limit(limitNum)
      .lean();

    // 4. إعادة تشكيل اسم الحقل للفرونت إند من productId إلى product
    const formattedMovements = movements.map(movement => {
      const { productId, ...rest } = movement;
      return {
        ...rest,
        product: productId
      };
    });

    const totalMovements = await Movement.countDocuments(queryFilter);

    res.status(200).json({
      metadata: {
        totalItems: totalMovements,
        totalPages: Math.ceil(totalMovements / limitNum),
        currentPage: pageNum,
        pageSize: limitNum
      },
      data: formattedMovements
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```
Use code with caution.

ثانياً: التعديل في الفرونت إند (React باستخدام fetch)

سنضيف حقل إدخال نصي (Input) للبحث باسم المنتج، ونقوم بتعديل دالة الجلب لتستخدم fetch بدلاً من Axios وبناء الرابط برمجياً باستخدام URLSearchParams.
```jsx
import React, { useState, useEffect } from 'react';

const MovementsTable = () => {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');
  const [searchProduct, setSearchProduct] = useState(''); // حالة نص البحث عن المنتج
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  // تابع جلب البيانات باستخدام fetch
  const fetchMovements = async () => {
    setLoading(true);
    try {
      // 1. بناء الـ Query Parameters برمجياً بطريقة متوافقة مع fetch
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: limit,
      });
      
      if (typeFilter) queryParams.append('type', typeFilter);
      if (searchProduct) queryParams.append('productName', searchProduct); // إرسال نص البحث للباك إند

      // 2. إرسال الطلب عبر fetch
      const response = await fetch(`http://localhost:3000/api/movements?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('فشل في جلب البيانات من السيرفر');
      }

      const result = await response.json();

      // 3. تحديث الـ States
      setMovements(result.data);
      setTotalPages(result.metadata.totalPages);
    } catch (error) {
      console.error("خطأ أثناء جلب الحركات:", error);
    } finally {
      setLoading(false);
    }
  };

  // إعادة الجلب عند تغير الصفحة، الفلتر، أو نص البحث
  useEffect(() => {
    fetchMovements();
  }, [currentPage, typeFilter, searchProduct]);

  // تصغير إعادة تعيين الصفحة عند الفلترة لتجنب أخطاء الباجينيشن
  const handleTypeChange = (e) => {
    setTypeFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchProduct(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', direction: 'rtl' }}>
      <h2>سجل حركات المخزن</h2>

      {/* قسم الفلاتر والبحث */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '20px', alignItems: 'center' }}>
        {/* فلتر النوع */}
        <div>
          <label style={{ marginLeft: '8px' }}>تصفية حسب النوع:</label>
          <select value={typeFilter} onChange={handleTypeChange} style={{ padding: '6px', borderRadius: '4px' }}>
            <option value="">الكل</option>
            <option value="سحب">سحب</option>
            <option value="إيداع">إيداع</option>
          </select>
        </div>

        {/* حقل البحث عن اسم المنتج */}
        <div>
          <label style={{ marginLeft: '8px' }}>بحث باسم المنتج:</label>
          <input 
            type="text" 
            placeholder="اكتب اسم المنتج..." 
            value={searchProduct} 
            onChange={handleSearchChange} 
            style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc', width: '200px' }}
          />
        </div>
      </div>

      {/* الجدول والباجينيشن */}
      {loading ? (
        <p>جاري تحميل البيانات...</p>
      ) : (
        <>
          <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th>رقم الحركة</th>
                <th>نوع الحركة</th>
                <th>الكمية</th>
                <th>اسم المنتج</th>
                <th>التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {movements.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>لا توجد نتائج مطابقة لبحثك</td>
                </tr>
              ) : (
                movements.map((movement) => (
                  <tr key={movement._id}>
                    <td>{movement._id}</td>
                    <td style={{ color: movement.type === 'سحب' ? 'red' : 'green', fontWeight: 'bold' }}>{movement.type}</td>
                    <td>{movement.quantity}</td>
                    <td>{movement.product ? movement.product.name : 'منتج غير موجود'}</td>
                    <td>{new Date(movement.date).toLocaleString('ar-EG')}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* أزرار التنقل (Pagination) */}
          <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>السابق</button>
            <span>صفحة {currentPage} من {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>التالي</button>
          </div>
        </>
      )}
    </div>
  );
};

export default MovementsTable;
```
Use code with caution.

بهذا الشكل، بمجرد أن يكتب المستخدم أي حرف في حقل البحث، سيقوم الـ الفرونت إند بعمل طلب تلقائي، والباك إند سيبحث في المنتجات أولاً بمرونة الـ Regex ويعيد الحركات المفلترة فوراً وبأعلى أداء!
هل تريد تطبيق تقنية الـ Debounce على حقل البحث في React لمنع إرسال طلبات متعددة للسيرفر مع كل حرف يكتبه المستخدم لضمان أداء أفضل، أم أن الكود الحالي كافٍ للبدء؟

# تمام طبق تقنية ال debounce

لتطبيق تقنية الـ Debounce على حقل البحث في React، سنضمن عدم إرسال طلب جديد إلى السيرفر مع كل حرف يكتبه المستخدم، بل سننتظر حتى يتوقف المستخدم عن الكتابة لمدة معينة (مثلاً 500 ملي ثانية) ثم نرسل طلباً واحداً. هذا يقلل الضغط على السيرفر وقاعدة البيانات بشكل هائل.
سنقوم بإدخال حالة (State) جديدة لنص البحث السريع، ونستخدم useEffect مؤقت لإدارة وظيفة التوقيع (setTimeout).
إليك المكون المحدث بالكامل مع تقنية الـ Debounce:

كود المكون المحدث في React (MovementsTable.jsx)

```jsx
import React, { useState, useEffect } from 'react';

const MovementsTable = () => {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');
  
  // حقلين لإدارة الـ Debounce
  const [searchTerm, setSearchTerm] = useState('');       // النص المكتوب حالياً في الـ Input (سريع التحديث)
  const [debouncedSearch, setDebouncedSearch] = useState(''); // النص الفعلي المفلتر (يتحدث بعد توقف الكتابة)

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  // 1. التمكين المؤقت للـ Debounce (مراقبة searchTerm وتحديث debouncedSearch)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // إعادة التعيين للصفحة الأولى عند تغير نص البحث المفلتر
    }, 500); // الانتظار نصف ثانية بعد آخر حرف مكتوب

    // تنظيف المؤقت تلقائياً إذا كتب المستخدم حرفاً جديداً قبل انتهاء الـ 500ms
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // 2. تابع جلب البيانات الأساسي (يعتمد الآن على debouncedSearch)
  const fetchMovements = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: limit,
      });
      
      if (typeFilter) queryParams.append('type', typeFilter);
      if (debouncedSearch) queryParams.append('productName', debouncedSearch); // نرسل القيمة المفلترة فقط

      const response = await fetch(`http://localhost:3000/api/movements?${queryParams.toString()}`);
      if (!response.ok) throw new Error('فشل في جلب البيانات');

      const result = await response.json();
      setMovements(result.data);
      setTotalPages(result.metadata.totalPages);
    } catch (error) {
      console.error("خطأ أثناء جلب الحركات:", error);
    } finally {
      setLoading(false);
    }
  };

  // 3. إعادة جلب البيانات عند تغير الصفحة، فلتر النوع، أو القيمة المفلترة للبحث
  useEffect(() => {
    fetchMovements();
  }, [currentPage, typeFilter, debouncedSearch]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', direction: 'rtl' }}>
      <h2>سجل حركات المخزن</h2>

      {/* قسم الفلاتر والبحث */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '20px', alignItems: 'center' }}>
        <div>
          <label style={{ marginLeft: '8px' }}>تصفية حسب النوع:</label>
          <select 
            value={typeFilter} 
            onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }} 
            style={{ padding: '6px', borderRadius: '4px' }}
          >
            <option value="">الكل</option>
            <option value="سحب">سحب</option>
            <option value="إيداع">إيداع</option>
          </select>
        </div>

        <div>
          <label style={{ marginLeft: '8px' }}>بحث باسم المنتج:</label>
          <input 
            type="text" 
            placeholder="اكتب اسم المنتج..." 
            value={searchTerm} // نربطه بـ searchTerm السريع لضمان سلاسة الكتيبه
            onChange={(e) => setSearchTerm(e.target.value)} 
            style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc', width: '200px' }}
          />
          {searchTerm !== debouncedSearch && (
            <span style={{ marginRight: '10px', fontSize: '12px', color: '#888' }}>جاري البحث...</span>
          )}
        </div>
      </div>

      {/* جدول عرض البيانات */}
      {loading ? (
        <p>جاري تحميل البيانات...</p>
      ) : (
        <>
          <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th>رقم الحركة</th>
                <th>نوع الحركة</th>
                <th>الكمية</th>
                <th>اسم المنتج</th>
                <th>التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {movements.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>لا توجد نتائج مطابقة لبحثك</td>
                </tr>
              ) : (
                movements.map((movement) => (
                  <tr key={movement._id}>
                    <td>{movement._id}</td>
                    <td style={{ color: movement.type === 'سحب' ? 'red' : 'green', fontWeight: 'bold' }}>{movement.type}</td>
                    <td>{movement.quantity}</td>
                    <td>{movement.product ? movement.product.name : 'منتج غير معروف'}</td>
                    <td>{new Date(movement.date).toLocaleString('ar-EG')}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* الباجينيشن */}
          <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>السابق</button>
            <span>صفحة {currentPage} من {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>التالي</button>
          </div>
        </>
      )}
    </div>
  );
};

export default MovementsTable;
```
Use code with caution.

🎯 آلية العمل المضافة:

• عندما تكتب كلمة "شاشة"، بدلاً من إرسال 5 طلبات للسيرفر مع كل حرف (ش ثم شا ثم شاش..)، يقوم الـ clearTimeout بإلغاء الطلبات السابقة وإرسال طلب واحد فقط بالكلمة الكاملة "شاشة" بعد توقفك عن الكتابة بنصف ثانية.
• تمت إضافة مؤشر صغير جاري البحث... يظهر فقط أثناء فترة الـ 500ms ليعطي انطباعاً تفاعلياً ممتازاً للمستخدم.
الآن بعد أن أصبحت الشيفرة البرمجية متكاملة ومحسنة الأداء، هل تحتاج إلى أي توضيح بخصوص كيفية تضمين هذا المكون في ملف App.jsx الرئيسي لبدء المعاينة؟
