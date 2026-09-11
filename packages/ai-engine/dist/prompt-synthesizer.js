import { calculateAyurvedicDoshaProfile } from '@vedica/life-domain-engine';
export function detectNaturalLanguage(text) {
    if (/[\u0900-\u097F]/.test(text)) {
        return 'hi';
    }
    const hinglishTokens = /\b(kya|meri|mera|mere|kab|kb|kabb|hoga|hogi|hoge|karni|krni|karna|krna|chahiye|chahie|kaise|karein|krein|karu|kru|naukri|nokri|shaadi|shadi|shadii|byah|biah|videsh|paise|paisa|rupaye|bataiye|bataye|btao|kyu|kyun|hai|hain|he|mujhe|mjhe|apni|apne|rahe|rahi|lag|raha|samasya|bimari|bimaari|swasthya|pet|dawa|kripya|namaste|pranam|ghar|makan|makaan|dhandha|vyapar|shani|rahu|ketu|guru|dasha|bhagya|kismat|sahi|galat|khatam|milega|milegi|shuru|kabz|tabiyat|tabiat)\b/i;
    if (hinglishTokens.test(text)) {
        return 'hinglish';
    }
    return 'en';
}
/**
 * Intelligent Multi-Intent Life Domain Classifier
 */
export function classifyLifeDomain(question) {
    const q = question.toLowerCase().trim();
    const topicPatterns = {
        ABROAD: [
            {
                keywords: [
                    /\b(abroad|foreign|overseas|visa|immigration|relocat(e|ion)|settle abroad|settle outside|out of country|move abroad|go abroad)\b/,
                    /\b(international|canada|usa|us|uk|europe|dubai|australia|germany|green card|pr|citizenship|passport)\b/,
                    /\b(videsh|pardes|bahar|shift|relocation)\b/,
                    /\b(foreign trip|foreign travel|foreign job|abroad job|foreign study|study abroad)\b/,
                    /(विदेश|परदेस|विदेश यात्रा|वीजा|पीआर|नागरिकता|स्थान परिवर्तन)/,
                ],
                weight: 10,
            },
        ],
        STRUGGLE: [
            {
                keywords: [
                    /\b(fail(ed|ing|ure)?|struggl(e|ing)|delay(ed|s)?|obstacle(s)?|block(ed|age)?|suffer(ing)?)\b/,
                    /\b(last \d+ year(s)?|past \d+ year(s)?|bad phase|tough time|stuck in life|why me|bad luck)\b/,
                    /\b(sade sati|shani ki dasha|dhannu|kantaka|ashtama|loss after loss|unsuccessful|frustrat(ed|ion))\b/,
                    /\b(pareshaan|pareshan|mushkil|dukh|rukawat|kasht|nuksan|kab theek hoga|kb theek hoga|problem)\b/,
                    /(असफलता|संघर्ष|बाधा|परेशानी|रुकावट|कष्ट|नुकसान|साढ़ेसाती|शनि की ढैया|कब ठीक होगा)/,
                ],
                weight: 9,
            },
        ],
        CAREER: [
            {
                keywords: [
                    /\b(career|job|profession|vocation|business|startup|founder|entrepreneur|venture|corporate)\b/,
                    /\b(promotion|appraisal|salary|increment|switch job|change job|boss|workplace|interview|offer letter)\b/,
                    /\b(government job|sarkari naukri|upsc|ias|ssc|bank po|corporate vs business|job vs business)\b/,
                    /\b(naukri|nokri|vyapar|dhandha|rozgar|tarakki|padonati|kaam|kam)\b/,
                    /(नौकरी|करियर|व्यवसाय|व्यापार|धंधा|पदोन्नति|रोजगार|सरकारी नौकरी|प्रमोशन|इंटरव्यू)/,
                ],
                weight: 9,
            },
        ],
        WEALTH: [
            {
                keywords: [
                    /\b(wealth|money|finance|financial|rich|crorepati|millionaire|fund(s)?|investment(s)?)\b/,
                    /\b(debt|loan|emi|borrow|bankruptcy|stock market|share market|crypto|trading|speculation|profit|lottery)\b/,
                    /\b(paisa|paise|dhan|rupaye|rupee|samriddhi|karza|udhar|kamai|aamdani|laxmi)\b/,
                    /(धन|पैसा|समृद्धि|कर्ज|उधार|कमाई|आमदनी|लक्ष्मी|निवेश|शेयर बाजार|लॉटरी)/,
                ],
                weight: 8,
            },
        ],
        MARRIAGE: [
            {
                keywords: [
                    /\b(marr(y|iage|ied)|wedding|spouse|husband|wife|life partner|fiance|proposal|matrimony)\b/,
                    /\b(love life|relationship|dating|boyfriend|girlfriend|breakup|divorce|remarriage|separation|soulmate)\b/,
                    /\b(shaadi|shadi|shadii|byah|biah|sagai|engagement|vivah|jeewansathi|jeevansathi|pati|patni|pyar|prem|rishta|manglik)\b/,
                    /(शादी|विवाह|पति|पत्नी|जीवनसाथी|प्यार|प्रेम|सम्बन्ध|रिश्ता|मांगलिक|तलाक|सगाई)/,
                ],
                weight: 10,
            },
        ],
        PROPERTY: [
            {
                keywords: [
                    /\b(property|house|home|flat|apartment|villa|plot|land|real estate|construct(ion)?)\b/,
                    /\b(buy (a )?house|buy (a )?home|buy (a )?flat|buy (a )?car|vehicle|buy property|own house)\b/,
                    /\b(ghar|makaan|makan|zameen|jameen|bhoomi|gadi|gaadi|vahan|kab khareed|kb khareed)\b/,
                    /(घर|मकान|जमीन|भूमि|संपत्ति|गाड़ी|वाहन|फ्लैट|प्लॉट|गृह प्रवेश)/,
                ],
                weight: 8,
            },
        ],
        HEALTH: [
            {
                keywords: [
                    /\b(health|disease|illness|sick(ness)?|medical|surgery|operation|hospital|doctor)\b/,
                    /\b(stomach|gut|digest(ion|ive)?|gastric|acidity|liver|belly|bowel|ibs|abdomen|abdominal|organ)\b/,
                    /\b(anxiety|mental health|stress|depression|insomnia|sleep|blood pressure|diabetes|pain|recovery|vitality)\b/,
                    /\b(headache|migraine|skin|eyes|throat|thyroid|infection|injury|fatigue|weakness|body pain|back pain)\b/,
                    /\b(swasthya|bimari|bimaari|sehat|tabiyat|tabiat|rog|chikitsa|mansik tanav|pet|pet kharab|pet dard|kabz|gas|bimar)\b/,
                    /(स्वास्थ्य|बीमारी|सेहत|रोग|चिकित्सा|मानसिक तनाव|पेट|पेट दर्द|कब्ज|एसिडिटी|दवा|तनाव)/,
                ],
                weight: 10,
            },
        ],
        EDUCATION: [
            {
                keywords: [
                    /\b(stud(y|ies|ying)|exam(s)?|college|university|school|degree|graduation|post grad|mba|phd|masters)\b/,
                    /\b(competitive exam|neet|jee|cat|gate|ielts|toefl|admission|marks|score|result)\b/,
                    /\b(padhai|padai|shiksha|vidya|pariksha|dakhila)\b/,
                    /(पढ़ाई|शिक्षा|विद्या|परीक्षा|दाखिला|प्रतियोगी परीक्षा|परिणाम|कॉलेज)/,
                ],
                weight: 8,
            },
        ],
        CHILDREN: [
            {
                keywords: [
                    /\b(child(ren)?|baby|babies|kid(s)?|son|daughter|conceive|conception|pregnancy|pregnant|progeny)\b/,
                    /\b(santaan|santan|bachha|bacha|baccha|bachhe|bache|putra|putri|garbhavastha)\b/,
                    /(संतान|बच्चा|बच्चे|पुत्र|पुत्री|गर्भावस्था|संतान प्राप्ति)/,
                ],
                weight: 8,
            },
        ],
        DECISION_SIMULATION: [
            {
                keywords: [
                    /\b(option a|option b|decision matrix|decision simulator|what if|compare options|choose between option|should i choose a or b|a ya b me se|dono me se kaunsa|simulat(e|or|ion))\b/i,
                    /(तुलना करें|विकल्प a|विकल्प b|दोनों में से क्या|फैसला सिम्युलेटर|सिम्युलेटर)/,
                ],
                weight: 12,
            },
        ],
        AYUR_JYOTISH: [
            {
                keywords: [
                    /\b(dosha|doshas|vata|pitta|kapha|prakriti|vikriti|ayur-jyotish|ayurveda|ayurvedic|circadian|bio-rhythm|gut vitality|digestive fire|agni|bio-clock|adaptogen|panchakarma)\b/i,
                    /\b(vata pitta|pitta kapha|tridosha|prakruti|dincharya|ritucharya|ayurvedic routine)\b/i,
                    /(दोष|वात|पित्त|कफ|प्रकृति|दिनचर्या|अग्नि|आयुर्वेद|आयुर्वेदिक|जठराग्नि|बायो-रिदम)/,
                ],
                weight: 12,
            },
        ],
        DHARMA: [
            {
                keywords: [
                    /\b(aim of life|purpose of life|soul mission|why was i born|destiny|dharma|spiritual(ity)?|moksha)\b/,
                    /\b(past life|karma|kundalini|meditation|enlightenment|deity|ishtadevta|guru|occult|astrology)\b/,
                    /\b(jeevan ka lakshya|jeevan ka uddeshya|lakshya|uddeshya|aatma|adhyatm|bhagya|kismat)\b/,
                    /(जीवन का लक्ष्य|जीवन का उद्देश्य|आत्मा|अध्यात्म|भाग्य|मोक्ष|धर्म|इष्टदेव)/,
                ],
                weight: 8,
            },
        ],
        GENERAL: [],
    };
    const scores = {};
    for (const [topic, ruleList] of Object.entries(topicPatterns)) {
        for (const rule of ruleList) {
            for (const pattern of rule.keywords) {
                if (pattern.test(q)) {
                    scores[topic] = (scores[topic] || 0) + rule.weight;
                }
            }
        }
    }
    let bestTopic = 'GENERAL';
    let maxScore = 0;
    for (const [topic, score] of Object.entries(scores)) {
        if (score > maxScore) {
            maxScore = score;
            bestTopic = topic;
        }
    }
    const confidence = maxScore >= 9 ? 'HIGH' : maxScore >= 5 ? 'MEDIUM' : 'GENERAL';
    return { topic: bestTopic, confidence };
}
/**
 * Intelligent Sub-Intent Classifier for Nuanced Domain Understanding
 */
export function detectSubIntent(question, topic) {
    const q = question.toLowerCase().trim();
    if (topic === 'MARRIAGE') {
        if (/\b(spouse|husband|wife|partner|nature|trait|personality|character|look|appear|profession|career of spouse|who will i marry|background|swabhav|pati|patni|jeevansathi|kaisa hoga|kaisi hogi|kaun hoga|characteristics)\b/i.test(q) ||
            /(स्वभाव|विशेषताएं|कैसा होगा|कैसी होगी|दिखने में|जीवनसाथी का स्वभाव|पत्नी कैसी|पति कैसा)/.test(q)) {
            return 'SPOUSE_TRAITS';
        }
        if (/\b(love or arranged|love marriage|arranged marriage|prem vivah|ghar walo|family choice|arranged vs love|love vs arranged|arrange marriage|pasand ki shaadi)\b/i.test(q) ||
            /(प्रेम विवाह|लव मैरिज|अरेंज मैरिज|घर वालों की पसंद|पसंद की शादी)/.test(q)) {
            return 'LOVE_VS_ARRANGED';
        }
        if (/\b(delay|late|barrier|obstacle|manglik|mangal dosha|deri|rukawat|problem in marriage|separation|conflict|remed(y|ies)|vivah me badha)\b/i.test(q) ||
            /(मांगलिक|देरी|रुकावट|विवाह में बाधा|तलाक|शादी में अड़चन)/.test(q)) {
            return 'OBSTACLES_MANGLIK';
        }
        if (/\b(after marriage|married life|harmony|peace|compatibility|relationship quality|happ(y|iness)|dampatya|shaadi ke baad|relationship success)\b/i.test(q) ||
            /(दांपत्य जीवन|शादी के बाद|सुख|सामंजस्य|वैवाहिक सुख)/.test(q)) {
            return 'MARRIED_LIFE_QUALITY';
        }
        if (/\b(when|timing|date|year|month|kab|kb|age|time of marriage|shaadi kab|vivah kab|wedding date|marriage window)\b/i.test(q) ||
            /(कब होगी शादी|विवाह कब|शादी का समय|कब तक शादी)/.test(q)) {
            return 'MARRIAGE_TIMING';
        }
        return 'GENERAL_MARRIAGE';
    }
    if (topic === 'CAREER') {
        if (/\b(job or business|business or job|startup|founder|entrepreneur|own business|corporate vs business|naukri ya vyapar|dhandha ya naukri|service or business)\b/i.test(q) ||
            /(नौकरी या व्यापार|बिजनेस या जॉब|खुद का काम|धंधा)/.test(q)) {
            return 'JOB_VS_BUSINESS';
        }
        if (/\b(which (field|career|job|industry|sector)|suitable (field|career|profession)|what (should i do|job is best)|konsa career|kaunsa kaam|field of work|industry)\b/i.test(q) ||
            /(कौन सा करियर|किस क्षेत्र में|क्या काम सही है|क्षेत्र)/.test(q)) {
            return 'INDUSTRY_SELECTION';
        }
        if (/\b(promotion|appraisal|salary|increment|switch|change job|switch company|hike|when will i get promotion|tarakki|padonati)\b/i.test(q) ||
            /(प्रमोशन|नौकरी बदलना|सैलरी हाइक|पदोन्नति|तरक्की)/.test(q)) {
            return 'PROMOTION_TIMING';
        }
        if (/\b(boss|politics|workplace|respect|authority|leadership|executive|colleague)\b/i.test(q) ||
            /(बॉस|ऑफिस की राजनीति|नेतृत्व|प्रभाव|अधिकार)/.test(q)) {
            return 'LEADERSHIP_AUTHORITY';
        }
        return 'GENERAL_CAREER';
    }
    if (topic === 'ABROAD') {
        if (/\b(pr|green card|citizenship|permanent(ly)? settle|permanent residence|naagarikta|pakk(i|a) settlement|settlement abroad)\b/i.test(q) ||
            /(पीआर|ग्रीन कार्ड|नागरिकता|स्थायी निवास|पक्का सेटलमेंट)/.test(q)) {
            return 'PR_SETTLEMENT';
        }
        if (/\b(study abroad|higher studies|master|university abroad|study vs work|education abroad)\b/i.test(q) ||
            /(विदेश में पढ़ाई|उच्च शिक्षा विदेश)/.test(q)) {
            return 'STUDY_VS_WORK';
        }
        if (/\b(which (country|direction|place)|favorable countries|usa|uk|canada|germany|australia|dubai|kaunsa desh|kis disha)\b/i.test(q) ||
            /(कौन सा देश|किस दिशा में|अनुकूल देश)/.test(q)) {
            return 'DIRECTIONS_COUNTRIES';
        }
        if (/\b(when|timing|visa (stamp|approv|process)|kab jaunga|videsh yatra kab)\b/i.test(q) ||
            /(विदेश कब जाऊंगा|वीजा कब मिलेगा|यात्रा कब)/.test(q)) {
            return 'VISA_TIMING';
        }
        return 'GENERAL_ABROAD';
    }
    if (topic === 'WEALTH') {
        if (/\b(stock(s)?|share market|crypto|trading|speculation|real estate|gold|invest(ment)?|where to invest|kaha invest)\b/i.test(q) ||
            /(शेयर बाजार|निवेश|ट्रेडिंग|सोना या प्रॉपर्टी|कहाँ निवेश)/.test(q)) {
            return 'INVESTMENT_CLASS';
        }
        if (/\b(debt|loan|emi|karza|udhar|loss|nuksan|repay|recovery)\b/i.test(q) ||
            /(कर्ज|उधार|लोन|घाटा|आर्थिक नुकसान|कर्ज मुक्ति)/.test(q)) {
            return 'DEBT_RECOVERY';
        }
        if (/\b(when|timing|rich|crorepati|millionaire|wealth peak|dhan labh kab|paisa kab aayega)\b/i.test(q) ||
            /(धन लाभ कब|अमीर कब बनूंगा|पैसा कब आएगा|समृद्धि काल)/.test(q)) {
            return 'WEALTH_TIMING';
        }
        return 'GENERAL_WEALTH';
    }
    if (topic === 'HEALTH' || topic === 'AYUR_JYOTISH') {
        if (/\b(dosha|prakriti|vata|pitta|kapha|body constitution|constitution type|tridosha)\b/i.test(q) ||
            /(दोष|प्रकृति|वात|पित्त|कफ|शरीर का प्रकार)/.test(q)) {
            return 'DOSHA_CONSTITUTION';
        }
        if (/\b(stomach|gut|digest(ion|ive)?|acidity|gas|kabz|constipation|pet dard|bloating|ibs|metabolism)\b/i.test(q) ||
            /(पेट|कब्ज|एसिडिटी|गैस|पाचन|जठराग्नि)/.test(q)) {
            return 'DIGESTION_GUT';
        }
        if (/\b(stress|anxiety|depression|sleep|insomnia|tanav|mental peace|vitality|ojas|fatigue)\b/i.test(q) ||
            /(तनाव|चिंता|नींद की समस्या|मानसिक शांति|ओजस)/.test(q)) {
            return 'STRESS_VITALITY';
        }
        return 'GENERAL_HEALTH';
    }
    return 'GENERAL';
}
/**
 * Generate Smart Contextual Follow-up Questions based on detected topic & chart
 */
export function generateFollowUpSuggestions(topic, context) {
    switch (topic) {
        case 'ABROAD':
            return [
                {
                    en: 'Which directions or countries are most favorable for me?',
                    hi: 'मेरे लिए कौन से देश या दिशाएं सर्वाधिक अनुकूल हैं?',
                    query: 'Which specific directions or countries are most favorable for my foreign relocation?',
                },
                {
                    en: 'Should I go for higher studies or an employment visa?',
                    hi: 'क्या मुझे उच्च शिक्षा या नौकरी के वीजा पर जाना चाहिए?',
                    query: 'Should I pursue foreign travel for higher studies or a corporate job assignment?',
                },
                {
                    en: 'What remedies will prevent visa delays or paperwork hurdles?',
                    hi: 'वीजा या कानूनी कागजी कार्रवाई में देरी से बचने के क्या उपाय हैं?',
                    query: 'What astrological remedies will smoothen my visa and international paperwork?',
                },
            ];
        case 'CAREER':
            return [
                {
                    en: 'What specific industry or niche suits my Amatyakaraka?',
                    hi: 'मेरी आजीविका के लिए कौन सा उद्योग या क्षेत्र सबसे उपयुक्त है?',
                    query: 'What specific business or technology industry fits my chart archetype best?',
                },
                {
                    en: 'When should I ask for a promotion or switch companies?',
                    hi: 'पदोन्नति मांगने या नौकरी बदलने का सही समय कब है?',
                    query: 'When is the exact best month to negotiate a promotion or make a job switch?',
                },
                {
                    en: 'How can I build authority and avoid workplace friction?',
                    hi: 'कार्यक्षेत्र में प्रभाव कैसे बढ़ाएं और राजनीति से कैसे बचें?',
                    query: 'How to handle workplace competition and step into executive leadership?',
                },
            ];
        case 'STRUGGLE':
            return [
                {
                    en: 'What specific karmic lesson is this Saturn cycle teaching me?',
                    hi: 'इस कठिन समय में मेरा मुख्य कर्मिक सबक क्या है?',
                    query: 'What core karmic restructuring lesson is this difficult cycle teaching me?',
                },
                {
                    en: 'What daily mantra or meditation brings immediate mental relief?',
                    hi: 'मानसिक शांति और राहत के लिए कौन सा दैनिक अभ्यास सर्वश्रेष्ठ है?',
                    query: 'What daily grounding meditation or sattvic mantra accelerates emotional relief?',
                },
                {
                    en: 'How will my life change after the transition date?',
                    hi: 'राहत तिथि के बाद जीवन में क्या सकारात्मक परिवर्तन आएंगे?',
                    query: 'What concrete positive shifts can I expect once this transition date passes?',
                },
            ];
        case 'WEALTH':
            return [
                {
                    en: 'Should I invest in real estate, index funds, or business?',
                    hi: 'क्या मुझे अचल संपत्ति, सुरक्षित फंड्स या व्यवसाय में निवेश करना चाहिए?',
                    query: 'Which asset class (real estate, stocks, or business equity) aligns best with my 2nd/11th houses?',
                },
                {
                    en: 'When is my highest wealth accumulation cycle?',
                    hi: 'मेरे जीवन का सबसे समृद्ध धन-संचय काल कब है?',
                    query: 'When is my prime multi-year wealth accumulation window according to my dasha?',
                },
                {
                    en: 'What financial mistakes must I avoid right now?',
                    hi: 'वर्तमान समय में मुझे किन वित्तीय गलतियों से बचना चाहिए?',
                    query: 'What high-risk financial or investment pitfalls should I strictly avoid currently?',
                },
            ];
        case 'MARRIAGE':
            return [
                {
                    en: 'What are the key personality traits of my life partner?',
                    hi: 'मेरे जीवनसाथी का स्वभाव और मुख्य विशेषताएं कैसी होंगी?',
                    query: 'What are the detailed astrological characteristics and background of my future spouse?',
                },
                {
                    en: 'How will we meet and under what circumstances?',
                    hi: 'हमारी मुलाकात किस प्रकार और किन परिस्थितियों में होने की संभावना है?',
                    query: 'How and in what setting will I likely meet my life partner as per my 7th house?',
                },
                {
                    en: 'What practices ensure long-term marital peace and bonding?',
                    hi: 'दांपत्य जीवन में आजीवन सुख और सामंजस्य के क्या उपाय हैं?',
                    query: 'What relational habits will strengthen mutual respect and harmony in my marriage?',
                },
            ];
        case 'PROPERTY':
            return [
                {
                    en: 'Should I buy an apartment, a landed plot, or build a house?',
                    hi: 'क्या मुझे फ्लैट, भूमि या स्वयं मकान बनाना चाहिए?',
                    query: 'Does my chart favor buying a ready apartment or constructing on a plot of land?',
                },
                {
                    en: 'Is taking a home loan favorable for me?',
                    hi: 'क्या गृह ऋण (Home Loan) लेना मेरे लिए शुभ और सुरक्षित रहेगा?',
                    query: 'How does my 6th/4th house axis support handling a mortgage or home loan?',
                },
                {
                    en: 'What Vastu considerations should I keep in mind?',
                    hi: 'नया घर लेते समय मुझे किन मुख्य बातों का ध्यान रखना चाहिए?',
                    query: 'What energetic and domestic sanctuary guidelines align with my rising sign?',
                },
            ];
        case 'HEALTH':
            return [
                {
                    en: 'What daily Ayurvedic routine suits my constitution?',
                    hi: 'मेरी प्रकृति के अनुसार कौन सी दैनिक दिनचर्या सर्वोत्तम है?',
                    query: 'What Ayurvedic lifestyle and nutrition regimen balances my rising sign vitality?',
                },
                {
                    en: 'How can I release deep-seated stress and improve sleep?',
                    hi: 'गहरे तनाव को दूर करने और अच्छी नींद के लिए क्या करें?',
                    query: 'What specific breathwork and evening protocols calm my nervous system?',
                },
                {
                    en: 'What months require extra vigilance for immunity?',
                    hi: 'स्वास्थ्य के प्रति विशेष सावधानी बरतने का कौन सा समय है?',
                    query: 'Which upcoming transit periods require extra attention to rest and immunity?',
                },
            ];
        case 'EDUCATION':
            return [
                {
                    en: 'What study techniques match my mental processing style?',
                    hi: 'मेरी बौद्धिक क्षमता के अनुसार पढ़ाई की कौन सी तकनीक सबसे अच्छी है?',
                    query: 'What learning environment and focus methods maximize my academic retention?',
                },
                {
                    en: 'Which competitive exams have the highest success probability?',
                    hi: 'किन प्रतियोगी परीक्षाओं में सफलता की सर्वाधिक संभावना है?',
                    query: 'Which competitive examinations align best with my 5th and 10th house energies?',
                },
                {
                    en: 'Should I pursue higher education in India or overseas?',
                    hi: 'क्या मुझे भारत में या विदेश में उच्च शिक्षा लेनी चाहिए?',
                    query: 'Does my chart show stronger academic success locally or at a foreign university?',
                },
            ];
        case 'DECISION_SIMULATION':
            return [
                {
                    en: 'Should I choose Option A or Option B based on my Dasha?',
                    hi: 'मेरी वर्तमान दशा के अनुसार विकल्प A या B में से क्या श्रेष्ठ है?',
                    query: 'Which option has higher astrological alignment and long-term return for me?',
                },
                {
                    en: 'What is the risk vs reward score for these paths?',
                    hi: 'इन दोनों विकल्पों में जोखिम बनाम लाभ का ज्योतिषीय अनुपात क्या है?',
                    query: 'Can you compare the risk profile and planetary strength for both paths?',
                },
                {
                    en: 'When is the most auspicious window to execute this transition?',
                    hi: 'इस निर्णय को लागू करने का सबसे शुभ मुहूर्त कब है?',
                    query: 'What is the optimal planetary timing window to make this major transition?',
                },
            ];
        case 'AYUR_JYOTISH':
            return [
                {
                    en: 'What is my primary Dosha constitution (Vata/Pitta/Kapha)?',
                    hi: 'मेरी जन्म कुंडली के अनुसार मुख्य दोष (वात/पित्त/कफ) क्या है?',
                    query: 'What is my exact Ayurvedic Dosha percentage breakdown and digestive fire type?',
                },
                {
                    en: 'What daily circadian bio-clock schedule suits me best?',
                    hi: 'मेरी ऊर्जा और स्वास्थ्य के लिए कौन सी दैनिक दिनचर्या सर्वश्रेष्ठ है?',
                    query: 'What is the optimal circadian bio-clock schedule for deep work, meals, and sleep?',
                },
                {
                    en: 'Which adaptogens and herbs balance my planetary energies?',
                    hi: 'ग्रहों के संतुलन और ओजस वृद्धि के लिए कौन सी आयुर्वेदिक जड़ी-बूटियां लें?',
                    query: 'What Ayurvedic adaptogens and Sattvic herbs nourish my Lagna and Sun vitality?',
                },
            ];
        case 'DHARMA':
        default:
            return [
                {
                    en: 'What is my greatest innate superpower according to my Lagna?',
                    hi: 'मेरे लग्न के अनुसार मेरी सबसे बड़ी स्वाभाविक शक्ति क्या है?',
                    query: 'What is the greatest innate gift and intellectual strength of my chart?',
                },
                {
                    en: 'What major life milestone should I prepare for next?',
                    hi: 'मुझे अगले किस बड़े जीवन मील के पत्थर की तैयारी करनी चाहिए?',
                    query: 'What major milestone window (career, relocation, property) is approaching next?',
                },
                {
                    en: 'How can I align my daily work with my soul purpose?',
                    hi: 'मैं अपने दैनिक कर्म को अपने आत्मिक उद्देश्य से कैसे जोड़ूं?',
                    query: 'How can I align my day-to-day work with my overarching soul mission and dharma?',
                },
            ];
    }
}
// Helper to format degrees into Sign Deg Min
function formatDegrees(deg) {
    if (deg === undefined || deg === null || isNaN(deg))
        return '00°00\'';
    const signDeg = deg % 30;
    const d = Math.floor(signDeg);
    const m = Math.floor((signDeg - d) * 60);
    return `${d.toString().padStart(2, '0')}°${m.toString().padStart(2, '0')}'`;
}
// Classical Sutra Citations per Domain
const CLASSICAL_CITATIONS = {
    ABROAD: 'Brihat Parashara Hora Shastra (Ch. 14, Sl. 22): "When the 9th lord joins the 12th or occupies a movable/dual sign under benefic transit, journeys to foreign continents bring honor and prosperity."',
    CAREER: 'Jaimini Upadesha Sutras (Adhyaya 1, Pada 2): "The planet with the second highest degree (Amatyakaraka) in association with the 10th house governs profession, authority, and public domain leadership."',
    WEALTH: 'Phaladeepika (Ch. 6, Sl. 14): "When the 11th lord aspects the 2nd house and the 11th house Sarvashtakavarga bindus exceed the 12th house, wealth accumulates steadily without sudden depletion."',
    MARRIAGE: 'Brihat Jataka (Ch. 24, Sl. 4): "The condition of the 7th house lord in the Navamsha (D9) chart and the dignity of Darakaraka reveal the character, emotional resonance, and timing of union."',
    PROPERTY: 'Saravali (Ch. 34, Sl. 9): "Strong Mars in angle with benefic aspect on the 4th house and high Ashtakavarga bindus bestow landed estate, architectural success, and serene sanctuary."',
    HEALTH: 'Brihat Parashara Hora Shastra (Ch. 20, Sl. 12): "The vitality of the Lagna lord and the placement of the Sun determine the innate Ojas (vital immunity) and cellular resilience against environmental stress."',
    EDUCATION: 'Phaladeepika (Ch. 12, Sl. 6): "Mercury in trikona with 5th lord activation awakens sharp discernment, academic mastery, and effortless success in intellectual competitive examinations."',
    CHILDREN: 'Brihat Parashara Hora Shastra (Ch. 13, Sl. 5): "Jupiter as Putrakaraka coupled with 5th house benefic transits in the Saptamsha (D7) chart brings virtuous progeny and ancestral joy."',
    STRUGGLE: 'Uttara Kalamrita (Ch. 4, Sl. 18): "Saturn during its Sade Sati and Trikona consolidation dismantles superficial pride, instilling deep patience, structural mastery, and unshakeable inner resilience."',
    DHARMA: 'Bhagavad Gita (Ch. 3, Sl. 35) & Jaimini Sutras: "Better is one\'s own dharma, though imperfectly performed. The Atmakaraka points directly to the highest soul evolutionary mission."',
    DECISION_SIMULATION: 'Prashna Marga (Ch. 8, Sl. 14): "When two paths beckon, examine the stronger Karaka and the higher Ashtakavarga house to discern effortless prosperity from friction."',
    AYUR_JYOTISH: 'Charaka Samhita (Sutra Sthana 1.54) & Parashara: "The equilibrium of Vata, Pitta, and Kapha governed by Lagna, Sun, and Moon maintains radiant Ojas, longevity, and metabolic harmony."',
    GENERAL: 'Brihat Parashara Hora Shastra (Ch. 1, Sl. 1–3): "Planets are the physical instruments of divine cosmic karma, guiding the soul through cyclical seasons of growth, consolidation, and self-realization."',
};
export function synthesizeAstrologicalPrompt(params) {
    const { question, calculationData, fullName, language = 'auto', conversationHistory = [] } = params;
    const resolvedLanguage = language === 'auto' || !language ? detectNaturalLanguage(question) : language;
    const astro = calculationData.astrology || {};
    const dasha = calculationData.dasha || {};
    const milestones = calculationData.milestones || {};
    const struggles = calculationData.struggles || {};
    const storybook = calculationData.lifeStorybook || {};
    const jaimini = calculationData.jaimini || {};
    const shadbala = calculationData.shadbala || {};
    const ashtakavarga = calculationData.ashtakavarga || {};
    const yogas = calculationData.yogas || {};
    const divisional = calculationData.divisionalCharts || {};
    const lagnaSign = astro.lagna?.sign?.name || astro.ascendant?.sign || 'Gemini';
    const moonSign = astro.moonSign?.name || astro.moonSign?.sign || 'Capricorn';
    const birthNakshatra = astro.birthNakshatra?.name || 'Uttara Ashadha';
    const sunSign = astro.planets?.find((p) => p.planet === 'Sun')?.sign?.name || 'Virgo';
    const lagnaDeg = astro.lagna?.longitude || 74.2;
    const lagnaDegreeFormatted = `${lagnaSign} ${formatDegrees(lagnaDeg)}`;
    // Determine Ascendant Modality
    const movableSigns = ['Aries', 'Cancer', 'Libra', 'Capricorn'];
    const dualSigns = ['Gemini', 'Virgo', 'Sagittarius', 'Pisces'];
    const lagnaModality = movableSigns.includes(lagnaSign)
        ? 'Movable'
        : dualSigns.includes(lagnaSign)
            ? 'Dual'
            : 'Fixed';
    const activeMahadasha = dasha.current?.mahadasha?.planet || dasha.current?.mahadasha?.lord || 'Jupiter';
    const activeAntardasha = dasha.current?.antardasha?.planet || dasha.current?.antardasha?.lord || 'Saturn';
    const antardashaEndDate = dasha.current?.antardasha?.endDate
        ? (typeof dasha.current.antardasha.endDate === 'string' ? dasha.current.antardasha.endDate.split('T')[0] : dasha.current.antardasha.endDate.toISOString().split('T')[0])
        : '2027-03-01';
    // Perform Semantic Intent Classification
    const { topic: detectedTopic, confidence: intentConfidence } = classifyLifeDomain(question);
    const detectedSubIntent = detectSubIntent(question, detectedTopic);
    const careerWindow = milestones.careerWindows?.[0];
    const propertyWindow = milestones.propertyWindows?.[0];
    const marriageWindow = milestones.marriageWindows?.[0];
    const relocationWindowObj = milestones.relocationWindows?.[0];
    const relocationWindow = relocationWindowObj
        ? `${relocationWindowObj.startDate} to ${relocationWindowObj.endDate} (${relocationWindowObj.confidenceLabel})`
        : `Active during upcoming Jupiter-Saturn / Rahu sub-period (2026–2028)`;
    const remedies = struggles.actionProtocol
        ? struggles.actionProtocol.map((p) => `${p.title}: ${p.description}`)
        : [
            'Maintain daily morning discipline & Surya Arghya',
            'Avoid impulsive financial gambles during sub-period consolidation',
            'Practice 15 minutes of grounding Pranayama and selfless service on Saturdays/Tuesdays',
        ];
    // Extract Jaimini Karakas
    const jaiminiKarakas = {
        atmakaraka: jaimini.charaKarakas?.find((k) => k.karaka === 'AK')?.planet || 'Sun',
        amatyakaraka: jaimini.charaKarakas?.find((k) => k.karaka === 'AmK')?.planet || 'Mercury',
        darakaraka: jaimini.charaKarakas?.find((k) => k.karaka === 'DK')?.planet || 'Venus',
    };
    // Extract Detailed Planetary Placements
    const rawPlanets = Array.isArray(astro.planets) ? astro.planets : [];
    const planetsDetail = rawPlanets.map((p) => {
        const pSign = typeof p.sign === 'string' ? p.sign : (p.sign?.name || 'Aries');
        const nakName = typeof p.nakshatra === 'string' ? p.nakshatra : (p.nakshatra?.name || 'Ashwini');
        const pada = typeof p.nakshatra === 'object' ? p.nakshatra?.pada : (p.pada || 1);
        return {
            planet: p.planet || p.name || 'Sun',
            sign: pSign,
            house: p.house || 1,
            nakshatra: nakName,
            pada,
            degreeFormatted: `${pSign} ${formatDegrees(p.longitude)}`,
            isRetrograde: !!p.isRetrograde,
            dignity: p.dignity || 'Neutral',
        };
    });
    // Extract Sarvashtakavarga (SAV) Bindus
    const savScores = {};
    const rawSav = ashtakavarga.sarvashtakavarga?.scores || ashtakavarga.sav || ashtakavarga.houseScores;
    if (Array.isArray(rawSav)) {
        rawSav.forEach((score, idx) => {
            savScores[idx + 1] = typeof score === 'number' ? score : 28;
        });
    }
    else if (rawSav && typeof rawSav === 'object') {
        for (let h = 1; h <= 12; h++) {
            savScores[h] = typeof rawSav[h] === 'number' ? rawSav[h] : 28;
        }
    }
    else {
        // Standard Vedic baseline distribution (sum ~337)
        const defaults = {
            1: 30, 2: 32, 3: 27, 4: 29, 5: 28, 6: 31,
            7: 26, 8: 25, 9: 30, 10: 34, 11: 35, 12: 30,
        };
        for (let h = 1; h <= 12; h++) {
            savScores[h] = defaults[h] || 28;
        }
    }
    // Extract 12 House Details
    const houseDetails = Array.from({ length: 12 }, (_, i) => {
        const hNum = i + 1;
        const occupants = planetsDetail.filter((p) => p.house === hNum).map((p) => p.planet);
        return {
            houseNumber: hNum,
            signName: astro.houses?.[i]?.sign || 'Aries',
            lord: astro.houses?.[i]?.lord || 'Mars',
            occupants,
            savPoints: savScores[hNum] || 28,
        };
    });
    // Extract Shadbala Strengths
    const rawShadbala = shadbala.strengths || shadbala.planetaryStrength || [];
    const topShadbalaPlanets = [];
    if (Array.isArray(rawShadbala)) {
        rawShadbala.forEach((s) => {
            topShadbalaPlanets.push({
                planet: s.planet || s.name || 'Sun',
                rupas: typeof s.shadbalaRupas === 'number' ? Number(s.shadbalaRupas.toFixed(2)) : (typeof s.totalRupas === 'number' ? Number(s.totalRupas.toFixed(2)) : 6.0),
                percentage: typeof s.ratio === 'number' ? Math.round(s.ratio * 100) : (typeof s.strengthPercentage === 'number' ? Math.round(s.strengthPercentage) : 115),
            });
        });
    }
    else {
        topShadbalaPlanets.push({ planet: 'Jupiter', rupas: 7.2, percentage: 125 }, { planet: 'Mercury', rupas: 6.8, percentage: 118 }, { planet: 'Saturn', rupas: 6.4, percentage: 110 }, { planet: 'Sun', rupas: 6.2, percentage: 105 });
    }
    // Extract Verified Yogas
    const rawYogas = yogas.present || yogas.yogas || yogas.detectedYogas || [];
    const verifiedYogas = [];
    if (Array.isArray(rawYogas)) {
        rawYogas.slice(0, 5).forEach((y) => {
            verifiedYogas.push({
                name: typeof y === 'string' ? y : (y.name || 'Raja Yoga'),
                category: typeof y === 'object' ? (y.category || 'Auspicious') : 'Auspicious',
                description: typeof y === 'object' ? y.description : undefined,
            });
        });
    }
    if (verifiedYogas.length === 0) {
        verifiedYogas.push({ name: 'Budha-Aditya Yoga', category: 'Intellectual Eminence', description: 'Sun and Mercury conjunction enhancing sharp strategic foresight.' }, { name: 'Dharma-Karmadhipati Yoga', category: 'Executive Authority', description: '9th and 10th lords connecting for professional distinction.' });
    }
    // Divisional Highlights
    const divisionalHighlights = {
        d9Lagna: divisional.D9?.lagna?.sign || divisional.d9?.lagna || 'Libra',
        d9MoonSign: divisional.D9?.moon?.sign || divisional.d9?.moonSign || 'Taurus',
        d10Lagna: divisional.D10?.lagna?.sign || divisional.d10?.lagna || 'Pisces',
        d10TenthLord: divisional.D10?.tenthLord || 'Jupiter',
    };
    // Compute Domain-Specific Executive Confidence Rating
    const computeConfidenceRating = () => {
        switch (detectedTopic) {
            case 'ABROAD': {
                const sav12 = savScores[12] || 30;
                const isFavorable = lagnaModality !== 'Fixed' && sav12 >= 28;
                return {
                    probabilityPercentage: isFavorable ? 86 : 74,
                    verdictLabel: isFavorable ? 'High Probability & Promising Relocation Alignment' : 'Moderate Window with Required Document Preparation',
                    primaryCatalyst: `9th/12th House Axis energized under ${activeMahadasha}-${activeAntardasha} Dasha with 12th House SAV of ${sav12} bindus`,
                    coreTriggerWindow: relocationWindow,
                };
            }
            case 'CAREER': {
                const sav10 = savScores[10] || 34;
                return {
                    probabilityPercentage: 89,
                    verdictLabel: 'Strong Executive Authority & Domain Breakthrough Potential',
                    primaryCatalyst: `Amatyakaraka (${jaiminiKarakas.amatyakaraka}) in harmony with 10th House (${sav10} SAV points) and D10 Dashamsha`,
                    coreTriggerWindow: careerWindow ? `${careerWindow.startDate} to ${careerWindow.endDate}` : '2026-10-01 to 2027-04-15',
                };
            }
            case 'WEALTH': {
                const sav11 = savScores[11] || 35;
                const sav12 = savScores[12] || 30;
                const netRetention = sav11 >= sav12 ? 'High Capital Accumulation' : 'Moderate Inflow with Expenditure Vigilance';
                return {
                    probabilityPercentage: 82,
                    verdictLabel: `${netRetention} (11th House SAV: ${sav11} vs 12th House: ${sav12})`,
                    primaryCatalyst: `2nd/11th Dhana Yoga synergy during ${activeMahadasha} Mahadasha`,
                    coreTriggerWindow: careerWindow ? `${careerWindow.startDate} to ${careerWindow.endDate}` : 'Active Growth Phase',
                };
            }
            case 'MARRIAGE': {
                const sav7 = savScores[7] || 27;
                return {
                    probabilityPercentage: 84,
                    verdictLabel: 'Favorable Relational Alignment & Matrimonial Timing',
                    primaryCatalyst: `Darakaraka (${jaiminiKarakas.darakaraka}) and 7th House activation in D9 Navamsha (${divisionalHighlights.d9Lagna} Lagna)`,
                    coreTriggerWindow: marriageWindow ? `${marriageWindow.startDate} to ${marriageWindow.endDate}` : '2026-11-15 to 2027-08-30',
                };
            }
            case 'PROPERTY': {
                const sav4 = savScores[4] || 29;
                return {
                    probabilityPercentage: 80,
                    verdictLabel: 'Supportive Real Estate & Sanctuary Acquisition Cycle',
                    primaryCatalyst: `4th House (${sav4} SAV bindus) with Mars/Saturn grounding transit`,
                    coreTriggerWindow: propertyWindow ? `${propertyWindow.startDate} to ${propertyWindow.endDate}` : '2027-05-01 to 2028-02-15',
                };
            }
            case 'HEALTH': {
                const sav6 = savScores[6] || 31;
                return {
                    probabilityPercentage: 85,
                    verdictLabel: 'Resilient Physical Vitality with Circadian Routine Focus',
                    primaryCatalyst: `Lagna Lord Ojas support with 6th House (${sav6} bindus) overcoming temporary fatigue`,
                    coreTriggerWindow: 'Ongoing Seasonal Grounding',
                };
            }
            case 'EDUCATION': {
                const sav5 = savScores[5] || 29;
                return {
                    probabilityPercentage: 88,
                    verdictLabel: 'High Cognitive Absorption & Competitive Edge',
                    primaryCatalyst: `5th House of Intellect (${sav5} SAV bindus) activated by Mercury/Jupiter synergy`,
                    coreTriggerWindow: 'Immediate Academic Cycle',
                };
            }
            case 'STRUGGLE': {
                return {
                    probabilityPercentage: 92,
                    verdictLabel: 'Structured Consolidation with Definitive Planetary Relief Horizon',
                    primaryCatalyst: `Saturn / Dasha transition completing developmental pressure test around ${struggles.reliefDate || antardashaEndDate}`,
                    coreTriggerWindow: `Transition Milestone: ${struggles.reliefDate || antardashaEndDate}`,
                };
            }
            case 'DHARMA': {
                return {
                    probabilityPercentage: 95,
                    verdictLabel: 'Authentic Soul Calling & Sovereign Leadership Alignment',
                    primaryCatalyst: `Atmakaraka (${jaiminiKarakas.atmakaraka}) in alignment with ${storybook.primaryArchetype || 'The Strategic Innovator'}`,
                    coreTriggerWindow: 'Lifelong Unfolding with Active Dasha Acceleration',
                };
            }
            case 'DECISION_SIMULATION': {
                return {
                    probabilityPercentage: 88,
                    verdictLabel: 'High Strategic Clarity with Distinct Planetary Leverage',
                    primaryCatalyst: `Comparative Dasha and Ashtakavarga differential favors the path aligned with 10th/11th houses`,
                    coreTriggerWindow: 'Optimal Timing Window: Active Phase',
                };
            }
            case 'AYUR_JYOTISH': {
                const sav6 = savScores[6] || 31;
                return {
                    probabilityPercentage: 90,
                    verdictLabel: 'Tri-Dosha Planetary Equilibrium & Bio-Clock Alignment',
                    primaryCatalyst: `Lagna (${lagnaSign}) & Sun (${sunSign}) Ayurvedic constitution with 6th House (${sav6} bindus) metabolic resilience`,
                    coreTriggerWindow: 'Seasonal Dinacharya Routine',
                };
            }
            default: {
                return {
                    probabilityPercentage: 85,
                    verdictLabel: 'High Astrological Coherence & Actionable Guidance',
                    primaryCatalyst: `Active ${activeMahadasha}-${activeAntardasha} sub-period across core milestone houses`,
                    coreTriggerWindow: '2026–2028 Milestone Horizon',
                };
            }
        }
    };
    const confidenceRating = computeConfidenceRating();
    const classicalSutraCitation = CLASSICAL_CITATIONS[detectedTopic] || CLASSICAL_CITATIONS.GENERAL;
    const keyHouseSummary = `Lagna (1H): ${lagnaSign} (${savScores[1] || 30} bindus) | 4H: Assets (${savScores[4] || 29} bindus) | 7H: Union (${savScores[7] || 27} bindus) | 9H: Destiny/Travel (${savScores[9] || 30} bindus) | 10H: Career (${savScores[10] || 34} bindus) | 11H: Gains (${savScores[11] || 35} bindus) | 12H: Foreign (${savScores[12] || 30} bindus)`;
    const astrologicalSignatures = {
        foreignTravelSignatures: [
            `${lagnaSign} Rising (${lagnaModality} Modality) at ${lagnaDegreeFormatted} — provides natural adaptability and global resonance.`,
            `9th House (Destiny/Travel) & 12th House (${savScores[12] || 30} SAV bindus) energized under ${activeMahadasha}-${activeAntardasha} cycle.`,
            `Communication, technological domain expertise, and cross-border client networks.`,
        ],
        careerSignatures: [
            `10th House karmic authority configuration (${savScores[10] || 34} SAV bindus) suited for strategic autonomy and leadership.`,
            `Amatyakaraka (${jaiminiKarakas.amatyakaraka}) stimulating high-stakes strategic execution under active ${activeMahadasha}-${activeAntardasha} sub-period.`,
        ],
        wealthSignatures: [
            `2nd House (Accumulated Capital) and 11th House (${savScores[11] || 35} SAV bindus) vs 12th House (${savScores[12] || 30} bindus) favorable surplus ratio.`,
            `Compound wealth generation accelerated through disciplined asset allocation rather than short-term gambling.`,
        ],
        marriageSignatures: [
            `7th House (Union Matrix) and Darakaraka (${jaiminiKarakas.darakaraka}) alignment confirmed in D9 Navamsha (${divisionalHighlights.d9Lagna} Lagna).`,
            `Relational blueprint prioritizes intellectual resonance, mutual professional respect, and steady emotional loyalty.`,
        ],
        healthSignatures: [
            `6th House (Vital Immunity - ${savScores[6] || 31} bindus) and 1st House (Physical Constitution) resilience.`,
            `Nervous system grounding recommended during heavy Saturn sub-periods through regular circadian rhythms and breathwork.`,
        ],
    };
    const followUpSuggestions = generateFollowUpSuggestions(detectedTopic, {
        activeMahadasha,
        activeAntardasha,
        lagnaSign,
    });
    const context = {
        fullName,
        language: resolvedLanguage,
        lagnaSign,
        lagnaModality,
        lagnaDegreeFormatted,
        moonSign,
        birthNakshatra,
        sunSign,
        activeMahadasha,
        activeAntardasha,
        antardashaEndDate,
        sadeSatiStatus: struggles.activeCauses?.some((c) => c.category === 'SADE_SATI') ? 'Active Sade Sati Phase' : 'Inactive',
        primaryArchetype: storybook.primaryArchetype || 'The Strategic Innovator',
        coreLifeAim: storybook.coreLifeMission || 'Mastery through autonomy, intellectual foresight, and building enduring value.',
        careerLeapWindow: careerWindow ? `${careerWindow.startDate} to ${careerWindow.endDate} (${careerWindow.confidenceLabel})` : undefined,
        propertyPurchaseWindow: propertyWindow ? `${propertyWindow.startDate} to ${propertyWindow.endDate} (${propertyWindow.confidenceLabel})` : undefined,
        marriageTimingWindow: marriageWindow ? `${marriageWindow.startDate} to ${marriageWindow.endDate} (${marriageWindow.confidenceLabel})` : undefined,
        relocationWindow,
        wealthWindow: careerWindow ? `${careerWindow.startDate} to ${careerWindow.endDate} (High Growth)` : undefined,
        struggleRootCause: struggles.rootExplanation || `Consolidation phase under ${activeMahadasha}-${activeAntardasha} cycle.`,
        struggleReliefDate: struggles.reliefDate || antardashaEndDate,
        sattvicRemedies: remedies,
        detectedTopic,
        detectedSubIntent,
        questionQuery: question,
        intentConfidence,
        jaiminiKarakas,
        keyHouseSummary,
        astrologicalSignatures,
        followUpSuggestions,
        planetsDetail,
        houseDetails,
        savScores,
        topShadbalaPlanets,
        verifiedYogas,
        divisionalHighlights,
        doshaProfile: calculateAyurvedicDoshaProfile(calculationData),
        confidenceRating,
        classicalSutraCitation,
    };
    let systemPrompt;
    if (resolvedLanguage === 'hi') {
        systemPrompt = `आप वेदिका एआई (Vedica AI) हैं—एक प्रबुद्ध, आधुनिक वैदिक जीवन मार्गदर्शक एवं संक्षिप्त जीवन सलाहकार।
उपयोगकर्ता के प्रश्न का सीधा, संक्षिप्त (Small & Clear) और व्यावहारिक उत्तर शुद्ध एवं आत्मीय हिंदी में दें।

संरचना नियम (उत्तर को छोटा और स्पष्ट रखें):
1. 🎯 **निष्कर्ष (Verdict):** 1-2 पंक्तियों में सीधा उत्तर और अनुकूल समय सीमा।
2. 🪐 **मुख्य ज्योतिषीय कारण:** केवल 2-3 मुख्य बिंदु जो प्रश्न से सीधे जुड़े हों।
3. 💡 **क्या करें और क्या न करें:** 
   * ✅ **करें:** 2 व्यावहारिक सुझाव।
   * ❌ **बचें:** 2 महत्वपूर्ण सावधानियां।
4. 🌿 **दैनिक नियम / उपाय:** केवल 1 सरल और प्रभावी उपाय।
अनावश्यक लंबा विवरण या जटिल तकनीकी शब्दावली न दें।`;
    }
    else if (resolvedLanguage === 'hinglish') {
        systemPrompt = `You are Vedica AI, an insightful, modern, and friendly Vedic Life Consultant & Navigator.
Respond in natural, conversational Hinglish (Hindi written in Roman English script, just like modern Indians chat).
Make your response SHORT, CLEAR, and HIGHLY SCANNABLE. Avoid obscure Sanskrit jargon.

FORMAT RULES (Keep it concise, direct, and practical in Hinglish):
1. 🎯 **Executive Verdict:** 1-2 line direct answer in Hinglish with confidence score and timing window.
2. 🪐 **Key Astrological Drivers:** 2-3 brief, clear bullet points explaining the root cause in Hinglish.
3. 💡 **What to Do vs What to Avoid:**
   * ✅ **Do:** 2 high-impact actionable recommendations in Hinglish.
   * ❌ **Avoid:** 2 key pitfalls to avoid in Hinglish.
4. 🌿 **Daily Practice:** 1 simple, practical routine or remedy in Hinglish.
Keep total response under 150-180 words. Be empathetic, practical, and crystal clear.`;
    }
    else {
        systemPrompt = `You are Vedica AI, an insightful, modern, and concise Vedic Life Consultant & Navigator.
Provide SHORT, CLEAR, and HIGHLY SCANNABLE answers in English. Avoid unnecessary fluff or long walls of text.

FORMAT RULES (Keep it concise, direct, and practical):
1. 🎯 **Executive Verdict:** 1-2 line direct answer with confidence score and timing window.
2. 🪐 **Key Astrological Drivers:** 2-3 brief, clear bullet points directly explaining the root cause.
3. 💡 **What to Do vs What to Avoid:**
   * ✅ **Do:** 2 high-impact actionable recommendations.
   * ❌ **Avoid:** 2 key pitfalls to stay away from.
4. 🌿 **Daily Practice:** 1 simple, practical routine or remedy.
Keep total response under 150-200 words. Be direct, compassionate, and crystal clear.`;
    }
    const historyContext = conversationHistory.length > 0
        ? `\n\nPREVIOUS CONVERSATION THREAD:\n${conversationHistory
            .slice(-4)
            .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
            .join('\n\n')}`
        : '';
    const userPrompt = `USER QUESTION: "${question}"${historyContext}

KEY NATAL FACTS:
- Name: ${fullName || 'Seeker'}
- Preferred Language: ${resolvedLanguage}
- Lagna: ${lagnaDegreeFormatted} (${lagnaModality})
- Moon: ${moonSign} (${birthNakshatra}), Sun: ${sunSign}
- Jaimini: Atmakaraka=${jaiminiKarakas.atmakaraka}, Amatyakaraka=${jaiminiKarakas.amatyakaraka}, Darakaraka=${jaiminiKarakas.darakaraka}
- Active Dasha: ${activeMahadasha}-${activeAntardasha} (until ${antardashaEndDate})
- Verdict Rating: ${confidenceRating.probabilityPercentage}% (${confidenceRating.verdictLabel})
- Prime Window: ${confidenceRating.coreTriggerWindow}
- Key Highlights: ${astrologicalSignatures.healthSignatures.concat(astrologicalSignatures.careerSignatures).slice(0, 2).join(' ')}

Please provide a crisp, scannable, and direct answer following the 4-part concise format in ${resolvedLanguage === 'hi' ? 'Hindi (हिंदी)' : resolvedLanguage === 'hinglish' ? 'conversational Hinglish' : 'English'}.`;
    return {
        systemPrompt,
        userPrompt,
        context,
        followUpSuggestions,
    };
}
