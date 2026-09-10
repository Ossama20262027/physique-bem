import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// Lazy initialization of Gemini API Client
let geminiClient: any = null;
async function getGemini() {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured on the server.");
    }
    const { GoogleGenAI } = await import("@google/genai");
    geminiClient = new GoogleGenAI({ apiKey });
  }
  return geminiClient;
}

const SYSTEM_PHYSICS_PROMPT = `أنت "الأستاذ الذكي" في تطبيق "فيزياء 4 متوسط | Physique 4AM"، تطبيق مخصص لتلاميذ السنة الرابعة متوسط في الجزائر للتحضير لشهادة التعليم المتوسط (BEM).

مهامك وشخصيتك:
1. أنت أستاذ فيزياء جزائري متمكن، بشوش، مشجع، ناصح ودقيق علمياً.
2. تلتزم حصراً بالمنهاج الجزائري الرسمي المعتمد للجيل الثاني في العلوم الفيزيائية والتكنولوجيا للرابعة متوسط:
   - ميدان الظواهر الكهربائية (التكهرب، نموذج الذرة، التيار المتناوب Umax, Ueff, T, f، الأمن الكهربائي).
   - ميدان المادة وتحولاتها (الشاردة، المحلول الشاردي، التحليل الكهربائي البسيط، تفاعل حمض مع معدن، تفاعل ملح مع معدن، تفاعل حمض مع كربونات الكالسيوم).
   - ميدان الظواهر الميكانيكية (الجملة الميكانيكية، نمذجة القوة، الفعلين المتبادلين، الثقل P = m × g، توازن جسم صلب، دافعة أرخميدس Fa).
   - ميدان الظواهر الضوئية (القطر الظاهري tan(α) = d / L، المرآة المستوية، قانونا الانعكاس i = r، مجال المرآة).
3. استعمل اللغة العربية الفصحى السلسة، مع إدراج المصطلحات العلمية باللغة الفرنسية بين قوسين عند أول ذكر لها لمساعدة التلميذ (مثل: التوتر الفعال tension efficace، القاطع التفاضلي disjoncteur différentiel، دافعة أرخميدس poussée d'Archimède).
4. لا تعطِ الحلول الصعبة دفعة واحدة دون تفكيك، بل رتب الإجابة في خطوات:
   - 📌 المفهوم الفيزيائي الأساسي.
   - 📐 القانون المستعمل والوحدات الدولية.
   - 🔢 طريقة الحساب والتعويض بالأرقام.
   - ⚠️ فخ BEM شائع (تنبيه التلميذ لتفادي الوقوع في الأخطاء الشائعة).
5. تجنب التعقيدات الجامعية أو قوانين الثانوي (مثل قوانين نيوتن الحركية المعقدة أو حساب المثلثات خارج مقرر 4AM).`;

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    appName: "فيزياء 4 متوسط | Physique 4AM",
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    hasYouTubeKey: Boolean(process.env.YOUTUBE_API_KEY)
  });
});

// AI Chat Tutor endpoint
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message, history, contextLessonTitle } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "الرجاء إدخال رسالة أو سؤال صحيح." });
    }

    if (!process.env.GEMINI_API_KEY) {
      // Return helpful fallback response if API key is not yet set
      return res.json({
        reply: `أهلاً بك يا بطل! أنا "الأستاذ الذكي" لمساعدتك في مراجعة فيزياء 4 متوسط. 

سؤالك عن: **${message}**

💡 **نصيحة الأستاذ الفورية**:
في مادة الفيزياء للسنة الرابعة متوسط، احرص دائماً على كتابة القانون أولاً، ثم التحويل للوحدات الدولية (مثلاً تحويل الكتلة من g إلى kg بالقسمة على 1000)، ثم التعويض وحساب النتيجة مع كتابة الوحدة.

*(ملاحظة تقنية: لتفعيل كامل قدرات الذكاء الاصطناعي التفاعلي المتقدم، تأكد من إضافة مفتاح GEMINI_API_KEY في إعدادات البيئة).*`
      });
    }

    const ai = await getGemini();

    let contextualPrompt = "";
    if (contextLessonTitle) {
      contextualPrompt = `السياق الحالي الذي يراجعه التلميذ: درس "${contextLessonTitle}".\n`;
    }

    // Build chat contents
    const contents: any[] = [];

    // Append history if provided
    if (Array.isArray(history) && history.length > 0) {
      for (const item of history.slice(-6)) {
        contents.push({
          role: item.sender === "assistant" ? "model" : "user",
          parts: [{ text: item.text }]
        });
      }
    }

    contents.push({
      role: "user",
      parts: [{ text: `${contextualPrompt}سؤال التلميذ: ${message}` }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction: SYSTEM_PHYSICS_PROMPT,
        temperature: 0.7
      }
    });

    res.json({ reply: response.text || "عذراً يا بطل، لم أستطع توليد الإجابة حالياً. أعد صياغة السؤال وسأكون معك!" });
  } catch (error: any) {
    console.error("AI Chat error:", error);
    res.status(500).json({
      error: "حدث خطأ أثناء التواصل مع الأستاذ الذكي.",
      details: error.message
    });
  }
});

// AI Exercise Solver & Image Analyzer ("صوّر تمرينك" و "حل معي")
app.post("/api/ai/solve-exercise", async (req, res) => {
  try {
    const { text, imageBase64, mimeType = "image/jpeg", mode = "solve" } = req.body;

    if (!text && !imageBase64) {
      return res.status(400).json({ error: "الرجاء إدخال نص التمرين أو رفع صورة له." });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        analysis: {
          title: "تمرين فيزياء 4 متوسط",
          givens: ["تم استخراج المعطيات الأولية من النص المقدم"],
          required: ["المطلوب هو تحديد المقادير الفيزيائية وكتابة القوانين"],
          formula: "P = m × g أو Fa = P - P' أو Umax = Y × Sv حسب معطيات المسألة",
          steps: [
            "الخطوة 1: تحديد الميدان المعني (كهرباء، مادة، ميكانيك أو ضوء).",
            "الخطوة 2: استخراج المقادير الفيزيائية مع وحداتها.",
            "الخطوة 3: التحويل الإلزامي إلى النظام الدولي للوحدات (SI).",
            "الخطوة 4: كتابة العلاقة الرياضية أولاً بالحروف ثم التعويض بالأرقام."
          ],
          bemAdvice: "في BEM لا تكتفِ بالنتيجة النهائية أبداً؛ النقاط مقسمة على القانون، التعويض، الوحدة، وكتابة رمز الشعاع فوق القوى!"
        }
      });
    }

    const ai = await getGemini();

    const parts: any[] = [];

    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      parts.push({
        inlineData: {
          data: cleanBase64,
          mimeType
        }
      });
    }

    let prompt = "";
    if (mode === "guide") {
      prompt = `التلميذ اختار وضع "حل معي خطوة بخطوة (Mode Socratique)".
المطلوب منك:
1. اقرأ التمرين بدقة من الصورة أو النص التالي: "${text || ""}".
2. لا تعطِ الحل النهائي الآن أبداً!
3. استخرج أولاً المعطيات والمطلوب الأول، ثم اطرح على التلميذ سؤالاً توجيهياً واحداً وواضحاً ليشغل فكره ويختار القانون المناسب بنفسه، مع كلمة تشجيع.`;
    } else {
      prompt = `قم بتحليل وحل هذا التمرين المأخوذ من منهاج الفيزياء للسنة 4 متوسط بالجزائر بدقة نموذجية توافق سلم تنقيط شهادة التعليم المتوسط (BEM):
${text ? `نص التمرين: ${text}` : "الرجاء قراءة نص التمرين ومعطياته بدقة متناهية من الصورة المرفقة."}

قدم إجابتك بتنسيق منظم ومريح للعين بالعربية:
1. 📋 المعطيات المستخرجة (Données).
2. 🎯 المطلوب حسابه أو تفسيره (Objectifs).
3. 📐 القوانين الفيزيائية المعتمدة (Formules).
4. ✍️ خطوات الحل النموذجية مع التعويض الحسابي والوحدات الدولية.
5. ⚠️ تحذير من فخ شائع في BEM في هذا السؤال تحديداً.`;
    }

    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts }],
      config: {
        systemInstruction: SYSTEM_PHYSICS_PROMPT,
        temperature: 0.6
      }
    });

    res.json({ result: response.text });
  } catch (error: any) {
    console.error("AI Solve error:", error);
    res.status(500).json({
      error: "حدث خطأ أثناء معالجة التمرين بالذكاء الاصطناعي.",
      details: error.message
    });
  }
});

// YouTube API Search / Fallback proxy
app.get("/api/youtube/search", async (req, res) => {
  try {
    const query = req.query.q as string || "فيزياء 4 متوسط";
    const apiKey = process.env.YOUTUBE_API_KEY;
    const channelId = process.env.YOUTUBE_CHANNEL_ID;

    if (apiKey) {
      const url = new URL("https://www.googleapis.com/youtube/v3/search");
      url.searchParams.set("part", "snippet");
      url.searchParams.set("maxResults", "6");
      url.searchParams.set("q", `${query} الجزائر 4AM`);
      url.searchParams.set("type", "video");
      if (channelId) {
        url.searchParams.set("channelId", channelId);
      }
      url.searchParams.set("key", apiKey);

      const ytRes = await fetch(url.toString());
      if (ytRes.ok) {
        const data: any = await ytRes.json();
        const items = (data.items || []).map((item: any) => ({
          id: item.id?.videoId,
          title: item.snippet?.title,
          channelTitle: item.snippet?.channelTitle,
          isTeacherChannel: Boolean(channelId && item.snippet?.channelId === channelId) || item.snippet?.channelTitle?.includes("دروسي على النت"),
          videoId: item.id?.videoId,
          duration: "فيديو يوتيوب",
          thumbnail: item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url,
          publishedAt: item.snippet?.publishedAt?.split("T")[0]
        }));
        return res.json({ items });
      }
    }

    // Curated educational fallback videos
    res.json({
      items: [
        {
          id: "0tqGvM8kG-k",
          title: `${query} - شرح مفصل لشهادة التعليم المتوسط BEM`,
          channelTitle: "دروسي على النت",
          isTeacherChannel: true,
          videoId: "0tqGvM8kG-k",
          duration: "18:24",
          thumbnail: "https://images.unsplash.com/photo-1517976487502-53a5c1363ef7?w=640&auto=format&fit=crop&q=80",
          views: "45K مشاهدة"
        },
        {
          id: "wYk3_Qj2f14",
          title: `${query} - ملخص القوانين وحل التمارين الأكثر تكراراً`,
          channelTitle: "دروسي على النت",
          isTeacherChannel: true,
          videoId: "wYk3_Qj2f14",
          duration: "22:15",
          thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=640&auto=format&fit=crop&q=80",
          views: "88K مشاهدة"
        }
      ]
    });
  } catch (error: any) {
    console.error("YouTube search error:", error);
    res.status(500).json({ error: "فشل البحث في يوتيوب", details: error.message });
  }
});

// Vite middleware for development & Static serving in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
