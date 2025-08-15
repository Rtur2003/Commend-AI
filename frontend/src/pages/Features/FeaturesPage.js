import React from 'react';
import { motion } from 'framer-motion';
import EnhancedSEOHead from '../../shared/components/seo/EnhancedSEOHead';
import { useLanguage } from '../../contexts/LanguageContext';
import '../../styles/main.css';

const FeaturesPage = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: '🤖',
      title: 'AI-Powered Generation',
      description: 'Advanced AI analyzes video content, title, description, and generates contextually relevant comments that feel natural and engaging.',
      benefits: ['Context-aware comments', 'Natural language processing', 'Video content analysis', 'Smart tone matching']
    },
    {
      icon: '🌍',
      title: 'Multi-Language Support',
      description: 'Generate comments in 5 different languages: English, Turkish, Russian, Chinese, and Japanese with native-level fluency.',
      benefits: ['5 language options', 'Native-level quality', 'Cultural context awareness', 'Localized expressions']
    },
    {
      icon: '⚡',
      title: 'Real-Time Generation',
      description: 'Get instant comment suggestions within seconds. Our optimized AI models ensure fast response times without compromising quality.',
      benefits: ['Sub-5 second response', 'Optimized performance', 'Real-time analysis', 'Instant suggestions']
    },
    {
      icon: '📊',
      title: 'Smart Analytics',
      description: 'Track your comment history, analyze engagement patterns, and optimize your YouTube presence with detailed insights.',
      benefits: ['Comment history tracking', 'Engagement analytics', 'Performance insights', 'Usage statistics']
    },
    {
      icon: '🎯',
      title: 'Engagement Optimization',
      description: 'Comments are crafted to maximize engagement, increase likes, and encourage meaningful discussions in video comment sections.',
      benefits: ['Higher engagement rates', 'Quality interactions', 'Discussion starters', 'Community building']
    },
    {
      icon: '🔄',
      title: 'YouTube Integration',
      description: 'Seamlessly post comments directly to YouTube or copy them for manual posting. Full integration with YouTube API.',
      benefits: ['Direct posting capability', 'YouTube API integration', 'One-click sharing', 'Manual copy option']
    },
    {
      icon: '💾',
      title: 'Comment History',
      description: 'Never lose a great comment again. All your generated comments are saved and easily accessible for future reference.',
      benefits: ['Persistent storage', 'Easy access', 'Search functionality', 'Export options']
    },
    {
      icon: '🎨',
      title: 'Custom Styles',
      description: 'Choose from different comment styles and tones to match your personality and brand voice perfectly.',
      benefits: ['Multiple style options', 'Tone customization', 'Brand voice matching', 'Personality reflection']
    },
    {
      icon: '🛡️',
      title: 'Privacy & Security',
      description: 'Your data is secure and private. We do not store personal information and all processing is done securely.',
      benefits: ['No personal data storage', 'Secure processing', 'Privacy compliance', 'Data protection']
    }
  ];

  const useCases = [
    {
      title: 'Content Creators',
      description: 'Boost engagement on your own videos and build community connections.',
      icon: '🎬'
    },
    {
      title: 'Social Media Managers',
      description: 'Manage multiple YouTube channels efficiently with AI-generated comments.',
      icon: '📱'
    },
    {
      title: 'Digital Marketers',
      description: 'Enhance YouTube marketing campaigns with strategic comment placement.',
      icon: '📈'
    },
    {
      title: 'YouTube Enthusiasts',
      description: 'Express yourself better and participate in meaningful video discussions.',
      icon: '💬'
    }
  ];

  return (
    <div className="page-container">
      <EnhancedSEOHead
        title="Features - AI YouTube Comment Generator"
        description="Discover all features of CommendAI: AI-powered comment generation, multi-language support, real-time processing, and YouTube integration. Free online tool for content creators."
        keywords={['AI comment features', 'YouTube tools', 'comment generator features', 'AI writing tools', 'content creation']}
        url="/features"
        section="Features"
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
            🚀 CommendAI Features
          </motion.h1>
          <motion.p 
            className="page-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Discover powerful AI tools designed to enhance your YouTube engagement and content creation experience.
          </motion.p>
        </header>

        <section className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <ul className="feature-benefits">
                {feature.benefits.map((benefit, benefitIndex) => (
                  <li key={benefitIndex}>
                    <span className="benefit-check">✓</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </section>

        <section className="use-cases-section">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Perfect For Every Use Case
          </motion.h2>
          
          <div className="use-cases-grid">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                className="use-case-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              >
                <div className="use-case-icon">{useCase.icon}</div>
                <h4>{useCase.title}</h4>
                <p>{useCase.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="cta-section">
          <motion.div
            className="cta-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h2>Ready to Transform Your YouTube Engagement?</h2>
            <p>Start generating AI-powered comments today. It's free, fast, and incredibly effective.</p>
            <motion.button
              className="cta-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/'}
            >
              Try CommendAI Now →
            </motion.button>
          </motion.div>
        </section>
      </motion.div>
    </div>
  );
};

export default FeaturesPage;