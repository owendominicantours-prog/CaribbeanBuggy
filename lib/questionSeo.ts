import { siteUrl } from './buggyProducts';
import { buggyQuestions, questionPath, questionsPath, type BuggyQuestion, type QuestionLocale } from './buggyQuestions';
import { tripadvisorSchemaReference } from './tripadvisor';

export function questionsCanonical(locale: QuestionLocale) {
  return `${siteUrl}${questionsPath(locale)}`;
}

export function questionCanonical(question: BuggyQuestion, locale: QuestionLocale) {
  return `${siteUrl}${questionPath(question, locale)}`;
}

export function buildQuestionsJsonLd(locale: QuestionLocale) {
  const isEn = locale === 'en';
  const canonical = questionsCanonical(locale);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: isEn ? 'Home' : 'Inicio', item: isEn ? `${siteUrl}/en` : siteUrl },
          { '@type': 'ListItem', position: 2, name: isEn ? 'Buggy questions' : 'Preguntas de buggy', item: canonical },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `${canonical}#faq`,
        name: isEn ? '100 questions about Punta Cana and Bayahibe buggy tours' : '100 preguntas sobre buggy en Punta Cana y Bayahibe',
        mainEntity: buggyQuestions.map((question) => ({
          '@type': 'Question',
          name: question[locale].question,
          url: questionCanonical(question, locale),
          acceptedAnswer: { '@type': 'Answer', text: question[locale].answer },
        })),
      },
    ],
  };
}

export function buildQuestionJsonLd(question: BuggyQuestion, locale: QuestionLocale) {
  const isEn = locale === 'en';
  const canonical = questionCanonical(question, locale);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: isEn ? 'Home' : 'Inicio', item: isEn ? `${siteUrl}/en` : siteUrl },
          { '@type': 'ListItem', position: 2, name: isEn ? 'Buggy questions' : 'Preguntas de buggy', item: questionsCanonical(locale) },
          { '@type': 'ListItem', position: 3, name: question[locale].question, item: canonical },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `${canonical}#faq`,
        mainEntity: [{
          '@type': 'Question',
          name: question[locale].question,
          acceptedAnswer: { '@type': 'Answer', text: question[locale].answer },
        }],
      },
      ...(question.destination !== 'general' ? [{
        '@type': 'Service',
        '@id': `${canonical}#${question.destination}-buggy-tour`,
        name: question.destination === 'bayahibe' ? (isEn ? 'Bayahibe buggy tour' : 'Tour en buggy en Bayahibe') : (isEn ? 'Punta Cana buggy tour' : 'Tour en buggy en Punta Cana'),
        provider: { '@type': 'Organization', name: 'Caribbean Buggy', url: siteUrl },
        areaServed: question.destination === 'bayahibe' ? 'Bayahibe, Dominican Republic' : 'Punta Cana, Dominican Republic',
        ...tripadvisorSchemaReference(question.destination, locale),
      }] : []),
    ],
  };
}
