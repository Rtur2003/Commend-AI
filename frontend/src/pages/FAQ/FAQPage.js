import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EnhancedSEOHead from '../../shared/components/seo/EnhancedSEOHead';
import { useLanguage } from '../../contexts/LanguageContext';
import '../../styles/main.css';

const FAQPage = () => {
  // const { t } = useLanguage(); // TODO: Add translations if needed
  const [openIndex, setOpenIndex] = useState(0);

  const faqData = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "What is CommendAI and how does it work?",
          answer: "CommendAI is an advanced AI-powered tool that generates engaging YouTube comments automatically. It analyzes video content, titles, descriptions, and existing comments to create contextually relevant and natural-sounding comments. Simply paste a YouTube URL, select your preferred language, and get instant comment suggestions."
        },
        {
          question: "Is CommendAI completely free to use?",
          answer: "Yes! CommendAI is 100% free to use with no hidden costs, subscription fees, or usage limits. You can generate unlimited comments for any YouTube video without creating an account or providing payment information."
        },
        {
          question: "Do I need to create an account to use CommendAI?",
          answer: "No account creation is required! You can start generating comments immediately. However, we do track your comment history locally in your browser for your convenience, so you can revisit previously generated comments."
        }
      ]
    },
    {
      category: "Features & Capabilities",
      questions: [
        {
          question: "What languages does CommendAI support?",
          answer: "CommendAI supports 5 major languages: English, Turkish, Russian, Chinese (Simplified), and Japanese. Each language model is trained to understand cultural context and produce native-level quality comments with appropriate expressions and idioms."
        },
        {
          question: "How accurate and relevant are the generated comments?",
          answer: "Our AI achieves 90%+ relevance accuracy by analyzing multiple video elements: title, description, transcript (when available), existing comments, and channel context. Comments are designed to feel natural and contextually appropriate to the video content."
        },
        {
          question: "Can I customize the style or tone of generated comments?",
          answer: "Yes! CommendAI offers multiple comment styles including casual, professional, enthusiastic, analytical, and humorous tones. The AI adapts its language patterns and expressions to match your selected style while maintaining relevance to the video."
        },
        {
          question: "Does CommendAI work with all types of YouTube videos?",
          answer: "CommendAI works with most public YouTube videos including tutorials, vlogs, music videos, gaming content, educational videos, and entertainment content. However, it may not work with private videos, age-restricted content, or videos with disabled comments."
        }
      ]
    },
    {
      category: "Technical Questions",
      questions: [
        {
          question: "How fast is the comment generation process?",
          answer: "Comment generation typically takes 3-8 seconds depending on video complexity and server load. Our optimized AI models and cloud infrastructure ensure consistently fast performance while maintaining high-quality output."
        },
        {
          question: "Can I post comments directly to YouTube through CommendAI?",
          answer: "Yes! CommendAI offers direct YouTube integration. You can either post comments directly through our secure YouTube API connection or copy the generated comments for manual posting. Direct posting requires YouTube authentication for security."
        },
        {
          question: "What happens if the video URL doesn't work?",
          answer: "If a video URL fails, CommendAI provides specific error messages: invalid URL format, video not found, private/restricted video, or regional restrictions. The tool includes URL validation and suggests corrections for common formatting issues."
        },
        {
          question: "Is there a limit to how many comments I can generate?",
          answer: "There are no hard limits on comment generation. However, to ensure quality service for all users, we implement fair usage policies during peak times. For typical use (under 100 comments per hour), you won't encounter any restrictions."
        }
      ]
    },
    {
      category: "Privacy & Security",
      questions: [
        {
          question: "What data does CommendAI collect and store?",
          answer: "CommendAI collects minimal data: generated comments (stored locally in your browser), video URLs for processing, and anonymous usage statistics. We do NOT store personal information, YouTube credentials, or browsing history. All data processing follows GDPR compliance standards."
        },
        {
          question: "Is my YouTube account information safe?",
          answer: "Absolutely! When using direct posting features, authentication is handled through YouTube's official OAuth system. CommendAI never stores your YouTube credentials or personal account information. All connections are encrypted and secure."
        },
        {
          question: "Can I delete my comment history?",
          answer: "Yes! Your comment history is stored locally in your browser. You can clear it anytime through your browser settings or using the clear history button in CommendAI. We also provide export options before deletion."
        }
      ]
    },
    {
      category: "Troubleshooting",
      questions: [
        {
          question: "Why did comment generation fail?",
          answer: "Common reasons include: invalid YouTube URL, video restrictions (private/age-restricted), network connectivity issues, or temporary server load. Try refreshing the page, checking your internet connection, or using a different video URL."
        },
        {
          question: "The generated comment doesn't match the video content. What should I do?",
          answer: "Occasionally, AI may miss context due to limited video information or unclear content. Try regenerating the comment, or manually edit the output. You can also report inaccurate results to help improve our AI models."
        },
        {
          question: "Can I use CommendAI on mobile devices?",
          answer: "Yes! CommendAI is fully responsive and works seamlessly on smartphones, tablets, and desktop computers. The mobile experience is optimized for touch interfaces with the same powerful features as the desktop version."
        },
        {
          question: "What browsers are supported?",
          answer: "CommendAI works on all modern browsers including Chrome, Firefox, Safari, Edge, and Opera. We recommend using the latest browser versions for optimal performance and security. Internet Explorer is not supported."
        }
      ]
    },
    {
      category: "Best Practices",
      questions: [
        {
          question: "How can I make the most effective use of CommendAI?",
          answer: "For best results: 1) Use clear, descriptive video URLs, 2) Select the appropriate language and tone, 3) Review and personalize generated comments, 4) Consider the video's context and audience, 5) Use diverse comment styles to maintain authenticity."
        },
        {
          question: "Should I always post AI-generated comments as-is?",
          answer: "We recommend reviewing and potentially customizing generated comments to match your personal voice and add authentic touches. While our AI produces high-quality content, adding personal insights or experiences enhances authenticity and engagement."
        },
        {
          question: "How can content creators benefit from CommendAI?",
          answer: "Content creators can use CommendAI to: engage with their audience more effectively, respond to comments on their videos, participate in community discussions, analyze successful comment patterns, and maintain consistent engagement across multiple channels."
        }
      ]
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div className="page-container">
      <EnhancedSEOHead
        title="Frequently Asked Questions - CommendAI"
        description="Get answers to common questions about CommendAI. Learn how our AI YouTube comment generator works, features, privacy policies, and troubleshooting tips."
        keywords={['CommendAI FAQ', 'YouTube comment generator help', 'AI comment tool questions', 'CommendAI support', 'how to use CommendAI']}
        url="/faq"
        section="FAQ"
      />

      <motion.div
        className="container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <header className="page-header">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            ❓ Frequently Asked Questions
          </motion.h1>
          <motion.p
            className="page-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Everything you need to know about CommendAI and how to use it effectively.
          </motion.p>
        </header>

        <div className="faq-container">
          {faqData.map((category, categoryIndex) => (
            <motion.section
              key={categoryIndex}
              className="faq-category"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
            >
              <h2 className="category-title">{category.category}</h2>
              
              <div className="faq-list">
                {category.questions.map((faq, questionIndex) => {
                  const globalIndex = categoryIndex * 100 + questionIndex;
                  const isOpen = openIndex === globalIndex;
                  
                  return (
                    <motion.div
                      key={questionIndex}
                      className={`faq-item ${isOpen ? 'open' : ''}`}
                      layout
                    >
                      <button
                        className="faq-question"
                        onClick={() => toggleFAQ(globalIndex)}
                        aria-expanded={isOpen}
                      >
                        <span>{faq.question}</span>
                        <motion.span
                          className="faq-toggle"
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          ▼
                        </motion.span>
                      </button>
                      
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            className="faq-answer"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="faq-answer-content">
                              <p>{faq.answer}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>
          ))}
        </div>

        <section className="faq-cta">
          <motion.div
            className="cta-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h2>Still Have Questions?</h2>
            <p>Can't find what you're looking for? Try CommendAI now and see how easy it is to use!</p>
            <motion.button
              className="cta-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/'}
            >
              Start Using CommendAI →
            </motion.button>
          </motion.div>
        </section>
      </motion.div>

      {/* FAQ Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqData.flatMap(category =>
            category.questions.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          )
        })}
      </script>
    </div>
  );
};

export default FAQPage;