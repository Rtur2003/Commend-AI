import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../contexts/LanguageContext';

const SEOHead = () => {
  const { currentLanguage, t } = useLanguage();
  
  const seoData = {
    en: {
      title: "CommendAI - AI-Powered YouTube Comment Generator | Smart Comments for Every Video",
      description: "Generate engaging, authentic YouTube comments instantly with AI. CommendAI creates personalized comments in multiple languages for any video. Free AI comment generator for content creators and viewers.",
      keywords: "YouTube comments, AI comment generator, automatic comments, YouTube engagement, AI writing tool, comment bot, YouTube automation, video comments, social media tools, content creation",
      locale: "en_US",
      lang: "en"
    },
    tr: {
      title: "CommendAI - Yapay Zeka ile YouTube Yorum Üretici | Her Video için Akıllı Yorumlar",
      description: "Yapay zeka ile anında ilgi çekici, özgün YouTube yorumları oluşturun. CommendAI her video için çok dilli kişiselleştirilmiş yorumlar oluşturur. İçerik üreticileri ve izleyiciler için ücretsiz AI yorum üretici.",
      keywords: "YouTube yorumları, AI yorum üretici, otomatik yorumlar, YouTube etkileşimi, AI yazı aracı, yorum botu, YouTube otomasyonu, video yorumları, sosyal medya araçları, içerik üretimi",
      locale: "tr_TR", 
      lang: "tr"
    },
    ru: {
      title: "CommendAI - Генератор комментариев YouTube на основе ИИ | Умные комментарии для любого видео",
      description: "Мгновенно создавайте увлекательные, аутентичные комментарии YouTube с помощью ИИ. CommendAI создает персонализированные комментарии на нескольких языках для любого видео. Бесплатный генератор комментариев ИИ.",
      keywords: "комментарии YouTube, генератор комментариев ИИ, автоматические комментарии, вовлечение YouTube, инструмент письма ИИ, бот комментариев, автоматизация YouTube, комментарии к видео, инструменты социальных сетей",
      locale: "ru_RU",
      lang: "ru"
    },
    zh: {
      title: "CommendAI - AI驱动的YouTube评论生成器 | 为每个视频提供智能评论",
      description: "使用AI即时生成引人入胜的、真实的YouTube评论。CommendAI为任何视频创建多语言个性化评论。为内容创作者和观众提供的免费AI评论生成器。",
      keywords: "YouTube评论, AI评论生成器, 自动评论, YouTube参与度, AI写作工具, 评论机器人, YouTube自动化, 视频评论, 社交媒体工具, 内容创作",
      locale: "zh_CN",
      lang: "zh"
    },
    ja: {
      title: "CommendAI - AI搭載YouTubeコメント生成器 | すべての動画に対応するスマートコメント",
      description: "AIで魅力的で本格的なYouTubeコメントを瞬時に生成。CommendAIは任意の動画に対して多言語の個人化されたコメントを作成します。コンテンツクリエイターと視聴者向けの無料AIコメント生成器。",
      keywords: "YouTubeコメント, AIコメント生成器, 自動コメント, YouTubeエンゲージメント, AI執筆ツール, コメントボット, YouTube自動化, 動画コメント, ソーシャルメディアツール, コンテンツ作成",
      locale: "ja_JP",
      lang: "ja"
    }
  };
  
  const currentSEO = seoData[currentLanguage] || seoData.en;
  
  return (
    <Helmet>
      {/* Basic SEO */}
      <html lang={currentSEO.lang} />
      <title>{currentSEO.title}</title>
      <meta name="description" content={currentSEO.description} />
      <meta name="keywords" content={currentSEO.keywords} />
      <meta name="author" content="Hasan Arthur Altuntaş" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href="https://commend-ai.vercel.app/" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://commend-ai.vercel.app/" />
      <meta property="og:title" content={currentSEO.title} />
      <meta property="og:description" content={currentSEO.description} />
      <meta property="og:image" content="https://commend-ai.vercel.app/logo512.png" />
      <meta property="og:site_name" content="CommendAI" />
      <meta property="og:locale" content={currentSEO.locale} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://commend-ai.vercel.app/" />
      <meta property="twitter:title" content={currentSEO.title} />
      <meta property="twitter:description" content={currentSEO.description} />
      <meta property="twitter:image" content="https://commend-ai.vercel.app/logo512.png" />
      <meta property="twitter:creator" content="@commendai" />
      
      {/* Additional Meta Tags */}
      <meta name="application-name" content="CommendAI" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="CommendAI" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="msapplication-TileColor" content="#18D2BB" />
      <meta name="msapplication-tap-highlight" content="no" />
      <meta name="theme-color" content="#18D2BB" />
      
      {/* Alternate Language Links */}
      <link rel="alternate" hrefLang="en" href="https://commend-ai.vercel.app/?lang=en" />
      <link rel="alternate" hrefLang="tr" href="https://commend-ai.vercel.app/?lang=tr" />
      <link rel="alternate" hrefLang="ru" href="https://commend-ai.vercel.app/?lang=ru" />
      <link rel="alternate" hrefLang="zh" href="https://commend-ai.vercel.app/?lang=zh" />
      <link rel="alternate" hrefLang="ja" href="https://commend-ai.vercel.app/?lang=ja" />
      <link rel="alternate" hrefLang="x-default" href="https://commend-ai.vercel.app/" />
      
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "CommendAI",
          "description": currentSEO.description,
          "url": "https://commend-ai.vercel.app/",
          "author": {
            "@type": "Person",
            "name": "Hasan Arthur Altuntaş"
          },
          "applicationCategory": "ProductivityApplication",
          "operatingSystem": "Web Browser",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "150"
          },
          "featureList": [
            "AI-powered comment generation",
            "Multi-language support", 
            "YouTube integration",
            "Spam prevention",
            "Comment history tracking"
          ],
          "inLanguage": currentSEO.lang,
          "availableLanguage": ["en", "tr", "ru", "zh", "ja"]
        })}
      </script>
    </Helmet>
  );
};

export default SEOHead;